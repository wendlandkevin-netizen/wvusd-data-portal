// src/utils/dataParser.js

/**
 * Normalizes an Illuminate score / reading code to a comparable numeric value.
 * - "PP" (Pre-Primer) -> 0.2
 * - "P" (Primer) -> 0.5
 * - Letter levels "A".."Z" -> 1..26
 * - Numeric levels ("1.2", "3.18") -> parsed Float
 */
export function normalizeReadingScore(val) {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  if (!str || str === '-' || str.toLowerCase() === 'n/a') return null;

  const upper = str.toUpperCase();
  if (upper === 'PP') return 0.2;
  if (upper === 'P') return 0.5;

  // Single letter level A-Z
  if (/^[A-Z]$/.test(upper)) {
    return upper.charCodeAt(0) - 64; // A=1, B=2, ..., Z=26
  }

  // Double letter levels like AA -> 0.1
  if (upper === 'AA') return 0.1;

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
 * Returns: { status: 'growth'|'steady'|'decline'|'unknown', badge: string, delta: number|null, description: string }
 */
export function computeYoYGrowth(prevValue, currValue) {
  const prevParsed = parseMultiAttempt(prevValue);
  const currParsed = parseMultiAttempt(currValue);

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
      badge: '🔴 Decline / Regression',
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
 * Standard Foundational Phonics subtests specifications and max points
 */
export const PHONICS_SUBTESTS = [
  { id: 'oralBlending', name: 'Oral Blending', max: 15, benchmark: 12 },
  { id: 'digraphsVowels', name: 'Digraphs & Vowel Sounds', max: 15, benchmark: 12 },
  { id: 'isolatingSounds', name: 'Isolating Sounds', max: 15, benchmark: 12 },
  { id: 'soundSegmentation', name: 'Sound Segmentation', max: 15, benchmark: 12 },
  { id: 'removingManipulating', name: 'Removing & Manipulating Phonemes', max: 15, benchmark: 12 },
  { id: 'decodingWords', name: 'Decoding Words', max: 85, benchmark: 68 },
  { id: 'firstGradeWordList', name: '1st Grade Word List', max: 55, benchmark: 44 }
];

/**
 * Standard Writing Common Assessment Rubric fields (scale 1-4)
 */
export const WRITING_RUBRIC_FIELDS = [
  { id: 'narrativeContent', name: 'Narrative Content', genre: 'Narrative', max: 4 },
  { id: 'narrativeConventions', name: 'Narrative Conventions', genre: 'Narrative', max: 4 },
  { id: 'opinionContent', name: 'Opinion Content', genre: 'Opinion', max: 4 },
  { id: 'opinionConventions', name: 'Opinion Conventions', genre: 'Opinion', max: 4 },
  { id: 'informationalContent', name: 'Informational Content', genre: 'Informational', max: 4 },
  { id: 'informationalConventions', name: 'Informational Conventions', genre: 'Informational', max: 4 }
];

/**
 * Evaluates performance tier based on percentage score:
 * < 60% : Tier 3 (Intensive Needs)
 * 60% - 79% : Tier 2 (Strategic Support)
 * >= 80% : Tier 1 (Benchmark)
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
 * Normalizes and comprehensively parses a raw student record from Illuminate or sample data
 */
export function parseStudentRecord(raw) {
  if (!raw) return null;

  // Student Identity
  const id = String(raw.studentId || raw.id || raw['Student ID'] || `WV-${Math.floor(100000 + Math.random() * 900000)}`);
  const name = String(raw.studentName || raw.name || raw['Student Name'] || 'Student');
  const grade = Number(raw.grade || raw.gradeLevel || raw['Grade Level'] || 3);
  const school = String(raw.school || raw.site || raw.schoolSite || raw['School Site'] || 'Collegewood Elementary');
  const teacher = String(raw.teacher || raw['Teacher Name'] || 'Teacher');

  // Demographic & Program Badges
  const isEL = Boolean(raw.isEL || raw.el || raw['EL'] === 'Y' || raw['EL Status']?.includes('EL') || raw['English Learner']);
  const elLevel = raw.elLevel || raw['EL Level'] || (isEL ? 'Expanding (Level 3)' : null);
  const isSpEd = Boolean(raw.isSpEd || raw.sped || raw['SpEd'] === 'Y' || raw['Special Ed']);
  const spedType = raw.spedType || (isSpEd ? 'IEP - Resource Specialist' : null);
  const is504 = Boolean(raw.is504 || raw['504'] === 'Y' || raw['504 Plan']);
  const isFosterHomeless = Boolean(raw.isFosterHomeless || raw.foster || raw.homeless || raw['Foster/Homeless'] === 'Y');

  // Amira YoY:
  // 2025-2026 Amira Data Tri 3 ARM vs 2026-2027 Amira Data Baseline ARM
  const prevAmiraRaw = raw.prevAmiraArm || raw['2025-2026 Amira Data Tri 3 ARM (AMIRA Score)'] || raw.amira_prev;
  const currAmiraRaw = raw.currAmiraArm || raw['2026-2027 Amira Data Baseline ARM (AMIRA Score)'] || raw.amira_curr;
  const amiraPrev = parseMultiAttempt(prevAmiraRaw);
  const amiraCurr = parseMultiAttempt(currAmiraRaw);
  const amiraGrowth = computeYoYGrowth(prevAmiraRaw, currAmiraRaw);

  // STAR Reading YoY:
  // 2025-2026 STAR Renaissance (v.2) Reading (Spring) vs 2026-2027 STAR Renaissance (v.2) Reading (Fall)
  const prevStarRaw = raw.prevStarReading || raw['2025-2026 STAR Renaissance (v.2) Reading (Spring) Instructional Reading Level'] || raw.star_prev;
  const currStarRaw = raw.currStarReading || raw['2026-2027 STAR Renaissance (v.2) Reading (Fall) Instructional Reading Level'] || raw.star_curr;
  const starPrev = parseMultiAttempt(prevStarRaw);
  const starCurr = parseMultiAttempt(currStarRaw);
  const starGrowth = computeYoYGrowth(prevStarRaw, currStarRaw);

  // Oral Reading Record (ORR) YoY:
  // 2025-2026 WVUSD Oral Reading Record ORR Level - Tri 3 vs 2026-2027 WVUSD Oral Reading Record ORR Level - Tri 1
  const prevOrrRaw = raw.prevOrrLevel || raw['2025-2026 WVUSD Oral Reading Record ORR Level - Tri 3'] || raw.orr_prev;
  const currOrrRaw = raw.currOrrLevel || raw['2026-2027 WVUSD Oral Reading Record ORR Level - Tri 1'] || raw.orr_curr;
  const orrPrev = parseMultiAttempt(prevOrrRaw);
  const orrCurr = parseMultiAttempt(currOrrRaw);
  const orrGrowth = computeYoYGrowth(prevOrrRaw, currOrrRaw);

  // Overall YoY Growth Flag
  const declines = [amiraGrowth, starGrowth, orrGrowth].filter(g => g.status === 'decline').length;
  const growths = [amiraGrowth, starGrowth, orrGrowth].filter(g => g.status === 'growth').length;
  const hasYoYDecline = declines >= 1;
  const overallYoYStatus = declines > growths ? 'decline' : growths > 0 ? 'growth' : 'steady';

  // 7 Foundational Phonics Subtests
  const phonics = PHONICS_SUBTESTS.map(subtest => {
    const rawVal = raw.phonics?.[subtest.id] ?? raw[subtest.name] ?? raw[`phonics_${subtest.id}`];
    let score = null;
    let testedAt = raw.phonics?.[`${subtest.id}_date`] || raw[`${subtest.name} Date`] || 'Sep 2026';
    
    if (typeof rawVal === 'object' && rawVal !== null) {
      score = rawVal.score !== undefined ? Number(rawVal.score) : null;
      testedAt = rawVal.testedAt || testedAt;
    } else if (rawVal !== undefined && rawVal !== null && rawVal !== '') {
      score = Number(rawVal);
    }

    const tierInfo = getTierClassification(score, subtest.max);

    return {
      id: subtest.id,
      name: subtest.name,
      max: subtest.max,
      benchmark: subtest.benchmark,
      score: score !== null && !isNaN(score) ? score : null,
      percent: tierInfo.percent,
      tier: tierInfo.tier,
      tierNum: tierInfo.tierNum,
      color: tierInfo.color,
      testedAt
    };
  });

  const lowestPhonics = [...phonics]
    .filter(p => p.score !== null)
    .sort((a, b) => a.percent - b.percent);

  const hasTier3Phonics = phonics.some(p => p.tierNum === 3);

  // 6 Writing Rubric Scores (scale 1-4)
  const writing = WRITING_RUBRIC_FIELDS.map(field => {
    const rawScore = raw.writing?.[field.id] ?? raw[field.name] ?? raw[`writing_${field.id}`];
    const score = (rawScore !== undefined && rawScore !== null && rawScore !== '') ? Number(rawScore) : null;
    return {
      id: field.id,
      name: field.name,
      genre: field.genre,
      max: 4,
      score: score !== null && !isNaN(score) ? score : null,
      isBenchmark: score !== null ? score >= 3 : false
    };
  });

  // Calculate overall benchmark status
  // Student is benchmark if latest STAR is grade level or Amira >= grade level equivalent
  const starBenchmark = (starCurr.latestNumeric || 0) >= grade;
  const amiraBenchmark = (amiraCurr.latestNumeric || 0) >= grade;
  const isBenchmark = starBenchmark || amiraBenchmark;

  return {
    id,
    name,
    grade,
    school,
    teacher,
    isEL,
    elLevel,
    isSpEd,
    spedType,
    is504,
    isFosterHomeless,
    amira: {
      prev: amiraPrev,
      curr: amiraCurr,
      growth: amiraGrowth
    },
    star: {
      prev: starPrev,
      curr: starCurr,
      growth: starGrowth
    },
    orr: {
      prev: orrPrev,
      curr: orrCurr,
      growth: orrGrowth
    },
    hasYoYDecline,
    overallYoYStatus,
    phonics,
    lowestPhonics,
    hasTier3Phonics,
    writing,
    isBenchmark,
    raw
  };
}

/**
 * Generates an automated, rich Student Success Team (SST) Intervention prompt
 * formatted to paste directly into WVUSD SST NotebookLM.
 */
export function generateSSTPrompt(student) {
  if (!student) return '';

  const lowestSkills = student.lowestPhonics.slice(0, 3);
  const skillBulletPoints = lowestSkills
    .map(s => `- ${s.name}: ${s.score !== null ? `${s.score}/${s.max} (${s.percent}%)` : 'Not Assessed'} [${s.tier}]`)
    .join('\n');

  const writingScores = student.writing
    .filter(w => w.score !== null)
    .map(w => `- ${w.name}: ${w.score}/4.0`)
    .join('\n');

  const yoySummary = [
    `Amira ARM: ${student.amira.prev.latest || 'N/A'} → ${student.amira.curr.latest || 'N/A'} (${student.amira.growth.badge})`,
    `STAR Reading: ${student.star.prev.latest || 'N/A'} → ${student.star.curr.latest || 'N/A'} (${student.star.growth.badge})`,
    `ORR Level: ${student.orr.prev.latest || 'N/A'} → ${student.orr.curr.latest || 'N/A'} (${student.orr.growth.badge})`
  ].join(' | ');

  const programs = [];
  if (student.isEL) programs.push(`English Learner (${student.elLevel || 'EL'})`);
  if (student.isSpEd) programs.push(`Special Education (${student.spedType || 'IEP'})`);
  if (student.is504) programs.push(`Section 504 Plan`);
  if (student.isFosterHomeless) programs.push(`Foster / Homeless Youth Support`);
  const programStr = programs.length > 0 ? programs.join(', ') : 'General Education';

  return `WVUSD SST & INTERVENTION ANALYSIS PROMPT
==============================================
STUDENT PROFILE:
- Student Name: ${student.name}
- Student ID: ${student.id}
- School Site: ${student.school}
- Grade Level: Grade ${student.grade}
- Teacher: ${student.teacher}
- Special Programs / Flags: ${programStr}

YEAR-OVER-YEAR (YoY) TRAJECTORY:
- ${yoySummary}
- Multi-Attempt Trail (STAR): [${student.star.curr.history.join(' → ')}]
- Multi-Attempt Trail (Amira): [${student.amira.curr.history.join(' → ')}]
- Multi-Attempt Trail (ORR): [${student.orr.curr.history.join(' → ')}]

IDENTIFIED LITERACY MICRO-SKILL DEFICITS (Foundational Phonics):
${skillBulletPoints || '- No critical deficit recorded'}

WRITING COMMON ASSESSMENT RUBRICS:
${writingScores || '- Writing rubric data pending'}

REQUEST FOR WVUSD SST NOTEBOOKLM:
1. Synthesize the above assessment trajectory and identify the root literacy breakdown (e.g. phonemic segmentation vs. decoding multisyllabic words vs. comprehension fluency).
2. Recommend 3 highly targeted Tier 2 / Tier 3 evidence-based intervention strategies (15-20 min daily pull-out table routine) using WVUSD adopted curricula (e.g., UFLI Foundations, 95% Group, or Heggerty Phonemic Awareness).
3. Draft measurable 6-week SMART goals with progress monitoring checkpoints for the next SST follow-up review.
4. Include scaffolding accommodations specifically suited for ${student.isEL ? 'English Learner language acquisition' : 'accommodating diverse learning modalities'}.
`;
}
