// src/components/StudentModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  TrendingUp, 
  TrendingDown, 
  BookOpen, 
  GraduationCap, 
  Languages, 
  HeartHandshake, 
  FileText, 
  Award,
  ChevronRight,
  Calculator,
  Layers
} from 'lucide-react';
import { getSiteLogo, DISTRICT_LOGO } from '../config/constants';
import { generateSSTPrompt } from '../utils/dataParser';

export default function StudentModal({
  student,
  isOpen,
  onClose
}) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [prevStudentId, setPrevStudentId] = useState(student?.id);

  // Reset tab to overview when a new student is selected
  if (student?.id !== prevStudentId) {
    setPrevStudentId(student?.id);
    setActiveTab('overview');
  }

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !student) return null;

  const siteLogo = getSiteLogo(student.school);
  const sstPrompt = generateSSTPrompt(student);
  const matchedTabs = student.matchedTabs || Object.keys(student.assessmentsByTab || {});

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(sstPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] z-10">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-5 sm:p-6 border-b border-white/10 shrink-0 relative">
          <div className="flex items-start justify-between gap-4">
            
            {/* Student ID & Name with Site Logo */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl p-2 shadow-md flex items-center justify-center shrink-0 border border-white/20">
                <img
                  src={siteLogo}
                  alt={student.school}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => { e.target.src = DISTRICT_LOGO; }}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-400/30">
                    ID #{student.id}
                  </span>
                  <span className="text-xs text-slate-300">
                    Grade {student.gradeStr || student.grade} • Classroom: {student.teacher}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                  {student.name}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {student.school} • Academic Year 2026-2027
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition text-sm font-bold"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Program Badges Strip */}
          <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-white/10">
            {student.isEL && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/25 text-amber-200 border border-amber-400/40">
                <Languages className="w-3.5 h-3.5 text-amber-300" />
                Language: {student.elLabel || 'Active English Learner (LEP)'}
              </span>
            )}
            {student.isRFEP && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/25 text-teal-200 border border-teal-400/40">
                <Languages className="w-3.5 h-3.5 text-teal-300" />
                Language: {student.elLabel || 'RFEP (Redesignated Fluent)'}
              </span>
            )}
            {student.isIFEP && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/25 text-sky-200 border border-sky-400/40">
                <Languages className="w-3.5 h-3.5 text-sky-300" />
                Language: {student.elLabel || 'IFEP (Initially Fluent)'}
              </span>
            )}
            {student.isSpEd && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-200 border border-purple-400/40">
                <GraduationCap className="w-3.5 h-3.5 text-purple-300" />
                SpEd: {student.spedType || 'IEP Active'}
              </span>
            )}
            {student.is504 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-200 border border-amber-400/40">
                <FileText className="w-3.5 h-3.5 text-amber-300" />
                Section 504 Plan Active
              </span>
            )}
            {student.isFosterHomeless && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-500/20 text-pink-200 border border-pink-400/40">
                <HeartHandshake className="w-3.5 h-3.5 text-pink-300" />
                Foster / Homeless Youth Support
              </span>
            )}
            {student.hasYoYDecline && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/30 text-rose-200 border border-rose-400/50 animate-pulse">
                <TrendingDown className="w-3.5 h-3.5 text-rose-300" />
                Year-over-Year Decline
              </span>
            )}
            {!student.hasYoYDecline && student.overallYoYStatus === 'growth' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/40">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
                Accelerated YoY Growth
              </span>
            )}
          </div>
        </div>

        {/* Tab Navigation: Overview, Matched Sheet Tabs, and SST Prompt */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 flex items-center justify-between overflow-x-auto shrink-0">
          <div className="flex items-center gap-2 py-2">
            
            {/* 1. Overview & YoY Trajectory Tab */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Overview & YoY Growth
            </button>

            {/* 2. Dynamically rendered tabs for each matched Google Sheet tab */}
            {matchedTabs.map((tab) => {
              const isTabActive = activeTab === tab;
              const isMath = /math/i.test(tab);
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    isTabActive
                      ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isMath ? <Calculator className="w-3.5 h-3.5 text-indigo-600" /> : <BookOpen className="w-3.5 h-3.5 text-blue-600" />}
                  <span>{tab}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700 font-bold">
                    {student.assessmentsByTab[tab]?.length || 0}
                  </span>
                </button>
              );
            })}

            {/* 3. SST NotebookLM Prompt Tab */}
            <button
              onClick={() => setActiveTab('sst')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'sst'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-700 hover:bg-purple-50 font-extrabold'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              💡 SST NotebookLM Prompt
            </button>
          </div>

          <div className="hidden sm:block text-[11px] text-slate-400">
            Authoritative Roster Data
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: OVERVIEW & MULTI-YEAR YoY COMPARISONS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Multi-Year Comparative Growth (Matched Across Live Years)
                </h4>
                
                {student.yoyComparisons.length === 0 ? (
                  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
                    Baseline assessment data currently recorded for this student. No multi-year pairing detected yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {student.yoyComparisons.map((comp) => (
                      <div key={comp.family} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 truncate pr-1">
                            {comp.family}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            comp.growth.status === 'growth' ? 'bg-emerald-100 text-emerald-800' :
                            comp.growth.status === 'decline' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {comp.growth.badge}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center bg-white p-2.5 rounded-xl border border-slate-200/80">
                          <div>
                            <div className="text-[10px] text-slate-400 font-semibold">{comp.prevYear}</div>
                            <div className="text-base font-extrabold text-slate-800 truncate">
                              {comp.prev.parsed.latest || 'N/A'}
                            </div>
                          </div>
                          <div className="border-l border-slate-100 pl-2">
                            <div className="text-[10px] text-slate-400 font-semibold">{comp.currYear}</div>
                            <div className="text-base font-extrabold text-blue-600 truncate">
                              {comp.curr.parsed.latest || 'N/A'}
                            </div>
                          </div>
                        </div>

                        {/* Multi-Attempt Progression Trail */}
                        {comp.curr.parsed.history.length > 1 && (
                          <div>
                            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                              Current Attempt Trail:
                            </div>
                            <div className="flex flex-wrap items-center gap-1 font-mono text-[11px]">
                              {comp.curr.parsed.history.map((att, idx) => (
                                <React.Fragment key={idx}>
                                  <span className="px-2 py-0.5 rounded bg-white text-slate-700 font-bold border border-slate-200">
                                    {att}
                                  </span>
                                  {idx < comp.curr.parsed.history.length - 1 && (
                                    <ChevronRight className="w-3 h-3 text-slate-400" />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="text-[11px] text-slate-500">
                          {comp.growth.description}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Matched Sheet Tabs Summary Card */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Matched Sheet Tabs for Student ID #{student.id}
                  </h4>
                  <span className="text-xs text-slate-400">
                    Grade {student.gradeStr || student.grade} Roster
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchedTabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition text-left cursor-pointer"
                    >
                      {/math/i.test(tab) ? <Calculator className="w-4 h-4 text-indigo-600" /> : <BookOpen className="w-4 h-4 text-blue-600" />}
                      <div>
                        <div className="text-xs font-bold text-slate-900">{tab}</div>
                        <div className="text-[10px] text-slate-500">
                          {student.assessmentsByTab[tab]?.length || 0} columns assessed →
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Action to SST Generator */}
              <div className="bg-purple-50/70 rounded-2xl p-4 border border-purple-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-purple-900">
                    SST NotebookLM Intervention Analysis Ready
                  </div>
                  <p className="text-xs text-purple-700 mt-0.5 max-w-xl">
                    Student metrics across all tabs and multi-year trajectories are formatted for instant AI synthesis.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('sst')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  View SST Prompt
                </button>
              </div>

            </div>
          )}

          {/* DYNAMIC TABS FOR EACH MATCHED SHEET TAB (e.g. 4th ELA, 4th Math, etc.) */}
          {matchedTabs.includes(activeTab) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    {/math/i.test(activeTab) ? <Calculator className="w-5 h-5 text-indigo-600" /> : <BookOpen className="w-5 h-5 text-blue-600" />}
                    {activeTab} Assessment Records
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Showing all {student.assessmentsByTab[activeTab]?.length || 0} assessment columns from the live Google Sheet for ID #{student.id}.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {student.assessmentsByTab[activeTab]?.map((col, idx) => (
                  <div
                    key={`${col.header}-${idx}`}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 hover:border-blue-300 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 pr-1">
                        <div className="text-xs font-bold text-slate-900 truncate" title={col.header}>
                          {col.baseName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                          {col.year && (
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                              {col.year}
                            </span>
                          )}
                          <span className="truncate">{col.family}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                          {col.parsed.latest}
                        </span>
                      </div>
                    </div>

                    {/* Multi-Attempt Progression Trail */}
                    {col.parsed.history.length > 1 && (
                      <div className="text-[10px] text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded">
                        <span className="text-slate-400 font-sans text-[9px] uppercase font-bold mr-1">Progression:</span>
                        {col.parsed.history.join(' → ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SST NOTEBOOKLM PROMPT GENERATOR */}
          {activeTab === 'sst' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-purple-50 p-4 rounded-2xl border border-purple-200">
                <div>
                  <h4 className="text-sm font-extrabold text-purple-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Automated SST & Intervention Prompt Generator
                  </h4>
                  <p className="text-xs text-purple-800 mt-0.5">
                    Formatted specifically for pasting into WVUSD Student Success Team (SST) NotebookLM.
                  </p>
                </div>

                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs shrink-0"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy SST Strategy Prompt</span>
                    </>
                  )}
                </button>
              </div>

              {/* Prompt Text Preview Box */}
              <div className="relative">
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono leading-relaxed overflow-x-auto border border-slate-800 max-h-96 whitespace-pre-wrap">
                  {sstPrompt}
                </pre>
                <button
                  onClick={handleCopyPrompt}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                  title="Copy Prompt"
                >
                  {copiedPrompt ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500">
            Student: <strong className="text-slate-800">{student.name}</strong> • #{student.id}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
