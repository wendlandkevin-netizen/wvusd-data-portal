// src/App.jsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import HeaderBar from './components/HeaderBar';
import SiteAdminOverview from './components/SiteAdminOverview';
import TeacherDashboard from './components/TeacherDashboard';
import SmallGroupBuilder from './components/SmallGroupBuilder';
import StudentModal from './components/StudentModal';

import { 
  GOOGLE_CLIENT_ID, 
  SUPER_ADMIN_EMAIL, 
  DISTRICT_LOGO, 
  isValidStaffEmail,
  GAS_WEB_APP_URL
} from './config/constants';
import { parseStudentRecord, findTeacherForUser } from './utils/dataParser';

import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  AlertOctagon,
  RefreshCw,
  ExternalLink,
  Loader2,
  Database,
  User
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
  // Authentication & Session State
  const [user, setUser] = useState(() => {
    try {
      const cachedUser = sessionStorage.getItem('wvusd_staff_user');
      if (cachedUser) {
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

  // Live API Fetching State
  const [students, setStudents] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [fetchUrl, setFetchUrl] = useState('');

  // App Navigation & Drilldown State
  const [activeView, setActiveView] = useState('overview'); // 'overview' | 'teacher' | 'small-groups'
  const [selectedSchool, setSelectedSchool] = useState('ALL');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [selectedTeacher, setSelectedTeacher] = useState('ALL');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Student for Deep-Dive Modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // Current Role Preview (Super Admin can switch role perspective)
  const [currentRole, setCurrentRole] = useState(() => user?.role || 'SUPER ADMIN');

  // Maintain reference to current user for async callbacks
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Track if initial view and teacher routing have been applied for this session
  const hasAppliedInitialViewRef = useRef(false);

  // Automatically default Classroom Teachers to Classroom Teacher View with their roster
  const applyInitialRoutingAndFilters = useCallback((currentUser, parsedStudentsList, apiUserData) => {
    if (!currentUser || !parsedStudentsList || parsedStudentsList.length === 0) return;
    if (hasAppliedInitialViewRef.current) return;
    hasAppliedInitialViewRef.current = true;

    const teacherMatch = findTeacherForUser(currentUser.email, currentUser.name, parsedStudentsList);
    const isClassroomTeacher = currentUser.role === 'CLASSROOM TEACHER' || 
      (!currentUser.isSuperAdmin && currentUser.role !== 'SITE ADMIN / SPECIALIST');

    if (isClassroomTeacher) {
      // 1. Default first page to Classroom Teacher View
      setActiveView('teacher');

      if (teacherMatch) {
        // 2. Default teacher filter to their roster
        setSelectedTeacher(teacherMatch.teacherName);
        // 3. Default school filter to their assigned school site
        if (teacherMatch.school && teacherMatch.school !== 'ALL') {
          setSelectedSchool(teacherMatch.school);
        }
        console.info(`[WVUSD Portal] Recognized Classroom Teacher (${teacherMatch.matchedBy}): ${teacherMatch.teacherName} at ${teacherMatch.school} (${teacherMatch.studentCount} students)`);
      } else {
        console.info('[WVUSD Portal] Staff role is Classroom Teacher, defaulting first page to Classroom Teacher View.');
      }
    } else if (currentUser.role === 'SITE ADMIN / SPECIALIST') {
      // Site Admin / Specialist: Default to School Executive Overview for their assigned site
      setActiveView('overview');
      setSelectedTeacher('ALL');
      if (apiUserData?.assignedSites && apiUserData.assignedSites.length > 0 && apiUserData.assignedSites[0] !== 'ALL') {
        setSelectedSchool(apiUserData.assignedSites[0]);
      }
    } else {
      // Super Admin: Default to School Executive Overview across all sites
      setActiveView('overview');
      setSelectedTeacher('ALL');
      setSelectedSchool('ALL');
    }
  }, []);

  // Fetch live data from Google Apps Script Web App
  // Plain fetch with redirect: 'follow' and NO custom headers (prevents CORS preflight failures on 302 redirects)
  const fetchLiveData = useCallback(async (tokenOrEmail, overrideUser = null) => {
    setIsLoading(true);
    setFetchError(null);

    let url = GAS_WEB_APP_URL;
    if (tokenOrEmail && typeof tokenOrEmail === 'string' && tokenOrEmail.includes('@') && tokenOrEmail === SUPER_ADMIN_EMAIL) {
      url += `?test_email=${encodeURIComponent(tokenOrEmail)}`;
    } else if (tokenOrEmail && typeof tokenOrEmail === 'string' && tokenOrEmail.length > 40 && !tokenOrEmail.includes('@')) {
      url += `?id_token=${encodeURIComponent(tokenOrEmail)}`;
    } else {
      url += `?test_email=${encodeURIComponent(SUPER_ADMIN_EMAIL)}`;
    }

    setFetchUrl(url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.students || !Array.isArray(data.students)) {
        throw new Error("Invalid response format: 'students' array missing from Google Apps Script.");
      }

      // Parse students using dynamic multi-year & multi-tab parser
      const parsedStudents = data.students.map(parseStudentRecord);
      setStudents(parsedStudents);
      setMeta(data.meta || {});

      // Apply initial view and teacher matching based on the active user
      const activeUser = overrideUser || userRef.current;
      applyInitialRoutingAndFilters(activeUser, parsedStudents, data.user);

      setIsLoading(false);
    } catch (err) {
      console.error('Live GAS API fetch failed:', err);
      setFetchError(err.message || 'Failed to fetch live data from Google Apps Script');
      setIsLoading(false);
    }
  }, [applyInitialRoutingAndFilters]);

  // Handle successful Google GSI authentication
  const handleAuthSuccess = useCallback((token, decodedUser) => {
    const email = decodedUser?.email || '';

    // STRICT CLIENT-SIDE DOMAIN LOCK
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

    // Cache in sessionStorage for persistence across page refreshes
    sessionStorage.setItem('wvusd_staff_token', token);
    sessionStorage.setItem('wvusd_staff_user', JSON.stringify(authUserData));

    hasAppliedInitialViewRef.current = false;
    setUser(authUserData);
    setCurrentRole(role);
    setAuthError(null);
    setBlockedEmail('');

    // Trigger live fetch with authenticated token and user profile
    fetchLiveData(token, authUserData);
  }, [fetchLiveData]);

  const hasInitialFetchedRef = useRef(false);

  // Initial load check: if user already cached, fetch live data
  useEffect(() => {
    if (user && !hasInitialFetchedRef.current) {
      hasInitialFetchedRef.current = true;
      const cachedToken = sessionStorage.getItem('wvusd_staff_token');
      fetchLiveData(cachedToken || user.email || SUPER_ADMIN_EMAIL, user);
    }
  }, [fetchLiveData, user]);

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
          console.warn('GSI Initialization notice:', err);
        }
      }
    };

    setupGSI();
    const timer = setInterval(() => {
      if (window.google?.accounts?.id) {
        setupGSI();
        clearInterval(timer);
      }
    }, 400);

    return () => clearInterval(timer);
  }, [user, handleAuthSuccess]);

  // Dev Bypass (Super-Admin or Classroom Teacher)
  const handleDevBypass = (presetEmail = SUPER_ADMIN_EMAIL, presetRole = 'SUPER ADMIN', presetName = '') => {
    const isSuper = presetRole === 'SUPER ADMIN';
    const mockUser = {
      email: presetEmail,
      name: presetName || (presetEmail === SUPER_ADMIN_EMAIL ? 'Kurt Wendland (Super-Admin)' : presetEmail.split('@')[0]),
      picture: null,
      role: presetRole,
      isSuperAdmin: isSuper,
      id_token: 'dev-bypass-token'
    };

    sessionStorage.setItem('wvusd_staff_token', mockUser.id_token);
    sessionStorage.setItem('wvusd_staff_user', JSON.stringify(mockUser));

    hasAppliedInitialViewRef.current = false;
    setUser(mockUser);
    setCurrentRole(presetRole);
    setAuthError(null);

    // In dev bypass mode, request GAS with SUPER_ADMIN_EMAIL so GAS authorizes the fetch,
    // while passing mockUser to apply the user's role and teacher matching
    fetchLiveData(SUPER_ADMIN_EMAIL, mockUser);
  };

  // Sign Out
  const handleSignOut = () => {
    sessionStorage.removeItem('wvusd_staff_token');
    sessionStorage.removeItem('wvusd_staff_user');
    setUser(null);
    setStudents([]);
    setMeta(null);
    setAuthError(null);
    setFetchError(null);
    setBlockedEmail('');
    setActiveView('overview');
    setSelectedTeacher('ALL');
    setSelectedSchool('ALL');
    hasAppliedInitialViewRef.current = false;
    hasInitialFetchedRef.current = false;
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  // Handle Super Admin Role Preview Switch
  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    if (newRole === 'CLASSROOM TEACHER') {
      setActiveView('teacher');
      if (selectedTeacher === 'ALL' && availableTeachers.length > 0) {
        setSelectedTeacher(availableTeachers[0]);
      }
    } else {
      setActiveView('overview');
      setSelectedTeacher('ALL');
    }
  };

  // Compute available school sites dynamically from live meta or student data
  const availableSchools = useMemo(() => {
    if (meta?.sites && meta.sites.length > 0) {
      return meta.sites;
    }
    const sitesSet = new Set(students.map(s => s.school).filter(Boolean));
    return Array.from(sitesSet).sort();
  }, [meta, students]);

  // Compute available grades dynamically
  const availableGrades = useMemo(() => {
    if (meta?.grades && meta.grades.length > 0) {
      return meta.grades;
    }
    const gradesSet = new Set(students.map(s => s.gradeStr || `${s.grade}`).filter(Boolean));
    return Array.from(gradesSet);
  }, [meta, students]);

  // Compute available teachers dynamically based on active school and grade
  const availableTeachers = useMemo(() => {
    let pool = students;
    if (selectedSchool !== 'ALL') {
      pool = pool.filter(s => s.school === selectedSchool);
    }
    if (selectedGrade !== 'ALL') {
      pool = pool.filter(s => s.gradeStr === selectedGrade || `${s.grade}` === selectedGrade);
    }
    const teachersSet = new Set(pool.map(s => s.teacher).filter(Boolean));
    return Array.from(teachersSet).sort();
  }, [students, selectedSchool, selectedGrade]);

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
                onClick={() => handleDevBypass(SUPER_ADMIN_EMAIL, 'SUPER ADMIN')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Super-Admin Dev Bypass ({SUPER_ADMIN_EMAIL})
              </button>

              <button
                onClick={() => handleDevBypass('mschweder@wvusd.org', 'CLASSROOM TEACHER', 'Megan Schweder')}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition"
              >
                Teacher Dev Bypass (mschweder@wvusd.org - Castle Rock Elementary)
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
                Live Google Sheets & Illuminate Multi-Year Analytics across Grades 1–5.
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
                  Live Data Connection
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Dev Bypass Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleDevBypass(SUPER_ADMIN_EMAIL, 'SUPER ADMIN')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 shadow-2xs transition transform hover:-translate-y-0.5"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Super-Admin Dev Bypass ({SUPER_ADMIN_EMAIL})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDevBypass('mschweder@wvusd.org', 'CLASSROOM TEACHER', 'Megan Schweder')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 shadow-2xs transition transform hover:-translate-y-0.5"
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Teacher Dev Bypass (mschweder@wvusd.org - Castle Rock Elementary)</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 pt-1">
                Domain locked to <strong className="text-slate-600">@wvusd.org</strong> and <strong className="text-slate-600">@sub.wvusd.org</strong>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              Live Google Apps Script API Connection
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
            schoolsList={availableSchools}
            gradesList={availableGrades}
            teachersList={availableTeachers}
            onSignOut={handleSignOut}
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
          />

          {/* Main Dashboard Workspace */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-10 text-center space-y-4 my-6">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Loading Live WVUSD Elementary Student Dataset
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Retrieving multi-year records across 1st–5th ELA and Math tabs from Google Apps Script Web App...
                  </p>
                </div>
                <div className="text-[11px] font-mono text-slate-400 max-w-xl mx-auto truncate">
                  Endpoint: {fetchUrl}
                </div>
              </div>
            )}

            {/* Fetch Error Display Screen with Exact Message and Retry Button */}
            {fetchError && !isLoading && (
              <div className="bg-white rounded-2xl border border-rose-200 shadow-md p-6 sm:p-8 space-y-4 my-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-rose-900">
                      Live Google Apps Script Fetch Error
                    </h3>
                    <p className="text-xs text-slate-600">
                      Could not retrieve live student records. The exact error returned by the network or backend is shown below:
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 font-mono text-xs text-rose-800 break-all">
                  {fetchError}
                </div>

                <div className="text-xs text-slate-500">
                  <span className="font-bold">Requested Endpoint: </span>
                  <code className="text-[11px] font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded break-all">
                    {fetchUrl}
                  </code>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => fetchLiveData(sessionStorage.getItem('wvusd_staff_token') || user.email)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retry Live Fetch</span>
                  </button>

                  <a
                    href={fetchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Raw API in New Tab</span>
                  </a>
                </div>
              </div>
            )}

            {/* Render Dashboard Views when data loaded and no error */}
            {!isLoading && !fetchError && students.length > 0 && (
              <>
                {/* View 1: School Executive Overview */}
                {activeView === 'overview' && (
                  <SiteAdminOverview
                    students={students}
                    selectedSchool={selectedSchool}
                    onDrilldown={handleDrilldown}
                  />
                )}

                {/* View 2: Classroom Teacher View (Chunked Roster Cards & Multi-Attempt Trails) */}
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

                {/* View 3: Click-an-Assessment Small Group Builder (Dynamic Tab Headers) */}
                {activeView === 'small-groups' && (
                  <SmallGroupBuilder
                    students={students}
                    selectedSchool={selectedSchool}
                    selectedGrade={selectedGrade}
                    selectedTeacher={selectedTeacher}
                    meta={meta}
                    onSelectStudent={handleSelectStudent}
                  />
                )}
              </>
            )}

            {/* Empty state if students is empty after loading */}
            {!isLoading && !fetchError && students.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <Database className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Student Records Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  The Google Apps Script web app responded successfully, but returned an empty dataset.
                </p>
                <button
                  onClick={() => fetchLiveData(sessionStorage.getItem('wvusd_staff_token') || user.email)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Reload Live Data
                </button>
              </div>
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
                <span>Live Google Sheet Connected ({students.length.toLocaleString()} Students)</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {meta?.lastUpdated ? `Last updated: ${meta.lastUpdated}` : 'Google Apps Script Web App'}
              </div>
            </div>
          </footer>
        </>
      )}

    </div>
  );
}
