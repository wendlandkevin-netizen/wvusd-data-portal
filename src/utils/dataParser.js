export const PHONICS_SUBTESTS = [
  { id: 'oralBlending', name: 'Oral Blending', match: /oral blending/i, max: 15, benchmark: 12 },
  { id: 'isolatingSounds', name: 'Isolating Sounds', match: /isolating sounds/i, max: 15, benchmark: 12 },
  { id: 'soundSegmentation', name: 'Sound Segmentation', match: /sound segmentation/i, max: 15, benchmark: 12 },
  { id: 'removingManipulating', name: 'Removing & Manipulating Phonemes', match: /removing and manipulating/i, max: 15, benchmark: 12 },
  { id: 'decodingWords', name: 'Decoding Words', match: /decoding words/i, max: 85, benchmark: 68 },
  { id: 'starReading', name: 'STAR Reading', match: /star.*reading/i, max: 5.0, benchmark: 3.0 },
  { id: 'mathCA', name: 'Math Common Assessment', match: /math.*percent/i, max: 100, benchmark: 70 }
];


/**
 * Normalizes an Illuminate score / reading code to a comparable numeric value.
 * - "PP" (Pre-Primer) -> 0.2
 * - "P" (Primer) -> 0.5
 * - Letter levels "A".."Z" -> 1..26
 * - Numeric levels ("1.2", "3.18", "78.4%", "14/15") -> parsed Float
 */
export function normalizeReadingScore(val) {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  if (!str || str === '-' || str.toLowerCase() === 'n/a' || str === 'T' || str === 'N' || str === 'true' || str === 'false') {
    return null;
  }

  const upper = str.toUpperCase();
  if (upper === 'PP') return 0.2;
  if (upper === 'P') return 0.5;

  // Single letter level A-Z
  if (/^[A-Z]$/.test(upper)) {
    return upper.charCodeAt(0) - 64; // A=1, B=2, ..., Z=26
  }

  // Double letter levels like AA -> 0.1
  if (upper === 'AA') return 0.1;

  // Fraction format e.g. "12/15"
  const fractionMatch = str.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (fractionMatch) {
    const num = parseFloat(fractionMatch[1]);
    const den = parseFloat(fractionMatch[2]);
    if (den > 0) return Number((num / den * 100).toFixed(1));
  }

  // Clean numeric string (e.g. "3.5", "18.2%", "2.4 ARM")
  const numMatch = str.match(/-?\d+(\.\d+)?/);
  if (numMatch) {
    const parsed = parseFloat(numMatch[0]);
    return isNaN(parsed) ? null : parsed;
  }

  return null;
}

/**
 * Parses comma-separated multi-attempt cell strings from Illuminate.
 * e.g. "1.2, 1.4, 1.6, 1.8, P" or "2.3, 3, 3.1"
 * Returns: { latest: string, raw: string, history: string[], latestNumeric: number|null }
 */
export function parseMultiAttempt(cellValue) {
  if (cellValue === null || cellValue === undefined) {
    return { latest: '', raw: '', history: [], latestNumeric: null };
  }

  const raw = String(cellValue).trim();
  if (!raw) {
    return { latest: '', raw: '', history: [], latestNumeric: null };
  }

  const parts = raw
    .split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  if (parts.length === 0) {
    return { latest: '', raw, history: [], latestNumeric: null };
  }

  const latest = parts[parts.length - 1];
  const latestNumeric = normalizeReadingScore(latest);

  return {
    latest,
    raw,
    history: parts,
    latestNumeric
  };
}

/**
 * Compares two scores (previous vs current) to compute Year-over-Year Growth Badge.
 * Returns: { status: 'growth'|'steady'|'decline'|'unknown', badge: string, color: string, delta: number|null, description: string }
 */
export function computeYoYGrowth(prevValue, currValue) {
  const prevParsed = typeof prevValue === 'object' && prevValue?.latest !== undefined ? prevValue : parseMultiAttempt(prevValue);
  const currParsed = typeof currValue === 'object' && currValue?.latest !== undefined ? currValue : parseMultiAttempt(currValue);

  const prev = prevParsed.latestNumeric;
  const curr = currParsed.latestNumeric;

  if (prev === null || curr === null) {
    return {
      status: 'unknown',
      badge: '⚪ Baseline Only',
      color: 'slate',
      delta: null,
      description: curr !== null ? `Current: ${currParsed.latest}` : 'Insufficient YoY data'
    };
  }

  const delta = Number((curr - prev).toFixed(2));

  // Threshold: +/- 0.05
  if (delta > 0.05) {
    return {
      status: 'growth',
      badge: '🟢 Growth',
      color: 'emerald',
      delta,
      description: `+${delta} gain (${prevParsed.latest} → ${currParsed.latest})`
    };
  } else if (delta < -0.05) {
    return {
      status: 'decline',
      badge: '🔴 Decline',
      color: 'rose',
      delta,
      description: `${delta} decline (${prevParsed.latest} → ${currParsed.latest})`
    };
  } else {
    return {
      status: 'steady',
      badge: '🟡 Steady',
      color: 'amber',
      delta: 0,
      description: `Maintained (${prevParsed.latest} → ${currParsed.latest})`
    };
  }
}

/**
 * Helper to dynamically detect academic year prefix and group into assessment family
 */
export function extractMetricInfo(header) {
  if (!header || typeof header !== 'string') return { year: null, base: '', family: '' };
  
  const yearMatch = header.match(/^(\d{4}-\d{4})\s+(.*)$/);
  const year = yearMatch ? yearMatch[1] : null;
  const rest = (yearMatch ? yearMatch[2] : header).trim();

  let family = rest;
  // Dynamic normalization to pair across years
  if (/amira.*arm/i.test(rest) && !/level|status|risk/i.test(rest)) {
    family = 'Amira ARM Fluency';
  } else if (/amira.*dyslexia.*status/i.test(rest)) {
    family = 'Amira Dyslexia Status';
  } else if (/star.*reading.*instructional.*level/i.test(rest)) {
    family = 'STAR Reading IRL';
  } else if (/star.*math/i.test(rest)) {
    family = 'STAR Math';
  } else if (/oral reading record|orr/i.test(rest)) {
    family = 'Oral Reading Record (ORR)';
  } else if (/\bmath\b.*percent/i.test(rest) || /math common assessment/i.test(rest)) {
    family = 'Math Common Assessment';
  } else if (/writing.*narrative.*content/i.test(rest)) {
    family = 'Writing: Narrative Content';
  } else if (/writing.*narrative.*conventions/i.test(rest)) {
    family = 'Writing: Narrative Conventions';
  } else if (/writing.*opinion.*content/i.test(rest)) {
    family = 'Writing: Opinion Content';
  } else if (/writing.*opinion.*conventions/i.test(rest)) {
    family = 'Writing: Opinion Conventions';
  } else if (/writing.*informational.*content/i.test(rest)) {
    family = 'Writing: Informational Content';
  } else if (/writing.*informational.*conventions/i.test(rest)) {
    family = 'Writing: Informational Conventions';
  } else if (/oral blending.*number correct/i.test(rest)) {
    family = 'Oral Blending';
  } else if (/isolating sounds.*number correct/i.test(rest)) {
    family = 'Isolating Sounds';
  } else if (/sound segmentation.*number correct/i.test(rest)) {
    family = 'Sound Segmentation';
  } else if (/removing and manipulating.*number correct/i.test(rest)) {
    family = 'Removing & Manipulating Phonemes';
  } else if (/decoding words.*number correct/i.test(rest)) {
    family = 'Decoding Words';
  } else if (/digraph/i.test(rest)) {
    family = 'Digraphs & Vowel Sounds';
  }

  return { year, rest, family };
}

/**
 * Standard tier classification for any percentage score
 */
export function getTierClassification(score, max) {
  if (score === null || score === undefined || isNaN(score) || max <= 0) {
    return { tier: 'Unknown', tierNum: 0, label: 'No Data', color: 'slate', percent: 0 };
  }
  const pct = Math.round((Number(score) / max) * 100);
  if (pct < 60) {
    return { tier: 'Intensive Needs', tierNum: 3, label: '🔴 Intensive (<60%)', color: 'rose', percent: pct };
  }
  if (pct < 80) {
    return { tier: 'Strategic Support', tierNum: 2, label: '🟡 Strategic (60-79%)', color: 'amber', percent: pct };
  }
  return { tier: 'Benchmark', tierNum: 1, label: '🟢 Benchmark (80%+)', color: 'emerald', percent: pct };
}

/**
 * Parse a raw student record from the live Google Sheet / GAS API dynamically across all matched tabs
 */
export function parseStudentRecord(raw) {
  if (!raw) return null;

  // Authoritative Roster Fields
  const id = String(raw.id || raw['Student ID'] || '');
  const name = String(raw.name || raw['Student Name'] || 'Unknown Student');
  const gradeStr = String(raw.grade || raw['Grade Level'] || '');
  // Extract number e.g. "3rd" -> 3, "5th" -> 5, "K" -> 0
  const gradeNumMatch = gradeStr.match(/\d+/);
  const grade = gradeNumMatch ? parseInt(gradeNumMatch[0], 10) : (gradeStr.toUpperCase() === 'K' ? 0 : 3);
  
  const school = String(raw.site || raw.school || raw['School Site'] || 'WVUSD Elementary');
  const site = school;
  const siteKey = raw.siteKey || '';
  const teacher = String(raw.teacherName || raw.teacher || raw['Teacher Name'] || 'Unassigned');
  const teacherEmail = raw.teacherEmail || '';

  // Demographic & Special Program Flags
  const elRaw = String(raw.flags?.elStatus || raw.elStatus || raw['EL Status'] || '').trim();
  const isEL = Boolean(
    elRaw &&
    !elRaw.toLowerCase().includes('english only') &&
    !elRaw.toLowerCase().includes('eo') &&
    elRaw !== 'N' &&
    elRaw !== 'No'
  );
  const elLevel = isEL ? elRaw : null;

  const spedRaw = String(raw.flags?.sped || raw.sped || raw['SpEd'] || '').trim();
  const isSpEd = Boolean(
    spedRaw &&
    spedRaw !== 'N' &&
    spedRaw !== 'No' &&
    spedRaw !== 'F' &&
    spedRaw !== 'false'
  );
  const spedType = isSpEd ? (spedRaw === 'T' || spedRaw === 'true' ? 'Special Education' : spedRaw) : null;

  const p504 = raw.flags?.plan504 || raw['504'] || raw['504 Accommodations'];
  const is504 = Boolean(
    p504 === 'Y' || p504 === 'Yes' || p504 === '504' || p504 === true || p504 === 'true' || p504 === 'T'
  );

  const fh = raw.flags?.fosterHomeless || raw['Foster/Homeless'];
  const isFosterHomeless = Boolean(
    fh === 'Y' || fh === 'Yes' || fh === true || fh === 'true' || fh === 'T'
  );

  // Group assessments across all matched tabs (e.g. "3rd ELA", "3rd Math", etc.)
  const rawAssessmentsByTab = raw.assessmentsByTab || {};
  const matchedTabs = Object.keys(rawAssessmentsByTab);
  const metrics = raw.metrics || {};

  // Parse all columns by tab
  const parsedTabs = {};
  const allParsedColumns = [];
  const familyYearMap = {};

  for (const [tabName, tabData] of Object.entries(rawAssessmentsByTab)) {
    parsedTabs[tabName] = [];
    for (const [header, val] of Object.entries(tabData || {})) {
      if (val === null || val === undefined || val === '') continue;
      // Skip roster echoes if any
      if (header.includes('User Name') || header.includes('English Proficiency') || header.includes('Special Ed') || header.includes('504 Accommodations')) {
        continue;
      }

      const info = extractMetricInfo(header);
      const parsed = parseMultiAttempt(val);

      const colObj = {
        tab: tabName,
        header,
        year: info.year,
        baseName: info.rest,
        family: info.family,
        rawVal: val,
        parsed
      };

      parsedTabs[tabName].push(colObj);
      allParsedColumns.push(colObj);

      if (info.year) {
        if (!familyYearMap[info.family]) familyYearMap[info.family] = {};
        familyYearMap[info.family][info.year] = colObj;
      }
    }
  }

  // Also inspect any un-tabbed metrics in raw.metrics
  for (const [header, val] of Object.entries(metrics)) {
    if (!allParsedColumns.some(c => c.header === header)) {
      if (val === null || val === undefined || val === '') continue;
      if (header.includes('User Name') || header.includes('English Proficiency') || header.includes('Special Ed') || header.includes('504 Accommodations')) {
        continue;
      }
      const info = extractMetricInfo(header);
      const parsed = parseMultiAttempt(val);
      const colObj = {
        tab: 'General',
        header,
        year: info.year,
        baseName: info.rest,
        family: info.family,
        rawVal: val,
        parsed
      };
      allParsedColumns.push(colObj);
      if (info.year) {
        if (!familyYearMap[info.family]) familyYearMap[info.family] = {};
        familyYearMap[info.family][info.year] = colObj;
      }
    }
  }

  // Dynamic Multi-Year Comparisons
  const yoyComparisons = [];
  for (const [family, years] of Object.entries(familyYearMap)) {
    const sortedYears = Object.keys(years).sort();
    if (sortedYears.length >= 2) {
      const prevCol = years[sortedYears[0]];
      const currCol = years[sortedYears[sortedYears.length - 1]];
      const growth = computeYoYGrowth(prevCol.parsed, currCol.parsed);
      if (growth.status !== 'unknown') {
        yoyComparisons.push({
          family,
          prevYear: sortedYears[0],
          currYear: sortedYears[sortedYears.length - 1],
          prev: prevCol,
          curr: currCol,
          growth
        });
      }
    }
  }

  const declines = yoyComparisons.filter(c => c.growth.status === 'decline').length;
  const growths = yoyComparisons.filter(c => c.growth.status === 'growth').length;
  const hasYoYDecline = declines >= 1;
  const overallYoYStatus = declines > growths ? 'decline' : growths > 0 ? 'growth' : (yoyComparisons.length > 0 ? 'steady' : 'unknown');

  // Detect Headline Metrics for the Student Card (from whichever ELA & Math tabs matched!)
  const findFamilyLatest = (famPattern) => {
    // Look first in multi-year curr, then in all parsed columns
    const matched = allParsedColumns.filter(c => famPattern.test(c.family) || famPattern.test(c.header));
    if (matched.length === 0) return null;
    // Prefer column with recent year or latest score
    matched.sort((a, b) => (b.year || '').localeCompare(a.year || ''));
    return matched[0];
  };

  const amiraCol = findFamilyLatest(/amira.*arm/i);
  const starCol = findFamilyLatest(/star.*reading/i);
  const orrCol = findFamilyLatest(/orr|oral reading/i);
  const mathCol = findFamilyLatest(/math.*percent|math common/i);
  const phonicsCol = findFamilyLatest(/phonics|decoding|sound segmentation/i);

  // Extract Phonics Subtests dynamically if present
  const phonics = allParsedColumns
    .filter(c => /blending|isolating|segmentation|manipulating|decoding|vowel|phonics/i.test(c.header))
    .map(c => {
      const maxMatch = c.header.match(/out of\s+(\d+)/i) || c.header.match(/\/(\d+)/);
      const max = maxMatch ? parseInt(maxMatch[1], 10) : 15;
      const tierInfo = getTierClassification(c.parsed.latestNumeric, max);
      return {
        id: c.header,
        name: c.baseName,
        header: c.header,
        score: c.parsed.latestNumeric,
        max,
        percent: tierInfo.percent,
        tier: tierInfo.tier,
        tierNum: tierInfo.tierNum,
        color: tierInfo.color,
        testedAt: c.year || '2026-2027',
        parsed: c.parsed
      };
    });

  const hasTier3Phonics = phonics.some(p => p.tierNum === 3);

  // Extract Writing Rubric Scores dynamically if present
  const writing = allParsedColumns
    .filter(c => /writing.*common assessment/i.test(c.header))
    .map(c => ({
      header: c.header,
      name: c.baseName.replace(/WVUSD Writing Common Assessment\s*/i, ''),
      genre: /narrative/i.test(c.header) ? 'Narrative' : /opinion/i.test(c.header) ? 'Opinion' : 'Informational',
      score: c.parsed.latestNumeric,
      max: 4,
      isBenchmark: c.parsed.latestNumeric !== null ? c.parsed.latestNumeric >= 3 : false
    }));

  // Benchmark determination: grade level reading or math >= 70%
  const isBenchmark = Boolean(
    (starCol?.parsed.latestNumeric !== null && starCol?.parsed.latestNumeric >= grade) ||
    (amiraCol?.parsed.latestNumeric !== null && amiraCol?.parsed.latestNumeric >= grade) ||
    (mathCol?.parsed.latestNumeric !== null && mathCol?.parsed.latestNumeric >= 70)
  );

  return {
    id,
    name,
    grade,
    gradeStr,
    school,
    site,
    siteKey,
    teacher,
    teacherName: teacher,
    teacherEmail,
    isEL,
    elLevel,
    isSpEd,
    spedType,
    is504,
    isFosterHomeless,
    matchedTabs,
    assessmentsByTab: parsedTabs,
    allParsedColumns,
    yoyComparisons,
    hasYoYDecline,
    overallYoYStatus,
    headline: {
      amira: amiraCol,
      star: starCol,
      orr: orrCol,
      math: mathCol,
      phonics: phonicsCol
    },
    phonics,
    hasTier3Phonics,
    writing,
    isBenchmark,
    raw
  };
}

/**
 * Generates an automated SST & Intervention prompt for WVUSD SST NotebookLM
 */
export function generateSSTPrompt(student) {
  if (!student) return '';

  const matchedTabsList = student.matchedTabs?.join(', ') || 'General Assessment';
  
  // YoY comparison highlights
  const yoySummaries = student.yoyComparisons.map(c => 
    `- ${c.family} (${c.prevYear} → ${c.currYear}): ${c.prev.parsed.latest} → ${c.curr.parsed.latest} (${c.growth.badge})`
  ).join('\n') || '- Single-year baseline available';

  // Specific deficits
  const phonicsDeficits = student.phonics
    .filter(p => p.score !== null && p.percent < 70)
    .map(p => `- ${p.name}: ${p.score}/${p.max} (${p.percent}%) [${p.tier}]`)
    .join('\n');

  // Math deficits
  const mathMetrics = student.allParsedColumns
    .filter(c => /math/i.test(c.header) && c.parsed.latestNumeric !== null)
    .map(c => `- ${c.baseName}: ${c.parsed.latest}%`)
    .join('\n');

  const programs = [];
  if (student.isEL) programs.push(`English Learner (${student.elLevel || 'EL'})`);
  if (student.isSpEd) programs.push(`Special Education (${student.spedType || 'IEP'})`);
  if (student.is504) programs.push(`Section 504 Plan`);
  if (student.isFosterHomeless) programs.push(`Foster / Homeless Youth Support`);
  const programStr = programs.length > 0 ? programs.join(', ') : 'General Education';

  return `WVUSD SST & MULTI-TIERED INTERVENTION ANALYSIS PROMPT
======================================================
STUDENT PROFILE:
- Student Name: ${student.name}
- Student ID: #${student.id}
- School Site: ${student.school}
- Grade Level: Grade ${student.gradeStr || student.grade}
- Teacher: ${student.teacher}
- Matched Sheet Tabs: [${matchedTabsList}]
- Special Programs / Flags: ${programStr}

YEAR-OVER-YEAR (YoY) TRAJECTORIES & MULTI-ATTEMPT TRAILS:
${yoySummaries}

LITERACY & PHONICS MICRO-SKILL DEFICITS:
${phonicsDeficits || '- No critical phonics deficit identified'}

MATHEMATICS COMMON ASSESSMENT PROFILE:
${mathMetrics || '- Math performance data pending'}

REQUEST FOR WVUSD SST NOTEBOOKLM:
1. Synthesize the above academic profile across ELA and Math. Identify root instructional vulnerabilities (e.g. phonemic segmentation vs fluency prosody vs math conceptual calculation).
2. Recommend 3 highly targeted Tier 2 / Tier 3 evidence-based intervention pull-out table routines (15-20 minutes daily) using WVUSD adopted curricula (e.g., UFLI Foundations, 95% Group, Math Expressions Targeted Intervention).
3. Formulate measurable 6-week SMART goals with progress monitoring checkpoints for the upcoming Student Success Team (SST) review.
4. Include scaffolding accommodations specifically tailored for ${student.isEL ? 'English Learner language acquisition' : 'accommodating multimodal learning needs'}.
`;
}
