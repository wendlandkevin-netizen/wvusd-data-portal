// src/components/HeaderBar.jsx
import React from 'react';
import { 
  Building2, 
  GraduationCap, 
  User, 
  LogOut, 
  BarChart2, 
  Users, 
  Sparkles, 
  ShieldCheck
} from 'lucide-react';
import { DISTRICT_LOGO, getSiteLogo } from '../config/constants';

export default function HeaderBar({
  user,
  activeView,
  setActiveView,
  selectedSchool,
  setSelectedSchool,
  selectedGrade,
  setSelectedGrade,
  selectedTeacher,
  setSelectedTeacher,
  schoolsList = [],
  gradesList = [],
  teachersList = [],
  onSignOut,
  currentRole,
  onRoleChange
}) {
  const activeLogo = getSiteLogo(selectedSchool);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'SUPER ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            SUPER ADMIN
          </span>
        );
      case 'SITE ADMIN / SPECIALIST':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            SITE ADMIN / SPECIALIST
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <User className="w-3.5 h-3.5 text-blue-600" />
            CLASSROOM TEACHER
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Primary Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left: District Brand & Active School Logo */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-3 shrink-0">
              <img
                src={DISTRICT_LOGO}
                alt="WVUSD District Logo"
                className="h-12 w-auto object-contain drop-shadow-xs"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="hidden sm:block border-l border-slate-200 pl-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-blue-900">
                  Walnut Valley USD
                </p>
                <h1 className="text-sm font-bold text-slate-800 leading-tight">
                  Elementary Student Data & Intervention
                </h1>
              </div>
            </div>

            {/* School Logo Dynamic Banner */}
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-xs transition-all duration-300">
              <div className="relative w-9 h-9 flex items-center justify-center shrink-0 bg-white rounded-lg p-1 border border-slate-200/70 shadow-xs overflow-hidden">
                <img
                  key={selectedSchool}
                  src={activeLogo}
                  alt={`${selectedSchool} logo`}
                  className="max-h-full max-w-full object-contain transition-all duration-500 ease-in-out transform hover:scale-105"
                  onError={(e) => {
                    e.target.src = DISTRICT_LOGO;
                  }}
                />
              </div>
              <div className="min-w-0 pr-1">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Active Site
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[140px] sm:max-w-[200px]">
                  {selectedSchool === 'ALL' ? 'All WVUSD Elementary' : selectedSchool}
                </div>
              </div>
            </div>
          </div>

          {/* Right: User Profile, Role Badge & Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex flex-col items-end text-right">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">
                  {user?.name || user?.email?.split('@')[0] || 'Staff Member'}
                </span>
                {getRoleBadge(currentRole || user?.role)}
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {user?.email || 'kwendland@wvusd.org'}
              </span>
            </div>

            {/* Dev role switcher */}
            {(user?.isSuperAdmin || user?.email === 'kwendland@wvusd.org') && (
              <div className="hidden lg:flex items-center gap-1.5 bg-purple-50 border border-purple-200 px-2 py-1 rounded-lg">
                <span className="text-[10px] font-bold text-purple-700 uppercase">View As:</span>
                <select
                  aria-label="View As Role"
                  value={currentRole}
                  onChange={(e) => onRoleChange && onRoleChange(e.target.value)}
                  className="text-xs font-semibold bg-white border border-purple-200 text-purple-900 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="SUPER ADMIN">Super Admin</option>
                  <option value="SITE ADMIN / SPECIALIST">Site Admin / Specialist</option>
                  <option value="CLASSROOM TEACHER">Classroom Teacher</option>
                </select>
              </div>
            )}

            <button
              onClick={onSignOut}
              title="Sign Out"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-3 py-2 rounded-xl transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Header: View Switcher & Global Drilldown Filters */}
      <div className="bg-slate-50/80 border-t border-slate-200/70 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* View Toggle Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveView('overview')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeView === 'overview'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              School Executive Overview
            </button>

            <button
              type="button"
              onClick={() => setActiveView('teacher')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeView === 'teacher'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Classroom Teacher View
            </button>

            <button
              type="button"
              onClick={() => setActiveView('small-groups')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeView === 'small-groups'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Small Group Builder
            </button>
          </div>

          {/* Drilldown Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            {/* School Site Filter */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <select
                aria-label="Filter by School Site"
                value={selectedSchool}
                onChange={(e) => {
                  setSelectedSchool(e.target.value);
                  setSelectedTeacher('ALL');
                }}
                className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer max-w-[160px]"
              >
                <option value="ALL">All Schools</option>
                {schoolsList.map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade Level Filter */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1 shadow-2xs">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <select
                aria-label="Filter by Grade Level"
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                  setSelectedTeacher('ALL');
                }}
                className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Grades</option>
                {gradesList.map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Teacher Filter */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1 shadow-2xs">
              <User className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <select
                aria-label="Filter by Teacher"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer max-w-[140px]"
              >
                <option value="ALL">All Teachers</option>
                {teachersList.map((teacher) => (
                  <option key={teacher} value={teacher}>
                    {teacher}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
