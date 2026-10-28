// src/components/StudentModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  BookOpen, 
  GraduationCap, 
  Languages, 
  HeartHandshake, 
  FileText,
  AlertTriangle,
  Award,
  ChevronRight
} from 'lucide-react';
import { getSiteLogo, DISTRICT_LOGO } from '../config/constants';
import { generateSSTPrompt } from '../utils/dataParser';

export default function StudentModal({
  student,
  isOpen,
  onClose
}) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'phonics' | 'writing' | 'sst'

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
                    Grade {student.grade} • Classroom: {student.teacher}
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
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-400/40">
                <Languages className="w-3.5 h-3.5 text-blue-300" />
                EL Status: {student.elLevel || 'English Learner'}
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
                Flagged: Year-over-Year Decline
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

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 flex items-center justify-between overflow-x-auto shrink-0">
          <div className="flex items-center gap-2 py-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              YoY Growth Trajectory
            </button>

            <button
              onClick={() => setActiveTab('phonics')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'phonics'
                  ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              7 Phonics Micro-Skills
            </button>

            <button
              onClick={() => setActiveTab('writing')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'writing'
                  ? 'bg-white text-emerald-700 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              Writing Rubrics (6 Areas)
            </button>

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
            Illuminate Assessment Records
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: OVERVIEW & YoY COMPARISONS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Year-over-Year Comparative Growth (Multi-Attempt History)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Amira ARM YoY Card */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Amira ARM Fluency</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        student.amira.growth.status === 'growth' ? 'bg-emerald-100 text-emerald-800' :
                        student.amira.growth.status === 'decline' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {student.amira.growth.badge}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold">25-26 Tri 3</div>
                        <div className="text-base font-extrabold text-slate-800">
                          {student.amira.prev.latest || 'N/A'}
                        </div>
                      </div>
                      <div className="border-l border-slate-100 pl-2">
                        <div className="text-[10px] text-slate-400 font-semibold">26-27 Baseline</div>
                        <div className="text-base font-extrabold text-blue-600">
                          {student.amira.curr.latest || 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Multi-Attempt History Pills */}
                    <div>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Attempt Progression Trail:
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        {student.amira.curr.history.map((att, idx) => (
                          <React.Fragment key={`amira-att-${idx}`}>
                            <span className="px-2 py-0.5 rounded bg-white text-slate-700 font-mono text-[11px] font-bold border border-slate-200">
                              {att}
                            </span>
                            {idx < student.amira.curr.history.length - 1 && (
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      {student.amira.growth.description}
                    </div>
                  </div>

                  {/* STAR Reading YoY Card */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">STAR Reading IRL</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        student.star.growth.status === 'growth' ? 'bg-emerald-100 text-emerald-800' :
                        student.star.growth.status === 'decline' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {student.star.growth.badge}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold">25-26 Spring</div>
                        <div className="text-base font-extrabold text-slate-800">
                          {student.star.prev.latest || 'N/A'}
                        </div>
                      </div>
                      <div className="border-l border-slate-100 pl-2">
                        <div className="text-[10px] text-slate-400 font-semibold">26-27 Fall</div>
                        <div className="text-base font-extrabold text-blue-600">
                          {student.star.curr.latest || 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Multi-Attempt History Pills */}
                    <div>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Attempt Progression Trail:
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        {student.star.curr.history.map((att, idx) => (
                          <React.Fragment key={`star-att-${idx}`}>
                            <span className="px-2 py-0.5 rounded bg-white text-slate-700 font-mono text-[11px] font-bold border border-slate-200">
                              {att}
                            </span>
                            {idx < student.star.curr.history.length - 1 && (
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      {student.star.growth.description}
                    </div>
                  </div>

                  {/* WVUSD ORR YoY Card */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">WVUSD Oral Reading Record</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        student.orr.growth.status === 'growth' ? 'bg-emerald-100 text-emerald-800' :
                        student.orr.growth.status === 'decline' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {student.orr.growth.badge}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center bg-white p-2.5 rounded-xl border border-slate-200/80">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold">25-26 Tri 3</div>
                        <div className="text-base font-extrabold text-slate-800">
                          {student.orr.prev.latest || 'N/A'}
                        </div>
                      </div>
                      <div className="border-l border-slate-100 pl-2">
                        <div className="text-[10px] text-slate-400 font-semibold">26-27 Tri 1</div>
                        <div className="text-base font-extrabold text-blue-600">
                          {student.orr.curr.latest || 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Multi-Attempt History Pills */}
                    <div>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Attempt Progression Trail:
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        {student.orr.curr.history.map((att, idx) => (
                          <React.Fragment key={`orr-att-${idx}`}>
                            <span className="px-2 py-0.5 rounded bg-white text-slate-700 font-mono text-[11px] font-bold border border-slate-200">
                              {att}
                            </span>
                            {idx < student.orr.curr.history.length - 1 && (
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      {student.orr.growth.description}
                    </div>
                  </div>

                </div>
              </div>

              {/* Quick Summary Snapshot */}
              <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-blue-900">
                    SST NotebookLM Intervention Ready
                  </div>
                  <p className="text-xs text-blue-700 mt-0.5 max-w-xl">
                    Student data has been normalized across Illuminate multi-value records. Use the 1-click generator to draft a complete intervention plan.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('sst')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  View SST Prompt
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: 7 PHONICS MICRO-SKILLS */}
          {activeTab === 'phonics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    Foundational Phonics Subtests Breakdown
                  </h4>
                  <p className="text-xs text-slate-500">
                    Comprehensive rubric scores across all 7 foundational literacy micro-skills.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Benchmark (80%+)
                  </span>
                  <span className="flex items-center gap-1 text-amber-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Strategic (60-79%)
                  </span>
                  <span className="flex items-center gap-1 text-rose-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    Intensive (&lt;60%)
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {student.phonics.map((p) => {
                  const barColor = p.tierNum === 1 ? 'bg-emerald-500' : p.tierNum === 2 ? 'bg-amber-500' : 'bg-rose-500';
                  const badgeColor = p.tierNum === 1 ? 'bg-emerald-100 text-emerald-800' : p.tierNum === 2 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800';

                  return (
                    <div key={p.id} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{p.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {p.testedAt}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">
                            {p.score !== null ? `${p.score} / ${p.max}` : 'Not Assessed'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeColor}`}>
                            {p.tier} ({p.percent}%)
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${barColor} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(100, p.percent)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: WRITING COMMON ASSESSMENT RUBRICS */}
          {activeTab === 'writing' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Writing Common Assessment Rubric Scores
                </h4>
                <p className="text-xs text-slate-500">
                  Evaluated on standard 4-point District rubric (1: Below Standard, 2: Approaching, 3: Meets Benchmark, 4: Exceeds).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Narrative Genre */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center justify-between">
                    <span>Narrative Writing</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">Rubric /4.0</span>
                  </div>
                  {student.writing.filter(w => w.genre === 'Narrative').map(w => (
                    <div key={w.id} className="bg-white p-3 rounded-xl border border-slate-200/80">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700">{w.name}</span>
                        <span className={`font-black text-xs px-2 py-0.5 rounded ${
                          w.score >= 3 ? 'bg-emerald-100 text-emerald-800' :
                          w.score === 2 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {w.score ? `${w.score} / 4.0` : '—'}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${w.score >= 3 ? 'bg-emerald-500' : w.score === 2 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${((w.score || 0) / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Opinion Genre */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center justify-between">
                    <span>Opinion Writing</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Rubric /4.0</span>
                  </div>
                  {student.writing.filter(w => w.genre === 'Opinion').map(w => (
                    <div key={w.id} className="bg-white p-3 rounded-xl border border-slate-200/80">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700">{w.name}</span>
                        <span className={`font-black text-xs px-2 py-0.5 rounded ${
                          w.score >= 3 ? 'bg-emerald-100 text-emerald-800' :
                          w.score === 2 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {w.score ? `${w.score} / 4.0` : '—'}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${w.score >= 3 ? 'bg-emerald-500' : w.score === 2 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${((w.score || 0) / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Informational Genre */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center justify-between">
                    <span>Informational Writing</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Rubric /4.0</span>
                  </div>
                  {student.writing.filter(w => w.genre === 'Informational').map(w => (
                    <div key={w.id} className="bg-white p-3 rounded-xl border border-slate-200/80">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700">{w.name}</span>
                        <span className={`font-black text-xs px-2 py-0.5 rounded ${
                          w.score >= 3 ? 'bg-emerald-100 text-emerald-800' :
                          w.score === 2 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {w.score ? `${w.score} / 4.0` : '—'}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${w.score >= 3 ? 'bg-emerald-500' : w.score === 2 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${((w.score || 0) / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: SST NOTEBOOKLM PROMPT GENERATOR */}
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

              {/* Lowest Literacy Deficits Alert */}
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
                <div className="text-xs font-bold text-rose-900 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Identified Priority Literacy Micro-Skill Gaps:
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {student.lowestPhonics.slice(0, 3).map((lp) => (
                    <span key={lp.id} className="bg-white border border-rose-200 text-rose-800 px-2.5 py-1 rounded-lg font-medium">
                      <strong>{lp.name}:</strong> {lp.score !== null ? `${lp.score}/${lp.max} (${lp.percent}%)` : 'Pending'} [{lp.tier}]
                    </span>
                  ))}
                </div>
              </div>

              {/* Prompt Text Preview Box */}
              <div className="relative">
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono leading-relaxed overflow-x-auto border border-slate-800 max-h-80 whitespace-pre-wrap">
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
