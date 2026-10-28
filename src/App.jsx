// src/App.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import HeaderBar from './components/HeaderBar';
import SiteAdminOverview from './components/SiteAdminOverview';
import TeacherDashboard from './components/TeacherDashboard';
import SmallGroupBuilder from './components/SmallGroupBuilder';
import StudentModal from './components/StudentModal';

import { 
  GOOGLE_CLIENT_ID, 
  SUPER_ADMIN_EMAIL, 
  DISTRICT_LOGO, 
  isValidStaffEmail 
} from './config/constants';
import { parseStudentRecord } from './utils/dataParser';
import { 
  RAW_SAMPLE_STUDENTS, 
  WVUSD_ELEMENTARY_SCHOOLS, 
  TEACHERS_BY_SCHOOL_AND_GRADE 
} from './data/sampleData';

import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  AlertOctagon
} from 'lucide-react';

// Decode Google JWT token safely in browser
function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Failed to decode JWT:', err);
    return null;
  }
}

export default function App() {
  // Initialize user lazily from sessionStorage to avoid render flicker
  const [user, setUser] = useState(() => {
    try {
      const cachedToken = sessionStorage.getItem('wvusd_staff_token');
      const cachedUser = sessionStorage.getItem('wvusd_staff_user');
      if (cachedToken && cachedUser) {
        const parsed = JSON.parse(cachedUser);
        if (isValidStaffEmail(parsed?.email)) {
          return parsed;
        }
      }
    } catch {
      sessionStorage.clear();
    }
    return null;
  });

  const [authError, setAuthError] = useState(null); // null | 'domain_blocked' | 'invalid_token'
  const [blockedEmail, setBlockedEmail] = useState('');

  // App Navigation & Drilldown State
  const [activeView, setActiveView] = useState('overview'); // 'overview' | 'teacher' | 'small-groups'
  const [selectedSchool, setSelectedSchool] = useState('Collegewood Elementary');
  const [selectedGrade, setSelectedGrade] = useState(3); // Default to Grade 3 focal
  const [selectedTeacher, setSelectedTeacher] = useState('ALL');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Student for Deep-Dive Modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // Current Role Preview (Super Admin can switch role perspective)
  const [currentRole, setCurrentRole] = useState(() => user?.role || 'SUPER ADMIN');

  // Parse Raw Student Records into Rich Format
  const students = useMemo(() => {
    return RAW_SAMPLE_STUDENTS.map(parseStudentRecord);
  }, []);

  // Compute available teachers list based on active school and grade
  const availableTeachers = useMemo(() => {
    if (selectedSchool === 'ALL') {
      const allT = new Set();
      students.forEach(s => {
        if (selectedGrade === 'ALL' || s.grade === Number(selectedGrade)) {
          allT.add(s.teacher);
        }
      });
      return Array.from(allT).sort();
    }

    const schoolTeachers = TEACHERS_BY_SCHOOL_AND_GRADE[selectedSchool];
    if (!schoolTeachers) return [];

    if (selectedGrade === 'ALL') {
      const allForSchool = new Set();
      Object.values(schoolTeachers).forEach(arr => arr.forEach(t => allForSchool.add(t)));
      return Array.from(allForSchool).sort();
    }

    return schoolTeachers[selectedGrade] || [];
  }, [selectedSchool, selectedGrade, students]);

  // Handle successful login credentials
  const handleAuthSuccess = useCallback((token, decodedUser) => {
    const email = decodedUser?.email || '';

    // STRICT DOMAIN LOCK
    if (!isValidStaffEmail(email)) {
      setBlockedEmail(email);
      setAuthError('domain_blocked');
      return;
    }

    // Role resolution
    const cleanEmail = email.toLowerCase().trim();
    let role = 'CLASSROOM TEACHER';
    let isSuperAdmin = false;

    if (cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase() || cleanEmail.includes('kwendland')) {
      role = 'SUPER ADMIN';
      isSuperAdmin = true;
    } else if (cleanEmail.includes('admin') || cleanEmail.includes('principal') || cleanEmail.includes('specialist')) {
      role = 'SITE ADMIN / SPECIALIST';
    }

    const authUserData = {
      email,
      name: decodedUser.name || email.split('@')[0],
      picture: decodedUser.picture || null,
      role,
      isSuperAdmin,
      id_token: token
    };

    // Cache in sessionStorage for refresh persistence
    sessionStorage.setItem('wvusd_staff_token', token);
    sessionStorage.setItem('wvusd_staff_user', JSON.stringify(authUserData));

    setUser(authUserData);
    setCurrentRole(role);
    setAuthError(null);
    setBlockedEmail('');
  }, []);



  // Initialize Google Identity Services (GSI)
  useEffect(() => {
    if (user) return;

    const setupGSI = () => {
      if (window.google?.accounts?.id && GOOGLE_CLIENT_ID) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (response) => {
              if (response.credential) {
                const payload = decodeJwt(response.credential);
                if (payload) {
                  handleAuthSuccess(response.credential, payload);
                } else {
                  setAuthError('invalid_token');
                }
              }
            },
            auto_select: true,
            itp_support: true,
          });

          const btnEl = document.getElementById('gsi-signin-container');
          if (btnEl) {
            window.google.accounts.id.renderButton(btnEl, {
              theme: 'outline',
              size: 'large',
              type: 'standard',
              shape: 'pill',
              text: 'signin_with',
              logo_alignment: 'left',
              width: 280
            });
          }

          window.google.accounts.id.prompt();
        } catch (err) {
          console.warn('GSI Initialization info:', err);
        }
      }
    };

    // Attempt GSI initialization
    setupGSI();
    const timer = setInterval(() => {
      if (window.google?.accounts?.id) {
        setupGSI();
        clearInterval(timer);
      }
    }, 400);

    return () => clearInterval(timer);
  }, [user, handleAuthSuccess]);

  // Dev Super-Admin Bypass
  const handleDevBypass = (presetEmail = SUPER_ADMIN_EMAIL, presetRole = 'SUPER ADMIN') => {
    const mockUser = {
      email: presetEmail,
      name: presetEmail === SUPER_ADMIN_EMAIL ? 'Kurt Wendland (Super-Admin)' : presetEmail.split('@')[0],
      picture: null,
      role: presetRole,
      isSuperAdmin: presetRole === 'SUPER ADMIN',
      id_token: 'mock-dev-token-wvusd-2026'
    };

    sessionStorage.setItem('wvusd_staff_token', mockUser.id_token);
    sessionStorage.setItem('wvusd_staff_user', JSON.stringify(mockUser));

    setUser(mockUser);
    setCurrentRole(presetRole);
    setAuthError(null);
  };

  // Sign Out
  const handleSignOut = () => {
    sessionStorage.removeItem('wvusd_staff_token');
    sessionStorage.removeItem('wvusd_staff_user');
    setUser(null);
    setAuthError(null);
    setBlockedEmail('');
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  // Handle drilldowns from SiteAdminOverview
  const handleDrilldown = ({ school, grade, teacher, filter, view }) => {
    if (school) setSelectedSchool(school);
    if (grade) setSelectedGrade(grade);
    if (teacher) setSelectedTeacher(teacher);
    if (filter) setActiveFilter(filter);
    if (view) {
      setActiveView(view);
    } else {
      setActiveView('teacher');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open modal for a specific student
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setIsStudentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. DOMAIN LOCK / SECURITY SCREEN */}
      {authError === 'domain_blocked' && (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-rose-200 p-6 sm:p-8 text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase bg-rose-100 text-rose-800 tracking-wider">
                WVUSD Security Lock
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Access Denied: Staff Domain Required
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You attempted to sign in with <strong className="text-rose-600 font-mono">{blockedEmail || 'an unauthorized account'}</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 text-left space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-500" />
                Staff Security Policy Notice:
              </div>
              <p>
                Student accounts (<code className="text-rose-600 font-bold">@stu.wvusd.org</code>) and personal Gmail accounts are prohibited from accessing elementary student records.
              </p>
              <p className="text-[11px] text-slate-500">
                Only authenticated <code className="text-blue-700 font-bold">@wvusd.org</code> and <code className="text-blue-700 font-bold">@sub.wvusd.org</code> staff credentials are authorized.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setAuthError(null);
                  setBlockedEmail('');
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Sign In with Official WVUSD Staff Account
              </button>

              <button
                onClick={() => handleDevBypass()}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Super-Admin Dev Bypass ({SUPER_ADMIN_EMAIL})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. AUTHENTICATION LANDING SCREEN (If not logged in) */}
      {!user && authError !== 'domain_blocked' && (
        <div className="min-h-screen flex flex-col justify-between p-4 sm:p-8 bg-gradient-to-b from-slate-100 via-slate-50 to-blue-50">
          
          <div className="max-w-md w-full mx-auto my-auto space-y-6 text-center animate-fade-in">
            {/* WVUSD District Logo */}
            <div className="flex flex-col items-center">
              <img
                src={DISTRICT_LOGO}
                alt="WVUSD Logo"
                className="h-20 w-auto object-contain drop-shadow-md mb-3"
              />
              <span className="text-xs font-black uppercase tracking-widest text-blue-900">
                Walnut Valley Unified School District
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Elementary Student Data & Intervention Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm">
                Year-over-Year Literacy Growth, Illuminate Multi-Attempt Tracking, and Small Group Table Pull-Outs.
              </p>
            </div>

            {/* Google Identity Services Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Single-Click ChromeOS Staff Auto-Auth</span>
              </div>

              {/* Rendered Google GSI Button Container */}
              <div id="gsi-signin-container" className="flex justify-center min-h-[44px]" />

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-[11px] uppercase font-bold tracking-wider">
                  Development & Instant Preview
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Dev Bypass Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleDevBypass(SUPER_ADMIN_EMAIL, 'SUPER ADMIN')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 shadow-2xs transition transform hover:-translate-y-0.5"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Super-Admin Dev Bypass ({SUPER_ADMIN_EMAIL})</span>
                </button>

                <div className="grid grid-cols-2 gap-2 text-left">
                  <button
                    type="button"
                    onClick={() => {
                      handleDevBypass('specialist.roster@wvusd.org', 'SITE ADMIN / SPECIALIST');
                      setSelectedSchool('Maple Hill Elementary');
                    }}
                    className="p-2.5 rounded-xl text-[11px] font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
                  >
                    <div className="text-[10px] text-emerald-600 uppercase">Specialist View</div>
                    <div>Maple Hill Specialist</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleDevBypass('mrs.chang@wvusd.org', 'CLASSROOM TEACHER');
                      setSelectedSchool('Collegewood Elementary');
                      setSelectedGrade(3);
                      setSelectedTeacher('Mrs. Chang');
                    }}
                    className="p-2.5 rounded-xl text-[11px] font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition"
                  >
                    <div className="text-[10px] text-blue-600 uppercase">Teacher View</div>
                    <div>Collegewood 3rd Gr</div>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-1">
                Domain locked to <strong className="text-slate-600">@wvusd.org</strong> and <strong className="text-slate-600">@sub.wvusd.org</strong>
              </div>
            </div>

            {/* School logos preview pill */}
            <div className="text-xs text-slate-400">
              Serving Collegewood, Maple Hill, Vejar, Castle Rock, Evergreen, Quail Summit, Westhoff, CJ Morris & Walnut Elementary
            </div>
          </div>

          <footer className="text-center text-xs text-slate-400 pt-6">
            © 2026 Walnut Valley Unified School District • Educational Services & Data Analytics
          </footer>
        </div>
      )}

      {/* 3. AUTHENTICATED APPLICATION DASHBOARD */}
      {user && (
        <>
          {/* Header Bar */}
          <HeaderBar
            user={user}
            activeView={activeView}
            setActiveView={setActiveView}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
            selectedTeacher={selectedTeacher}
            setSelectedTeacher={setSelectedTeacher}
            schoolsList={WVUSD_ELEMENTARY_SCHOOLS}
            gradesList={[1, 2, 3, 4, 5]}
            teachersList={availableTeachers}
            onSignOut={handleSignOut}
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
          />

          {/* Main Dashboard Workspace */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* View 1: School Executive Overview (Site Admin & Specialist) */}
            {activeView === 'overview' && (
              <SiteAdminOverview
                students={students}
                selectedSchool={selectedSchool}
                onDrilldown={handleDrilldown}
              />
            )}

            {/* View 2: Classroom Teacher View (Roster Card Grid & Multi-Attempt Trails) */}
            {activeView === 'teacher' && (
              <TeacherDashboard
                students={students}
                selectedSchool={selectedSchool}
                selectedGrade={selectedGrade}
                selectedTeacher={selectedTeacher}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSelectStudent={handleSelectStudent}
                onOpenSmallGroups={() => setActiveView('small-groups')}
              />
            )}

            {/* View 3: Click-an-Assessment Small Group Builder */}
            {activeView === 'small-groups' && (
              <SmallGroupBuilder
                students={students}
                selectedSchool={selectedSchool}
                selectedGrade={selectedGrade}
                selectedTeacher={selectedTeacher}
                onSelectStudent={handleSelectStudent}
              />
            )}

          </main>

          {/* Student Deep-Dive & SST Prompt Modal */}
          <StudentModal
            student={selectedStudent}
            isOpen={isStudentModalOpen}
            onClose={() => {
              setIsStudentModalOpen(false);
              setSelectedStudent(null);
            }}
          />

          {/* Footer */}
          <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-8 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">WVUSD Elementary Literacy & Data Portal</span>
                <span>•</span>
                <span>Academic Year 2026-2027</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Connected to Illuminate Data & Google Identity Services (GSI)
              </div>
            </div>
          </footer>
        </>
      )}

    </div>
  );
}
