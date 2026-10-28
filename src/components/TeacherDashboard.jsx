// src/components/TeacherDashboard.jsx
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Sparkles,
  LayoutGrid,
  List,
  Eye,
  ChevronDown,
  BookOpen,
  Calculator
} from 'lucide-react';
import { getSiteLogo, DISTRICT_LOGO } from '../config/constants';

export default function TeacherDashboard({
  students = [],
  selectedSchool,
  selectedGrade,
  selectedTeacher,
  activeFilter = 'All',
  setActiveFilter,
  searchQuery = '',
  setSearchQuery,
  onSelectStudent,
  onOpenSmallGroups
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [visibleCount, setVisibleCount] = useState(60);

  // Filter criteria options (includes all 3 language proficiency types from Roster!j:j)
  const filterPills = [
    { id: 'All', label: 'All Students' },
    { id: 'EL', label: 'EL (Active LEP)' },
    { id: 'RFEP', label: 'RFEP (Redesignated)' },
    { id: 'IFEP', label: 'IFEP (Initially Fluent)' },
    { id: 'SpEd', label: 'Special Ed (IEP)' },
    { id: '504', label: '504 Plan' },
    { id: 'Foster/Homeless', label: 'Foster / Homeless' },
    { id: '🔴 YoY Decline', label: '🔴 YoY Decline / Regression' },
    { id: 'Tier 3 Phonics', label: 'Tier 3 Deficits' }
  ];

  // Reset pagination whenever filters or search change
  const filterKey = `${searchQuery}_${activeFilter}_${selectedSchool}_${selectedGrade}_${selectedTeacher}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setVisibleCount(60);
  }

  // Apply filters
  const filteredStudents = students.filter((s) => {
    // School filter
    if (selectedSchool !== 'ALL' && s.school !== selectedSchool && s.site !== selectedSchool) {
      return false;
    }

    // Grade filter (handles "3rd", "3", 3, etc.)
    if (selectedGrade !== 'ALL') {
      const matchGradeStr = s.gradeStr === selectedGrade;
      const matchGradeNum = String(s.grade) === String(selectedGrade).replace(/\D/g, '');
      if (!matchGradeStr && !matchGradeNum) return false;
    }

    // Teacher filter
    if (selectedTeacher !== 'ALL' && s.teacher !== selectedTeacher) {
      return false;
    }

    // Search query (Student Name, ID, or Teacher)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = s.name?.toLowerCase().includes(q);
      const matchId = s.id?.toLowerCase().includes(q);
      const matchTeacher = s.teacher?.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchTeacher) return false;
    }

    // Active filter pill
    if (activeFilter === 'EL' && !s.isEL) return false;
    if (activeFilter === 'RFEP' && !s.isRFEP) return false;
    if (activeFilter === 'IFEP' && !s.isIFEP) return false;
    if (activeFilter === 'SpEd' && !s.isSpEd) return false;
    if (activeFilter === '504' && !s.is504) return false;
    if (activeFilter === 'Foster/Homeless' && !s.isFosterHomeless) return false;
    if (activeFilter === '🔴 YoY Decline' && !s.hasYoYDecline) return false;
    if (activeFilter === 'Tier 3 Phonics' && !s.hasTier3Phonics) return false;

    return true;
  });

  // Chunked displayed students for lightning-fast DOM rendering
  const displayedStudents = filteredStudents.slice(0, visibleCount);

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      
      {/* Top Controls: Search, Filter Pills, View Toggle, Small Groups CTA */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, ID (e.g. 328869), or teacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 justify-end">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Launch Small Group Builder */}
            <button
              onClick={onOpenSmallGroups}
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Small Group Builder</span>
            </button>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Filters:
          </span>
          {filterPills.map((pill) => {
            const isActive = activeFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setActiveFilter(pill.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition text-xs flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {pill.id === '🔴 YoY Decline' && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Status bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5 gap-2">
          <div>
            Showing <strong className="text-slate-800">{displayedStudents.length}</strong> of{' '}
            <strong className="text-slate-800">{filteredStudents.length}</strong> matched students
            {filteredStudents.length !== students.length && (
              <span> (filtered from <strong className="text-slate-800">{students.length}</strong> total)</span>
            )}
            {selectedSchool !== 'ALL' && ` • ${selectedSchool}`}
            {selectedGrade !== 'ALL' && ` • Grade ${selectedGrade}`}
            {selectedTeacher !== 'ALL' && ` • ${selectedTeacher}`}
          </div>
          {activeFilter !== 'All' && (
            <button
              onClick={() => setActiveFilter('All')}
              className="text-blue-600 hover:underline font-semibold"
            >
              Reset filter
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No students match current filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Try adjusting your search terms, changing the active filter pill, or selecting "All Schools / All Grades" above.
          </p>
          <button
            onClick={() => {
              setActiveFilter('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedStudents.map((student) => {
            const siteLogo = getSiteLogo(student.school);
            const { headline } = student;

            return (
              <div
                key={student.id}
                onClick={() => onSelectStudent(student)}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-400 p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Banner accent if YoY decline */}
                {student.hasYoYDecline && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-amber-500" />
                )}

                <div>
                  {/* Card Header: Authoritative Roster Info */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                          {student.name}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-400 shrink-0">
                          #{student.id}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 truncate">
                        <span>Grade {student.gradeStr || student.grade}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-700 truncate">{student.teacher}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {student.school}
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-slate-50 p-1 border border-slate-100 flex items-center justify-center shrink-0">
                      <img
                        src={siteLogo}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => { e.target.src = DISTRICT_LOGO; }}
                      />
                    </div>
                  </div>

                  {/* Program Badges & Matched Sheet Tabs */}
                  <div className="flex flex-wrap items-center gap-1 mt-2.5">
                    {student.isEL && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        EL (LEP)
                      </span>
                    )}
                    {student.isRFEP && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200" title="Redesignated Fluent English Proficient (Monitored)">
                        Redesignated (RFEP)
                      </span>
                    )}
                    {student.isIFEP && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200" title="Initially Fluent English Proficient">
                        Initially Fluent (IFEP)
                      </span>
                    )}
                    {student.isSpEd && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        SpEd
                      </span>
                    )}
                    {student.is504 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        504
                      </span>
                    )}
                    {student.isFosterHomeless && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-pink-100 text-pink-800 border border-pink-200">
                        Foster/Homeless
                      </span>
                    )}
                    {student.hasYoYDecline && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-rose-600" />
                        YoY Decline
                      </span>
                    )}
                    {!student.hasYoYDecline && student.overallYoYStatus === 'growth' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-600" />
                        YoY Growth
                      </span>
                    )}
                    {student.matchedTabs?.map((t) => (
                      <span key={t} className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Dynamic Headline Assessment Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-xl p-2.5 mt-3 border border-slate-100">
                    
                    {/* ELA Metric (Amira or STAR) */}
                    <div className="text-left bg-white p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-blue-600" />
                        <span className="truncate">{headline.star ? 'STAR Reading' : headline.amira ? 'Amira ARM' : 'ELA Score'}</span>
                      </div>
                      <div className="text-xs font-black text-slate-900 mt-1 truncate">
                        {headline.star?.parsed.latest ? `Level ${headline.star.parsed.latest}` :
                         headline.amira?.parsed.latest ? `${headline.amira.parsed.latest} ARM` :
                         headline.orr?.parsed.latest ? `ORR ${headline.orr.parsed.latest}` : 'N/A'}
                      </div>
                      {/* Multi-attempt progression trail */}
                      {headline.star?.parsed.history.length > 1 && (
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5 truncate">
                          {headline.star.parsed.history.slice(-3).join(' → ')}
                        </div>
                      )}
                      {headline.amira?.parsed.history.length > 1 && !headline.star && (
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5 truncate">
                          {headline.amira.parsed.history.slice(-3).join(' → ')}
                        </div>
                      )}
                    </div>

                    {/* Math Metric */}
                    <div className="text-left bg-white p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Calculator className="w-3 h-3 text-indigo-600" />
                        <span className="truncate">{headline.math ? 'Math CA' : 'Math Score'}</span>
                      </div>
                      <div className="text-xs font-black text-slate-900 mt-1 truncate">
                        {headline.math?.parsed.latest ? `${headline.math.parsed.latest}%` : 'N/A'}
                      </div>
                      {headline.math?.parsed.history.length > 1 && (
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5 truncate">
                          {headline.math.parsed.history.slice(-3).join(' → ')}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Year-over-Year Trajectory Snippet */}
                  {student.yoyComparisons.length > 0 && (
                    <div className="mt-2.5 space-y-1">
                      {student.yoyComparisons.slice(0, 2).map((comp) => (
                        <div key={comp.family} className="flex items-center justify-between text-[11px] bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                          <span className="text-slate-600 font-semibold truncate pr-1">
                            {comp.family}
                          </span>
                          <span className={`text-[10px] font-bold shrink-0 px-1.5 py-0.2 rounded ${
                            comp.growth.status === 'growth' ? 'bg-emerald-100 text-emerald-800' :
                            comp.growth.status === 'decline' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {comp.prev.parsed.latest} → {comp.curr.parsed.latest}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: View Student Profile CTA */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-bold group-hover:text-blue-700">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    Deep-Dive & SST Prompt
                  </span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3">Grade & Site</th>
                  <th className="py-3 px-3">Teacher</th>
                  <th className="py-3 px-3">Programs</th>
                  <th className="py-3 px-3 text-center">ELA Metric</th>
                  <th className="py-3 px-3 text-center">Math Metric</th>
                  <th className="py-3 px-3 text-center">YoY Status</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedStudents.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => onSelectStudent(s)}
                    className="hover:bg-blue-50/50 cursor-pointer transition"
                  >
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>{s.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">#{s.id}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <div>Grade {s.gradeStr || s.grade}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{s.school}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium truncate max-w-[140px]">
                      {s.teacher}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[120px]">
                        {s.isEL && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            EL
                          </span>
                        )}
                        {s.isRFEP && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                            RFEP
                          </span>
                        )}
                        {s.isIFEP && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                            IFEP
                          </span>
                        )}
                        {s.isSpEd && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                            IEP
                          </span>
                        )}
                        {s.is504 && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            504
                          </span>
                        )}
                        {s.isFosterHomeless && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-pink-100 text-pink-800">
                            Foster
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {s.headline.star?.parsed.latest ? `STAR ${s.headline.star.parsed.latest}` :
                       s.headline.amira?.parsed.latest ? `Amira ${s.headline.amira.parsed.latest}` :
                       s.headline.orr?.parsed.latest ? `ORR ${s.headline.orr.parsed.latest}` : '—'}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {s.headline.math?.parsed.latest ? `${s.headline.math.parsed.latest}%` : '—'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.overallYoYStatus === 'growth' ? 'bg-emerald-100 text-emerald-800' :
                        s.overallYoYStatus === 'decline' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.overallYoYStatus === 'growth' ? '🟢 Growth' :
                         s.overallYoYStatus === 'decline' ? '🔴 Decline' : '🟡 Steady'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs"
                      >
                        Profile →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination / Chunked Rendering Load More Button */}
      {visibleCount < filteredStudents.length && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + 60)}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 px-6 py-3 rounded-2xl text-xs font-bold shadow-xs transition transform hover:-translate-y-0.5"
          >
            <span>Load Next 60 Students</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setVisibleCount(filteredStudents.length)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-2 px-3 rounded-xl hover:bg-slate-100 transition"
          >
            Show All ({filteredStudents.length.toLocaleString()} Students)
          </button>
        </div>
      )}

    </div>
  );
}
