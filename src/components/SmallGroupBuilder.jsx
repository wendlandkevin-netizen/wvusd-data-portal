// src/components/SmallGroupBuilder.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Printer, 
  CheckCircle2,
  ListFilter,
  BookOpen,
  Calculator,
  Layers
} from 'lucide-react';
import { parseMultiAttempt } from '../utils/dataParser';

export default function SmallGroupBuilder({
  students = [],
  selectedSchool,
  selectedGrade,
  selectedTeacher,
  meta,
  onSelectStudent
}) {
  const tabHeadersByTab = useMemo(() => meta?.tabHeadersByTab || {}, [meta?.tabHeadersByTab]);
  const allTabs = useMemo(() => Object.keys(tabHeadersByTab), [tabHeadersByTab]);

  // Available tabs matching active grade scope
  const relevantTabs = useMemo(() => {
    if (selectedGrade !== 'ALL') {
      const gClean = String(selectedGrade).toLowerCase().replace(/\s+/g, '');
      const filtered = allTabs.filter(t => t.toLowerCase().replace(/\s+/g, '').includes(gClean));
      if (filtered.length > 0) return filtered;
    }
    return allTabs.length > 0 ? allTabs : ['3rd ELA', '3rd Math'];
  }, [allTabs, selectedGrade]);

  const [activeTabOverride, setActiveTabOverride] = useState(null);
  const activeTab = (activeTabOverride && relevantTabs.includes(activeTabOverride)) 
    ? activeTabOverride 
    : (relevantTabs[0] || '3rd ELA');

  const [selectedHeaderOverride, setSelectedHeaderOverride] = useState(null);
  const [copied, setCopied] = useState(false);

  // Headers available in current active tab (filter out non-assessment columns)
  const tabHeaders = useMemo(() => {
    const rawHeaders = tabHeadersByTab[activeTab] || [];
    return rawHeaders.filter(h => 
      !h.includes('User Name') && 
      !h.includes('English Proficiency') && 
      !h.includes('Special Ed') && 
      !h.includes('504 Accommodations') &&
      !h.includes('Date and Time') &&
      !h.includes('Attempts Number Possible')
    );
  }, [tabHeadersByTab, activeTab]);

  // Derive preferred / active header
  const selectedHeader = useMemo(() => {
    if (selectedHeaderOverride && tabHeaders.includes(selectedHeaderOverride)) {
      return selectedHeaderOverride;
    }
    if (tabHeaders.length === 0) return '';
    return tabHeaders.find(h => /ARM|STAR|Percent Correct|Sound Segmentation|Decoding/i.test(h)) || tabHeaders[0];
  }, [selectedHeaderOverride, tabHeaders]);

  // Scope students matching school, grade, teacher
  const scopeStudents = useMemo(() => {
    return students.filter((s) => {
      if (selectedSchool !== 'ALL' && s.school !== selectedSchool && s.site !== selectedSchool) return false;
      if (selectedGrade !== 'ALL') {
        const matchGradeStr = s.gradeStr === selectedGrade;
        const matchGradeNum = String(s.grade) === String(selectedGrade).replace(/\D/g, '');
        if (!matchGradeStr && !matchGradeNum) return false;
      }
      if (selectedTeacher !== 'ALL' && s.teacher !== selectedTeacher) return false;
      return true;
    });
  }, [students, selectedSchool, selectedGrade, selectedTeacher]);

  // Evaluate any student on the selected header
  const evaluateStudent = useCallback((student, header) => {
    if (!header) return { score: null, display: '—', percent: 0 };

    // Look in raw assessmentsByTab, or metrics, or allParsedColumns
    let rawVal = student.raw?.assessmentsByTab?.[activeTab]?.[header];
    if (rawVal === undefined || rawVal === null) {
      rawVal = student.raw?.metrics?.[header];
    }
    if (rawVal === undefined || rawVal === null) {
      const col = student.allParsedColumns?.find(c => c.header === header);
      rawVal = col?.rawVal;
    }

    if (rawVal === undefined || rawVal === null || rawVal === '' || rawVal === '-') {
      return { score: null, display: 'No Score', percent: 0 };
    }

    const parsed = parseMultiAttempt(rawVal);
    const num = parsed.latestNumeric;

    if (num === null) {
      return { score: null, display: parsed.latest || 'N/A', percent: 0 };
    }

    // Determine max and percentage
    let max = 100;
    let percent = Math.round(num);

    const outOfMatch = header.match(/out of\s+(\d+)/i) || header.match(/\/(\d+)/);
    if (outOfMatch) {
      max = parseInt(outOfMatch[1], 10);
      percent = Math.min(100, Math.round((num / max) * 100));
    } else if (/percent/i.test(header)) {
      max = 100;
      percent = Math.min(100, Math.round(num));
    } else if (/writing/i.test(header) || /rubric/i.test(header) || (num <= 4 && /content|conventions/i.test(header))) {
      max = 4;
      percent = Math.min(100, Math.round((num / 4) * 100));
    } else if (/arm|star/i.test(header)) {
      // Benchmark against grade level
      const targetGrade = student.grade || 3;
      percent = Math.min(100, Math.round((num / Math.max(1, targetGrade)) * 80));
    } else if (num <= 15) {
      max = 15;
      percent = Math.min(100, Math.round((num / 15) * 100));
    }

    return {
      score: num,
      display: parsed.latest,
      history: parsed.history,
      percent
    };
  }, [activeTab]);

  // Group scoped students into 3 Tiers
  const groups = useMemo(() => {
    const intensive = [];
    const strategic = [];
    const benchmark = [];
    const unassessed = [];

    scopeStudents.forEach((student) => {
      const res = evaluateStudent(student, selectedHeader);
      const studentWithScore = {
        ...student,
        evalScore: res.score,
        evalDisplay: res.display,
        evalHistory: res.history || [],
        evalPercent: res.percent
      };

      if (res.score === null) {
        unassessed.push(studentWithScore);
      } else if (res.percent < 60) {
        intensive.push(studentWithScore);
      } else if (res.percent < 80) {
        strategic.push(studentWithScore);
      } else {
        benchmark.push(studentWithScore);
      }
    });

    intensive.sort((a, b) => a.evalPercent - b.evalPercent);
    strategic.sort((a, b) => a.evalPercent - b.evalPercent);
    benchmark.sort((a, b) => b.evalPercent - a.evalPercent);

    return { intensive, strategic, benchmark, unassessed };
  }, [scopeStudents, selectedHeader, evaluateStudent]);

  // Suggested instructional focus routines for each column
  const getFocusRoutine = (tier) => {
    const isMath = /math/i.test(activeTab) || /math/i.test(selectedHeader);
    const isWriting = /writing/i.test(selectedHeader);

    if (isMath) {
      if (tier === 'intensive') return 'Targeted Math Workshop: Concrete-Representational-Abstract manipulatives & small-group re-teaching of targeted standard.';
      if (tier === 'strategic') return 'Guided Problem Solving: Error analysis routines, visual math modeling, and peer math discourse.';
      return 'Math Enrichment: Open-ended mathematical tasks, multi-step problem solving, and real-world investigations.';
    }

    if (isWriting) {
      if (tier === 'intensive') return 'Interactive sentence-framing, oral rehearsal, and explicit anchor chart conventions modeling.';
      if (tier === 'strategic') return 'Focus on transition phrases, evidence elaboration, and self-check rubric editing.';
      return 'Advanced author craft: Varying sentence lengths, vivid sensory diction, and peer review editing.';
    }

    // Phonics / ELA Reading
    if (tier === 'intensive') return 'Daily 15-20m pull-out: UFLI Foundations sound manipulation with elkonin sound boxes & continuous blending drill.';
    if (tier === 'strategic') return 'Targeted 15m routine: Guided decodable passage repeated reading with focus on targeted phonics pattern.';
    return 'Enrichment routine: Multisyllabic word decoding, morphological prefix/suffix study, and paired fluency reading.';
  };

  // Copy groupings to clipboard
  const handleCopyGroups = () => {
    const text = `WVUSD SMALL GROUP ROSTERS: ${selectedHeader || activeTab}
Sheet Tab: ${activeTab} | Scope: ${selectedSchool !== 'ALL' ? selectedSchool : 'All Sites'} | Grade: ${selectedGrade !== 'ALL' ? selectedGrade : 'All'} | Teacher: ${selectedTeacher !== 'ALL' ? selectedTeacher : 'All'}
Generated: ${new Date().toLocaleDateString()}

🔴 TIER 3: INTENSIVE NEEDS (<60%) [Count: ${groups.intensive.length}]
Instructional Focus: ${getFocusRoutine('intensive')}
Students:
${groups.intensive.map(s => `- ${s.name} (#${s.id}) [Score: ${s.evalDisplay}, ${s.evalPercent}%] ${s.elType && s.elType !== 'EO' ? `[${s.elType}]` : ''} ${s.isSpEd ? '[IEP]' : ''} ${s.isFosterHomeless ? `[${s.fosterHomelessType || 'Foster/HL'}]` : ''}`).join('\n') || 'None'}

🟡 TIER 2: STRATEGIC SUPPORT (60-79%) [Count: ${groups.strategic.length}]
Instructional Focus: ${getFocusRoutine('strategic')}
Students:
${groups.strategic.map(s => `- ${s.name} (#${s.id}) [Score: ${s.evalDisplay}, ${s.evalPercent}%] ${s.elType && s.elType !== 'EO' ? `[${s.elType}]` : ''} ${s.isSpEd ? '[IEP]' : ''} ${s.isFosterHomeless ? `[${s.fosterHomelessType || 'Foster/HL'}]` : ''}`).join('\n') || 'None'}

🟢 TIER 1: BENCHMARK (80%+) [Count: ${groups.benchmark.length}]
Instructional Focus: ${getFocusRoutine('benchmark')}
Students:
${groups.benchmark.map(s => `- ${s.name} (#${s.id}) [Score: ${s.evalDisplay}, ${s.evalPercent}%] ${s.elType && s.elType !== 'EO' ? `[${s.elType}]` : ''} ${s.isSpEd ? '[IEP]' : ''} ${s.isFosterHomeless ? `[${s.fosterHomelessType || 'Foster/HL'}]` : ''}`).join('\n') || 'None'}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Banner & Assessment Selection Ribbon */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                Click-an-Assessment Small Group Builder
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select ANY column header from your live Google Sheet tabs (1st ELA–5th Math) to partition your class into 3 targeted intervention tables.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyGroups}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Rosters Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Group Rosters</span>
                </>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-2xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Table Slips</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher (e.g. 3rd ELA, 3rd Math, 4th ELA, 4th Math, etc.) */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            Sheet Tab:
          </span>
          {relevantTabs.map((tab) => {
            const isTabActive = activeTab === tab;
            const isMath = /math/i.test(tab);
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTabOverride(tab);
                  setSelectedHeaderOverride(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isTabActive
                    ? isMath ? 'bg-indigo-600 text-white shadow-xs' : 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isMath ? <Calculator className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                <span>{tab}</span>
              </button>
            );
          })}
        </div>

        {/* Clickable Column Header Selector Pills */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
            <ListFilter className="w-3.5 h-3.5" />
            Click Any Live Assessment Column Header in [{activeTab}]:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {tabHeaders.map((header) => {
              const isSelected = selectedHeader === header;
              return (
                <button
                  key={header}
                  onClick={() => setSelectedHeaderOverride(header)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-800'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <span className="truncate max-w-[260px]">{header}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Context Meta */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="truncate mr-2">
            Active Column: <strong className="text-slate-900 font-bold">{selectedHeader || 'Select an assessment header'}</strong>
            {' • '}Grouping <strong className="text-slate-800 font-bold">{scopeStudents.length}</strong> students
          </div>
          <div className="text-slate-400 text-[11px] shrink-0">
            Click any student to view deep-dive profile & SST prompt
          </div>
        </div>
      </div>

      {/* 3 Group Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* COLUMN 1: INTENSIVE NEEDS (<60%) */}
        <div className="bg-white rounded-2xl border-2 border-rose-200/80 shadow-2xs flex flex-col justify-between overflow-hidden">
          <div>
            {/* Column Header */}
            <div className="bg-rose-50/80 p-4 border-b border-rose-100">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-600 text-white shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  🔴 Intensive Needs (&lt;60%)
                </span>
                <span className="text-xs font-extrabold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                  {groups.intensive.length} Students
                </span>
              </div>
              <p className="text-xs text-rose-700 mt-2 font-medium leading-relaxed">
                {getFocusRoutine('intensive')}
              </p>
            </div>

            {/* Student Cards in Column */}
            <div className="p-3.5 space-y-2.5 max-h-[600px] overflow-y-auto">
              {groups.intensive.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-50" />
                  No students in intensive deficit on this assessment.
                </div>
              ) : (
                groups.intensive.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onSelectStudent(s)}
                    className="p-3 rounded-xl border border-rose-200 bg-rose-50/20 hover:bg-rose-50/60 hover:border-rose-400 transition cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0 pr-1">
                        <div className="text-xs font-bold text-slate-900 hover:text-blue-600 truncate">
                          {s.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          #{s.id} • {s.teacher}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                          {s.evalDisplay}
                        </span>
                        <div className="text-[10px] text-rose-600 font-bold mt-0.5">
                          {s.evalPercent}%
                        </div>
                      </div>
                    </div>

                    {s.evalHistory.length > 1 && (
                      <div className="text-[9px] text-slate-400 font-mono mt-1 truncate">
                        Trail: {s.evalHistory.join(' → ')}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mt-2">
                      {s.isEL && (
                        <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                          EL
                        </span>
                      )}
                      {s.isRFEP && (
                        <span className="text-[9px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded">
                          RFEP
                        </span>
                      )}
                      {s.isIFEP && (
                        <span className="text-[9px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded">
                          IFEP
                        </span>
                      )}
                      {s.isSpEd && (
                        <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                          SpEd
                        </span>
                      )}
                      {s.is504 && (
                        <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                          504
                        </span>
                      )}
                      {s.isFosterHomeless && (
                        <span className="text-[9px] font-bold bg-pink-100 text-pink-800 px-1.5 py-0.2 rounded">
                          {s.isFoster ? 'Foster' : (s.isHomeless ? 'Homeless' : 'Foster/HL')}
                        </span>
                      )}
                      {s.hasSignificantDecline ? (
                        <span className="text-[9px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded ring-1 ring-rose-300">
                          🔴 Sig. Decline
                        </span>
                      ) : s.hasYoYDecline ? (
                        <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                          🟠 Mod. Decline
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Suggested Table: Daily Targeted Pull-Out
          </div>
        </div>

        {/* COLUMN 2: STRATEGIC SUPPORT (60-79%) */}
        <div className="bg-white rounded-2xl border-2 border-amber-200/80 shadow-2xs flex flex-col justify-between overflow-hidden">
          <div>
            {/* Column Header */}
            <div className="bg-amber-50/80 p-4 border-b border-amber-100">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-white shadow-2xs">
                  🟡 Strategic (60-79%)
                </span>
                <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  {groups.strategic.length} Students
                </span>
              </div>
              <p className="text-xs text-amber-700 mt-2 font-medium leading-relaxed">
                {getFocusRoutine('strategic')}
              </p>
            </div>

            {/* Student Cards in Column */}
            <div className="p-3.5 space-y-2.5 max-h-[600px] overflow-y-auto">
              {groups.strategic.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No students in strategic band.
                </div>
              ) : (
                groups.strategic.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onSelectStudent(s)}
                    className="p-3 rounded-xl border border-amber-200 bg-amber-50/20 hover:bg-amber-50/60 hover:border-amber-400 transition cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0 pr-1">
                        <div className="text-xs font-bold text-slate-900 hover:text-blue-600 truncate">
                          {s.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          #{s.id} • {s.teacher}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          {s.evalDisplay}
                        </span>
                        <div className="text-[10px] text-amber-600 font-bold mt-0.5">
                          {s.evalPercent}%
                        </div>
                      </div>
                    </div>

                    {s.evalHistory.length > 1 && (
                      <div className="text-[9px] text-slate-400 font-mono mt-1 truncate">
                        Trail: {s.evalHistory.join(' → ')}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mt-2">
                      {s.isEL && (
                        <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                          EL
                        </span>
                      )}
                      {s.isRFEP && (
                        <span className="text-[9px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded">
                          RFEP
                        </span>
                      )}
                      {s.isIFEP && (
                        <span className="text-[9px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded">
                          IFEP
                        </span>
                      )}
                      {s.isSpEd && (
                        <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                          SpEd
                        </span>
                      )}
                      {s.is504 && (
                        <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                          504
                        </span>
                      )}
                      {s.isFosterHomeless && (
                        <span className="text-[9px] font-bold bg-pink-100 text-pink-800 px-1.5 py-0.2 rounded">
                          {s.isFoster ? 'Foster' : (s.isHomeless ? 'Homeless' : 'Foster/HL')}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Suggested Table: Guided Small Group Routine
          </div>
        </div>

        {/* COLUMN 3: BENCHMARK (80%+) */}
        <div className="bg-white rounded-2xl border-2 border-emerald-200/80 shadow-2xs flex flex-col justify-between overflow-hidden">
          <div>
            {/* Column Header */}
            <div className="bg-emerald-50/80 p-4 border-b border-emerald-100">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-2xs">
                  🟢 Benchmark (80%+)
                </span>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {groups.benchmark.length} Students
                </span>
              </div>
              <p className="text-xs text-emerald-700 mt-2 font-medium leading-relaxed">
                {getFocusRoutine('benchmark')}
              </p>
            </div>

            {/* Student Cards in Column */}
            <div className="p-3.5 space-y-2.5 max-h-[600px] overflow-y-auto">
              {groups.benchmark.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No students in benchmark band on this assessment.
                </div>
              ) : (
                groups.benchmark.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onSelectStudent(s)}
                    className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/60 hover:border-emerald-400 transition cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0 pr-1">
                        <div className="text-xs font-bold text-slate-900 hover:text-blue-600 truncate">
                          {s.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          #{s.id} • {s.teacher}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          {s.evalDisplay}
                        </span>
                        <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                          {s.evalPercent}%
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {s.isEL && (
                        <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                          EL
                        </span>
                      )}
                      {s.isRFEP && (
                        <span className="text-[9px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded">
                          RFEP
                        </span>
                      )}
                      {s.isIFEP && (
                        <span className="text-[9px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded">
                          IFEP
                        </span>
                      )}
                      {s.isFosterHomeless && (
                        <span className="text-[9px] font-bold bg-pink-100 text-pink-800 px-1.5 py-0.2 rounded">
                          {s.isFoster ? 'Foster' : (s.isHomeless ? 'Homeless' : 'Foster/HL')}
                        </span>
                      )}
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                        On Track
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Suggested Table: Independent & Extension
          </div>
        </div>

      </div>

    </div>
  );
}
