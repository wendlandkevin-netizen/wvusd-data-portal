// src/components/SmallGroupBuilder.jsx
import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Printer, 
  CheckCircle2,
  ListFilter
} from 'lucide-react';

const ASSESSMENTS_FOR_GROUPING = [
  { id: 'soundSegmentation', label: 'Sound Segmentation', type: 'phonics', max: 15, benchmarkScore: 12 },
  { id: 'decodingWords', label: 'Decoding Words', type: 'phonics', max: 85, benchmarkScore: 68 },
  { id: 'oralBlending', label: 'Oral Blending', type: 'phonics', max: 15, benchmarkScore: 12 },
  { id: 'digraphsVowels', label: 'Digraphs & Vowel Sounds', type: 'phonics', max: 15, benchmarkScore: 12 },
  { id: 'removingManipulating', label: 'Removing & Manipulating Phonemes', type: 'phonics', max: 15, benchmarkScore: 12 },
  { id: 'firstGradeWordList', label: '1st Grade Word List', type: 'phonics', max: 55, benchmarkScore: 44 },
  { id: 'amira', label: 'Amira ARM Fluency', type: 'amira', max: 4.0, benchmarkScore: 3.0 },
  { id: 'star', label: 'STAR Instructional Reading', type: 'star', max: 4.0, benchmarkScore: 3.0 },
  { id: 'narrativeWriting', label: 'Narrative Writing Rubric', type: 'writing', max: 4, benchmarkScore: 3.0 },
  { id: 'opinionWriting', label: 'Opinion Writing Rubric', type: 'writing', max: 4, benchmarkScore: 3.0 },
  { id: 'informationalWriting', label: 'Informational Writing Rubric', type: 'writing', max: 4, benchmarkScore: 3.0 }
];

export default function SmallGroupBuilder({
  students = [],
  selectedSchool,
  selectedGrade,
  selectedTeacher,
  onSelectStudent
}) {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('soundSegmentation');
  const [copied, setCopied] = useState(false);

  // Filter students for active school, grade, teacher
  const scopeStudents = useMemo(() => {
    return students.filter((s) => {
      if (selectedSchool !== 'ALL' && s.school !== selectedSchool) return false;
      if (selectedGrade !== 'ALL' && s.grade !== Number(selectedGrade)) return false;
      if (selectedTeacher !== 'ALL' && s.teacher !== selectedTeacher) return false;
      return true;
    });
  }, [students, selectedSchool, selectedGrade, selectedTeacher]);

  const activeAssessment = ASSESSMENTS_FOR_GROUPING.find(a => a.id === selectedAssessmentId) || ASSESSMENTS_FOR_GROUPING[0];

  // Helper to extract numeric score and percentage for any student on active assessment
  const evaluateStudentAssessment = (student, assessment) => {
    let score = null;
    let max = assessment.max;
    let displayScore = 'N/A';
    let percent = 0;

    if (assessment.type === 'phonics') {
      const p = student.phonics.find(item => item.id === assessment.id);
      if (p && p.score !== null) {
        score = p.score;
        percent = p.percent;
        displayScore = `${score} / ${max}`;
      }
    } else if (assessment.type === 'amira') {
      const num = student.amira.curr.latestNumeric;
      if (num !== null) {
        score = num;
        percent = Math.min(100, Math.round((num / student.grade) * 80));
        displayScore = `${student.amira.curr.latest} ARM`;
      }
    } else if (assessment.type === 'star') {
      const num = student.star.curr.latestNumeric;
      if (num !== null) {
        score = num;
        percent = Math.min(100, Math.round((num / student.grade) * 80));
        displayScore = `Level ${student.star.curr.latest}`;
      }
    } else if (assessment.type === 'writing') {
      const wFieldId = assessment.id === 'narrativeWriting' ? 'narrativeContent' :
                       assessment.id === 'opinionWriting' ? 'opinionContent' : 'informationalContent';
      const w = student.writing.find(item => item.id === wFieldId);
      if (w && w.score !== null) {
        score = w.score;
        percent = Math.round((score / 4) * 100);
        displayScore = `${score} / 4.0`;
      }
    }

    return { score, max, displayScore, percent };
  };

  // Group students into 3 tiers based on percentage:
  // Intensive: < 60%
  // Strategic: 60 - 79%
  // Benchmark: >= 80%
  const groups = useMemo(() => {
    const intensive = [];
    const strategic = [];
    const benchmark = [];
    const unassessed = [];

    scopeStudents.forEach((student) => {
      const res = evaluateStudentAssessment(student, activeAssessment);
      const studentWithScore = {
        ...student,
        evalScore: res.score,
        evalDisplay: res.displayScore,
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

    // Sort within tiers lowest to highest
    intensive.sort((a, b) => a.evalPercent - b.evalPercent);
    strategic.sort((a, b) => a.evalPercent - b.evalPercent);
    benchmark.sort((a, b) => b.evalPercent - a.evalPercent);

    return { intensive, strategic, benchmark, unassessed };
  }, [scopeStudents, activeAssessment]);

  // Suggested instructional focus routines for each column
  const getFocusRoutine = (tier) => {
    if (activeAssessment.type === 'phonics') {
      if (tier === 'intensive') return 'Daily 20m pull-out: UFLI Foundations sound manipulation with elkonin sound boxes & continuous blending drill.';
      if (tier === 'strategic') return 'Targeted 15m routine: Guided decodable passage repeated reading with focus on targeted phonics pattern.';
      return 'Enrichment routine: Multisyllabic word decoding, morphological prefix/suffix study, and paired fluency reading.';
    }
    if (activeAssessment.type === 'writing') {
      if (tier === 'intensive') return 'Guided interactive sentence-framing, oral rehearsal, and explicit anchor chart modeling.';
      if (tier === 'strategic') return 'Focus on transition phrases, evidence elaboration, and self-check conventions rubric.';
      return 'Advanced author craft: Varying sentence lengths, vivid sensory diction, and peer review editing.';
    }
    // Fluency / Reading
    if (tier === 'intensive') return 'Echo reading & choral repeated reading with decodable passages (15 min daily).';
    if (tier === 'strategic') return 'Partner fluency timing, phrasing prosody coaching, and comprehension retelling.';
    return 'Independent book club discussion circles and novel study comprehension synthesis.';
  };

  // Copy groupings to clipboard
  const handleCopyGroups = () => {
    const text = `WVUSD SMALL GROUP ROSTERS: ${activeAssessment.label}
Class: ${selectedSchool !== 'ALL' ? selectedSchool : 'All Sites'} | Grade ${selectedGrade !== 'ALL' ? selectedGrade : 'All'} | Teacher: ${selectedTeacher !== 'ALL' ? selectedTeacher : 'All'}
Generated: ${new Date().toLocaleDateString()}

🔴 TIER 3: INTENSIVE NEEDS (<60%) [Count: ${groups.intensive.length}]
Instructional Focus: ${getFocusRoutine('intensive')}
Students:
${groups.intensive.map(s => `- ${s.name} (${s.evalDisplay}, ${s.evalPercent}%) ${s.isEL ? '[EL]' : ''} ${s.isSpEd ? '[IEP]' : ''}`).join('\n') || 'None'}

🟡 TIER 2: STRATEGIC SUPPORT (60-79%) [Count: ${groups.strategic.length}]
Instructional Focus: ${getFocusRoutine('strategic')}
Students:
${groups.strategic.map(s => `- ${s.name} (${s.evalDisplay}, ${s.evalPercent}%) ${s.isEL ? '[EL]' : ''} ${s.isSpEd ? '[IEP]' : ''}`).join('\n') || 'None'}

🟢 TIER 1: BENCHMARK (80%+) [Count: ${groups.benchmark.length}]
Instructional Focus: ${getFocusRoutine('benchmark')}
Students:
${groups.benchmark.map(s => `- ${s.name} (${s.evalDisplay}, ${s.evalPercent}%)`).join('\n') || 'None'}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Banner & Assessment Clicker Bar */}
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
              Select any literacy subtest or writing rubric below to instantly partition your classroom into 3 targeted intervention table pull-outs.
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

        {/* Clickable Assessment Headers Tab Ribbon */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
            <ListFilter className="w-3.5 h-3.5" />
            Click an Assessment Header to Group Roster:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {ASSESSMENTS_FOR_GROUPING.map((a) => {
              const isSelected = selectedAssessmentId === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedAssessmentId(a.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-500/30'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <span>{a.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold ${
                    isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}>
                    {a.type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Context Meta */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            Active Assessment: <strong className="text-indigo-600 font-extrabold">{activeAssessment.label}</strong> (Max: {activeAssessment.max})
            {' • '}Grouping <strong className="text-slate-800">{scopeStudents.length}</strong> students
          </div>
          <div className="text-slate-400 text-[11px]">
            Click any student to view comprehensive history & SST prompt
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
                  No students in intensive deficit on {activeAssessment.label}.
                </div>
              ) : (
                groups.intensive.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onSelectStudent(s)}
                    className="p-3 rounded-xl border border-rose-200 bg-rose-50/20 hover:bg-rose-50/60 hover:border-rose-400 transition cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <div className="text-xs font-bold text-slate-900 hover:text-blue-600">
                          {s.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
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

                    <div className="flex flex-wrap gap-1 mt-2">
                      {s.isEL && (
                        <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                          EL
                        </span>
                      )}
                      {s.isSpEd && (
                        <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                          IEP
                        </span>
                      )}
                      {s.is504 && (
                        <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                          504
                        </span>
                      )}
                      {s.hasYoYDecline && (
                        <span className="text-[9px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded">
                          YoY Decline
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Suggested Table: Teacher-Led Pull-Out (Daily)
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
                      <div>
                        <div className="text-xs font-bold text-slate-900 hover:text-blue-600">
                          {s.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
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

                    <div className="flex flex-wrap gap-1 mt-2">
                      {s.isEL && (
                        <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                          EL
                        </span>
                      )}
                      {s.isSpEd && (
                        <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                          IEP
                        </span>
                      )}
                      {s.is504 && (
                        <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                          504
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Suggested Table: Guided Small Group (3x/week)
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
                  No students in benchmark band yet.
                </div>
              ) : (
                groups.benchmark.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onSelectStudent(s)}
                    className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/60 hover:border-emerald-400 transition cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <div className="text-xs font-bold text-slate-900 hover:text-blue-600">
                          {s.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
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
                        <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                          EL
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
            Suggested Table: Independent & Peer Extension
          </div>
        </div>

      </div>

    </div>
  );
}
