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
  Eye
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

  // Filter criteria options
  const filterPills = [
    { id: 'All', label: 'All Students' },
    { id: 'EL', label: 'English Learners (EL)' },
    { id: 'SpEd', label: 'Special Ed (IEP)' },
    { id: '504', label: '504 Plan' },
    { id: 'Foster/Homeless', label: 'Foster / Homeless' },
    { id: '🔴 YoY Decline', label: '🔴 YoY Decline / Regression' },
    { id: 'Tier 3 Phonics', label: 'Tier 3 Phonics Deficit' }
  ];

  // Apply filters
  const filteredStudents = students.filter((s) => {
    // School filter
    if (selectedSchool !== 'ALL' && s.school !== selectedSchool) return false;
    // Grade filter
    if (selectedGrade !== 'ALL' && s.grade !== Number(selectedGrade)) return false;
    // Teacher filter
    if (selectedTeacher !== 'ALL' && s.teacher !== selectedTeacher) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = s.name.toLowerCase().includes(q);
      const matchId = s.id.toLowerCase().includes(q);
      const matchTeacher = s.teacher.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchTeacher) return false;
    }

    // Active filter pill
    if (activeFilter === 'EL' && !s.isEL) return false;
    if (activeFilter === 'SpEd' && !s.isSpEd) return false;
    if (activeFilter === '504' && !s.is504) return false;
    if (activeFilter === 'Foster/Homeless' && !s.isFosterHomeless) return false;
    if (activeFilter === '🔴 YoY Decline' && !s.hasYoYDecline) return false;
    if (activeFilter === 'Tier 3 Phonics' && !s.hasTier3Phonics) return false;

    return true;
  });

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
              placeholder="Search student by name, student ID, or teacher..."
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
        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
          <div>
            Showing <strong className="text-slate-800">{filteredStudents.length}</strong> of{' '}
            <strong className="text-slate-800">{students.length}</strong> rostered students
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
          {filteredStudents.map((student) => {
            const lowestSkill = student.lowestPhonics[0];
            const siteLogo = getSiteLogo(student.school);

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
                  {/* Card Header: Name, ID, Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {student.name}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-400">
                          #{student.id}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <span>Grade {student.grade}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-700">{student.teacher}</span>
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

                  {/* Program Badges */}
                  <div className="flex flex-wrap items-center gap-1 mt-2.5">
                    {student.isEL && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        EL: {student.elLevel ? student.elLevel.split(' ')[0] : 'EL'}
                      </span>
                    )}
                    {student.isSpEd && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        SpEd / IEP
                      </span>
                    )}
                    {student.is504 && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        504
                      </span>
                    )}
                    {student.isFosterHomeless && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-100 text-pink-800 border border-pink-200">
                        Foster / Homeless
                      </span>
                    )}
                    {student.hasYoYDecline && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-rose-600" />
                        YoY Decline
                      </span>
                    )}
                    {!student.hasYoYDecline && student.overallYoYStatus === 'growth' && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-600" />
                        YoY Growth
                      </span>
                    )}
                  </div>

                  {/* Assessment Performance Triad */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-2.5 mt-3 border border-slate-100">
                    
                    {/* Amira ARM */}
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Amira ARM</div>
                      <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                        {student.amira.curr.latest || 'N/A'}
                      </div>
                      {/* Mini progression trail */}
                      {student.amira.curr.history.length > 1 && (
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5 truncate" title={`Attempts: ${student.amira.curr.history.join(' → ')}`}>
                          {student.amira.curr.history.slice(-3).join('→')}
                        </div>
                      )}
                      <div className="text-[9px] mt-0.5">
                        <span className={`px-1 py-0.2 rounded font-bold ${
                          student.amira.growth.status === 'growth' ? 'text-emerald-700 bg-emerald-50' :
                          student.amira.growth.status === 'decline' ? 'text-rose-700 bg-rose-50' : 'text-slate-500'
                        }`}>
                          {student.amira.growth.status === 'growth' ? `+${student.amira.growth.delta}` :
                           student.amira.growth.status === 'decline' ? `${student.amira.growth.delta}` : 'Steady'}
                        </span>
                      </div>
                    </div>

                    {/* STAR Reading */}
                    <div className="text-center border-x border-slate-200 px-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">STAR IRL</div>
                      <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                        {student.star.curr.latest || 'N/A'}
                      </div>
                      {/* Mini progression trail */}
                      {student.star.curr.history.length > 1 && (
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5 truncate" title={`Attempts: ${student.star.curr.history.join(' → ')}`}>
                          {student.star.curr.history.slice(-3).join('→')}
                        </div>
                      )}
                      <div className="text-[9px] mt-0.5">
                        <span className={`px-1 py-0.2 rounded font-bold ${
                          student.star.growth.status === 'growth' ? 'text-emerald-700 bg-emerald-50' :
                          student.star.growth.status === 'decline' ? 'text-rose-700 bg-rose-50' : 'text-slate-500'
                        }`}>
                          {student.star.growth.status === 'growth' ? `+${student.star.growth.delta}` :
                           student.star.growth.status === 'decline' ? `${student.star.growth.delta}` : 'Steady'}
                        </span>
                      </div>
                    </div>

                    {/* ORR Level */}
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">ORR Level</div>
                      <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                        {student.orr.curr.latest || 'N/A'}
                      </div>
                      {/* Mini progression trail */}
                      {student.orr.curr.history.length > 1 && (
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5 truncate" title={`Attempts: ${student.orr.curr.history.join(' → ')}`}>
                          {student.orr.curr.history.slice(-3).join('→')}
                        </div>
                      )}
                      <div className="text-[9px] mt-0.5">
                        <span className={`px-1 py-0.2 rounded font-bold ${
                          student.orr.growth.status === 'growth' ? 'text-emerald-700 bg-emerald-50' :
                          student.orr.growth.status === 'decline' ? 'text-rose-700 bg-rose-50' : 'text-slate-500'
                        }`}>
                          {student.orr.growth.status === 'growth' ? `+${student.orr.growth.delta}` :
                           student.orr.growth.status === 'decline' ? `${student.orr.growth.delta}` : 'Steady'}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Phonics Deficit Highlight */}
                  {lowestSkill && lowestSkill.score !== null && (
                    <div className="mt-3 flex items-center justify-between text-[11px] bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-100">
                      <span className="text-slate-500 truncate mr-2">
                        Lowest: <strong className="text-slate-700">{lowestSkill.name}</strong>
                      </span>
                      <span className={`font-bold shrink-0 ${
                        lowestSkill.tierNum === 3 ? 'text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded' :
                        lowestSkill.tierNum === 2 ? 'text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded' : 'text-emerald-600'
                      }`}>
                        {lowestSkill.score}/{lowestSkill.max} ({lowestSkill.percent}%)
                      </span>
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
                  <th className="py-3 px-3">School & Teacher</th>
                  <th className="py-3 px-3">Programs</th>
                  <th className="py-3 px-3 text-center">Amira ARM</th>
                  <th className="py-3 px-3 text-center">STAR IRL</th>
                  <th className="py-3 px-3 text-center">ORR Level</th>
                  <th className="py-3 px-3 text-center">YoY Trajectory</th>
                  <th className="py-3 px-3">Lowest Phonics Skill</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s) => (
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
                      <div>Grade {s.grade} • {s.teacher}</div>
                      <div className="text-[10px] text-slate-400">{s.school}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {s.isEL && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                            EL
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
                      {s.amira.curr.latest || 'N/A'}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {s.star.curr.latest || 'N/A'}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {s.orr.curr.latest || 'N/A'}
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
                    <td className="py-3 px-3 text-slate-600">
                      {s.lowestPhonics[0]?.name ? (
                        <div className="text-[11px]">
                          <span>{s.lowestPhonics[0].name}</span>{' '}
                          <span className="font-bold text-rose-600">
                            ({s.lowestPhonics[0].percent}%)
                          </span>
                        </div>
                      ) : (
                        '—'
                      )}
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

    </div>
  );
}
