// src/components/SiteAdminOverview.jsx
import React from 'react';
import { 
  Users, 
  TrendingUp,
  TrendingDown, 
  AlertTriangle, 
  GraduationCap, 
  Languages, 
  HeartHandshake, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  Award
} from 'lucide-react';
import { getSiteLogo, DISTRICT_LOGO } from '../config/constants';
import { PHONICS_SUBTESTS } from '../utils/dataParser';

export default function SiteAdminOverview({
  students = [],
  selectedSchool,
  onDrilldown
}) {
  const activeLogo = getSiteLogo(selectedSchool);

  // Filter students based on selected school
  const siteStudents = selectedSchool === 'ALL'
    ? students
    : students.filter(s => s.school === selectedSchool);

  const totalCount = siteStudents.length;

  // Filter out TK, K, TOTS, and 0 since they don't have benchmarks (Grades 1st through 5th only)
  const isElementaryBenchmarkGrade = (g) => {
    const s = String(g || '').toUpperCase().trim();
    if (['TK', 'K', 'TOTS', '0', 'KINDERGARTEN', 'TRANSITIONAL KINDERGARTEN'].includes(s)) {
      return false;
    }
    return ['1ST', '2ND', '3RD', '4TH', '5TH', '1', '2', '3', '4', '5'].some(
      valid => s === valid || s.startsWith(valid)
    );
  };

  // Benchmark cohort: Grades 1-5 students with benchmark assessments
  const benchmarkCohort = siteStudents.filter(s => isElementaryBenchmarkGrade(s.gradeStr || s.grade));
  const benchmarkCohortCount = benchmarkCohort.length;

  // Key KPI metrics
  const benchmarkCount = benchmarkCohort.filter(s => s.isBenchmark).length;
  const benchmarkPct = benchmarkCohortCount > 0 ? Math.round((benchmarkCount / benchmarkCohortCount) * 100) : 0;

  const elStudents = siteStudents.filter(s => s.isEL);
  const elCount = elStudents.length;
  const elPct = totalCount > 0 ? Math.round((elCount / totalCount) * 100) : 0;

  const rfepStudents = siteStudents.filter(s => s.isRFEP);
  const rfepCount = rfepStudents.length;

  const ifepStudents = siteStudents.filter(s => s.isIFEP);
  const ifepCount = ifepStudents.length;

  const sped504Students = siteStudents.filter(s => s.isSpEd || s.is504);
  const sped504Count = sped504Students.length;

  const fosterHomelessStudents = siteStudents.filter(s => s.isFosterHomeless);
  const fosterHomelessCount = fosterHomelessStudents.length;
  const homelessCount = siteStudents.filter(s => s.isHomeless).length;
  const fosterCount = siteStudents.filter(s => s.isFoster).length;

  const regressionStudents = siteStudents.filter(s => s.hasYoYDecline);
  const regressionCount = regressionStudents.length;
  const regressionPct = totalCount > 0 ? Math.round((regressionCount / totalCount) * 100) : 0;
  const sigDeclineCount = siteStudents.filter(s => s.hasSignificantDecline).length;

  const growthStudents = siteStudents.filter(s => s.overallYoYStatus === 'growth');
  const growthCount = growthStudents.length;
  const strongGrowthCount = siteStudents.filter(s => s.hasStrongGrowth).length;

  const tier3InterventionStudents = siteStudents.filter(s => s.hasTier3Phonics || s.hasYoYDecline);
  const tier3Count = tier3InterventionStudents.length;

  // Dynamic Grade-Level Breakdown Matrix (1st through 5th Grade only - TK & K excluded)
  const rawGrades = Array.from(
    new Set(siteStudents.map(s => s.gradeStr || (s.grade !== undefined ? `${s.grade}` : '')).filter(Boolean))
  ).filter(isElementaryBenchmarkGrade);

  const gradeSortOrder = {
    '1ST': 1, '1': 1,
    '2ND': 2, '2': 2,
    '3RD': 3, '3': 3,
    '4TH': 4, '4': 4,
    '5TH': 5, '5': 5
  };

  const sortedGrades = rawGrades.length > 0
    ? rawGrades.sort((a, b) => {
        const aVal = gradeSortOrder[a.toUpperCase()] ?? (parseInt(a, 10) || 99);
        const bVal = gradeSortOrder[b.toUpperCase()] ?? (parseInt(b, 10) || 99);
        return aVal - bVal;
      })
    : ['1st', '2nd', '3rd', '4th', '5th'];

  const gradeMatrix = sortedGrades.map(g => {
    const gNum = parseInt(g, 10);
    const inGrade = siteStudents.filter(s =>
      s.gradeStr === g ||
      `${s.grade}` === g ||
      (gNum && s.grade === gNum) ||
      `${s.grade}th` === g.toLowerCase() ||
      `${s.grade}st` === g.toLowerCase() ||
      `${s.grade}nd` === g.toLowerCase() ||
      `${s.grade}rd` === g.toLowerCase()
    );
    const count = inGrade.length;
    const bmCount = inGrade.filter(s => s.isBenchmark).length;
    const bmPct = count > 0 ? Math.round((bmCount / count) * 100) : 0;
    const regCount = inGrade.filter(s => s.hasYoYDecline).length;
    const growCount = inGrade.filter(s => s.overallYoYStatus === 'growth').length;
    const elInGrade = inGrade.filter(s => s.isEL).length;
    const t3InGrade = inGrade.filter(s => s.hasTier3Phonics).length;

    // Distinct teachers in this grade
    const teachers = Array.from(new Set(inGrade.map(s => s.teacher || s.teacherName))).filter(Boolean);
    const teacherData = teachers.map(tName => {
      const inClass = inGrade.filter(s => s.teacher === tName || s.teacherName === tName);
      const cCount = inClass.length;
      const cBm = inClass.filter(s => s.isBenchmark).length;
      const cBmPct = cCount > 0 ? Math.round((cBm / cCount) * 100) : 0;
      const cReg = inClass.filter(s => s.hasYoYDecline).length;
      const cGrow = inClass.filter(s => s.overallYoYStatus === 'growth').length;
      const cEL = inClass.filter(s => s.isEL).length;
      const cT3 = inClass.filter(s => s.hasTier3Phonics).length;

      return {
        teacher: tName,
        count: cCount,
        benchmarkPct: cBmPct,
        growthCount: cGrow,
        regressionCount: cReg,
        elCount: cEL,
        tier3Count: cT3
      };
    });

    return {
      grade: g,
      count,
      benchmarkPct: bmPct,
      growthCount: growCount,
      regressionCount: regCount,
      elCount: elInGrade,
      tier3Count: t3InGrade,
      teachers: teacherData
    };
  });

  // Phonics Micro-Skills School-Wide Mastery Averages
  const phonicsMastery = PHONICS_SUBTESTS.map(subtest => {
    let totalScore = 0;
    let assessedCount = 0;
    let benchmarkCount = 0;

    siteStudents.forEach(s => {
      const p = (s.phonics || []).find(item => item.id === subtest.id || subtest.match?.test(item.header || item.name))
        || (s.allParsedColumns || []).find(c => subtest.match?.test(c.header || c.family));
      
      const score = p ? (p.score !== undefined ? p.score : p.parsed?.latestNumeric) : null;
      if (score !== null && score !== undefined && !isNaN(score)) {
        totalScore += Number(score);
        assessedCount += 1;
        if (Number(score) >= subtest.benchmark) benchmarkCount += 1;
      }
    });

    const avgScore = assessedCount > 0 ? (totalScore / assessedCount).toFixed(1) : 0;
    const pctBenchmark = assessedCount > 0 ? Math.round((benchmarkCount / assessedCount) * 100) : 0;

    return {
      ...subtest,
      assessedCount,
      avgScore,
      pctBenchmark
    };
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Executive Hero & Site Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl p-2.5 shadow-md flex items-center justify-center shrink-0 border border-white/20">
              <img
                src={activeLogo}
                alt="Active School Logo"
                className="max-h-full max-w-full object-contain"
                onError={(e) => { e.target.src = DISTRICT_LOGO; }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  School Executive Overview
                </span>
                <span className="text-xs text-slate-300">
                  Academic Year 2026-2027
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                {selectedSchool === 'ALL' ? 'All WVUSD Elementary Schools' : selectedSchool}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Real-time literacy benchmark monitoring, multi-attempt Illuminate tracking, and targeted multi-tiered intervention analytics.
              </p>
            </div>
          </div>

          {/* Quick Specialist Actions */}
          <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={() => onDrilldown({ filter: 'EL' })}
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition transform hover:-translate-y-0.5"
            >
              <Languages className="w-4 h-4" />
              <span>View Active EL Students ({elCount} LEP)</span>
            </button>

            <button
              onClick={() => onDrilldown({ filter: 'Tier 3 Phonics' })}
              className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition transform hover:-translate-y-0.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>View All Tier 3 Interventions ({tier3Count})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        
        {/* Total Students */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Enrolled</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>{benchmarkCohortCount} in Grades 1–5</span>
          </div>
        </div>

        {/* % Benchmark */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">% Benchmark</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{benchmarkPct}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {benchmarkCount} of {benchmarkCohortCount} on target (Grades 1–5)
          </div>
        </div>

        {/* YoY Growth */}
        <div 
          onClick={() => onDrilldown({ filter: 'All' })}
          className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs hover:shadow-xs hover:border-emerald-400 transition cursor-pointer group"
          title="5-Tier Scale: Strong Growth (> +10% or > +5 pp), Moderate Growth (+2% to +10% or +2 to +5 pp). Maintained band is ±2% (±2.0 pp)."
        >
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">YoY Growth</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{growthCount}</div>
          <div className="text-[11px] text-emerald-700/80 mt-1 flex items-center justify-between">
            <span>{strongGrowthCount} Strong (&gt;10% / &gt;5pp)</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500 opacity-0 group-hover:opacity-100 transition" />
          </div>
        </div>

        {/* YoY Regression / Decline */}
        <div 
          onClick={() => onDrilldown({ filter: '🔴 YoY Decline' })}
          className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/30 shadow-2xs hover:shadow-xs hover:border-rose-400 transition cursor-pointer group"
          title="5-Tier Scale: Significant Decline (< -10% or < -5 pp), Moderate Decline (-2% to -10% or -2 to -5 pp). Maintained band is ±2% (±2.0 pp)."
        >
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">YoY Decline</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">{regressionCount}</div>
          <div className="text-[11px] text-rose-600/80 mt-1 flex items-center justify-between">
            <span>Sig: {sigDeclineCount} • Mod: {regressionCount - sigDeclineCount} ({regressionPct}%)</span>
            <ChevronRight className="w-3.5 h-3.5 text-rose-500 opacity-0 group-hover:opacity-100 transition" />
          </div>
        </div>

        {/* Language Proficiency: EL Count (LEP Only) */}
        <div 
          onClick={() => onDrilldown({ filter: 'EL' })}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-amber-300 transition cursor-pointer group"
          title="EL Count strictly counts Active LEP students. Redesignated (RFEP) students are monitored separately and excluded from this count."
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-amber-600 transition">EL Count (LEP)</span>
            <Languages className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {elCount} <span className="text-xs font-bold uppercase text-slate-500">LEP ({elPct}%)</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
            <span>RFEP: {rfepCount} (excluded) • IFEP: {ifepCount}</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-500 opacity-0 group-hover:opacity-100 transition" />
          </div>
        </div>

        {/* SpEd & 504 */}
        <div 
          onClick={() => onDrilldown({ filter: 'SpEd' })}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-purple-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-purple-600 transition">SpEd & 504</span>
            <GraduationCap className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-700">{sped504Count}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Specialized</span>
            <ChevronRight className="w-3.5 h-3.5 text-purple-500 opacity-0 group-hover:opacity-100 transition" />
          </div>
        </div>

        {/* Foster / Homeless */}
        <div 
          onClick={() => onDrilldown({ filter: 'Foster/Homeless' })}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-amber-300 transition cursor-pointer group"
          title="Students enrolled in Homeless or Foster Programs (Authoritative from Roster!G:G)"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-amber-600 transition">Foster / Homeless</span>
            <HeartHandshake className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-700">{fosterHomelessCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>{homelessCount} Homeless • {fosterCount} Foster</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-500 opacity-0 group-hover:opacity-100 transition" />
          </div>
        </div>

      </div>

      {/* Grade-Level Breakdown Matrix & Phonics Mastery Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Grade-Level Matrix Table (2 cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Grade-Level & Classroom Breakdown Matrix
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Side-by-side comparison across Grades 1–5. Click any grade or teacher to drill directly into that roster.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              Click row to drill down
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Grade & Classroom</th>
                  <th className="py-3 px-3 text-center">Enrolled</th>
                  <th className="py-3 px-3 text-center">% Benchmark</th>
                  <th className="py-3 px-3 text-center">YoY Growth</th>
                  <th className="py-3 px-3 text-center">YoY Decline</th>
                  <th className="py-3 px-3 text-center" title="Active LEP students only (Redesignated students are excluded)">EL (LEP) Count</th>
                  <th className="py-3 px-3 text-center">Tier 3 Needs</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gradeMatrix.map((g) => (
                  <React.Fragment key={`grade-${g.grade}`}>
                    {/* Grade Header Summary Row */}
                    <tr 
                      onClick={() => onDrilldown({ grade: g.grade, teacher: 'ALL' })}
                      className="bg-slate-50/90 font-bold hover:bg-blue-50/60 cursor-pointer transition"
                    >
                      <td className="py-2.5 px-4 flex items-center gap-2 text-slate-900">
                        <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center font-extrabold text-xs">
                          {g.grade}
                        </span>
                        <span>{String(g.grade).toLowerCase().includes('grade') || String(g.grade).toUpperCase() === 'K' || String(g.grade).toUpperCase() === 'TK' ? `${g.grade}` : `Grade ${g.grade}`} Overview</span>
                        {(g.grade === 3 || g.grade === '3rd' || g.grade === '3') && (
                          <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase">
                            Primary Focus
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-800">{g.count}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                          g.benchmarkPct >= 80 ? 'bg-emerald-100 text-emerald-800' :
                          g.benchmarkPct >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {g.benchmarkPct}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-emerald-600 font-semibold">
                        +{g.growthCount}
                      </td>
                      <td className="py-2.5 px-3 text-center text-rose-600 font-semibold">
                        {g.regressionCount > 0 ? `-${g.regressionCount}` : '0'}
                      </td>
                      <td className="py-2.5 px-3 text-center text-blue-700">{g.elCount}</td>
                      <td className="py-2.5 px-3 text-center">
                        {g.tier3Count > 0 ? (
                          <span className="inline-flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
                            {g.tier3Count}
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 font-bold text-xs inline-flex items-center gap-0.5"
                        >
                          Roster <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>

                    {/* Individual Teachers under this Grade */}
                    {g.teachers.map((t) => (
                      <tr
                        key={`teacher-${g.grade}-${t.teacher}`}
                        onClick={() => onDrilldown({ grade: g.grade, teacher: t.teacher })}
                        className="hover:bg-slate-50/70 cursor-pointer transition text-slate-600"
                      >
                        <td className="py-2 px-4 pl-10 text-slate-800 font-medium flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          {t.teacher}
                        </td>
                        <td className="py-2 px-3 text-center">{t.count}</td>
                        <td className="py-2 px-3 text-center font-semibold text-slate-700">
                          {t.benchmarkPct}%
                        </td>
                        <td className="py-2 px-3 text-center text-emerald-600">
                          +{t.growthCount}
                        </td>
                        <td className="py-2 px-3 text-center text-rose-600">
                          {t.regressionCount > 0 ? `-${t.regressionCount}` : '0'}
                        </td>
                        <td className="py-2 px-3 text-center">{t.elCount}</td>
                        <td className="py-2 px-3 text-center text-rose-600 font-medium">
                          {t.tier3Count}
                        </td>
                        <td className="py-2 px-3 text-center text-slate-400 hover:text-blue-600">
                          <ArrowRight className="w-3 h-3 mx-auto" />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Foundational Phonics School-Wide Mastery (1 col on lg) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Foundational Phonics Mastery
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                7 Subtests
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              School-wide proficiency rates across the 7 Illuminate foundational reading micro-skills.
            </p>

            <div className="space-y-3.5">
              {phonicsMastery.map((subtest) => {
                const pct = subtest.pctBenchmark;
                const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500';
                const badgeColor = pct >= 80 ? 'text-emerald-700 bg-emerald-50' : pct >= 60 ? 'text-amber-700 bg-amber-50' : 'text-rose-700 bg-rose-50';

                return (
                  <div key={subtest.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 truncate pr-2">
                        {subtest.name}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-slate-400 text-[11px]">Avg {subtest.avgScore}/{subtest.max}</span>
                        <span className={`font-bold px-1.5 py-0.2 rounded text-[11px] ${badgeColor}`}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 p-4 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800">Targeted Small Groups</span>
                <p className="text-[11px] text-slate-500">Auto-cluster students by deficit</p>
              </div>
              <button
                type="button"
                onClick={() => onDrilldown({ view: 'small-groups' })}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg shadow-2xs transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Launch Builder
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
