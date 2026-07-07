import { lazy, Suspense, useState, type ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { CanonicalUrl } from "./components/CanonicalUrl";
import { MascotLoader } from "./components/MascotLoader";
import { PageTransition } from "./components/PageTransition";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SplashScreen } from "./components/SplashScreen";
import { useAuth } from "./contexts/AuthContext";
import { CourseProvider } from "./contexts/CourseContext";
import { CONFIG } from "./lib/config";
import { dashboardPathForAccess } from "./lib/utils";

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));

function enabled(flag: unknown): boolean {
  return flag !== false;
}
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const HomePage = lazy(() => import("./pages/public/HomePage"));
const AboutPage = lazy(() => import("./pages/public/AboutPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/public/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/public/TermsOfServicePage"));

const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const StudentCourses = lazy(() => import("./pages/student/StudentCourses"));
const StudentBooks = lazy(() => import("./pages/student/StudentBooks"));
const StudentAssignments = lazy(() => import("./pages/student/StudentAssignments"));
const AssignmentPractice = lazy(() => import("./pages/student/AssignmentPractice"));
const StudentSkills = lazy(() => import("./pages/student/StudentSkills"));
const SkillPractice = lazy(() => import("./pages/student/SkillPractice"));
const WeeklyExamPractice = lazy(() => import("./pages/student/WeeklyExamPractice"));
const WeakPoints = lazy(() => import("./pages/student/WeakPoints"));
const MistakeHistory = lazy(() => import("./pages/student/MistakeHistory"));
const StudentParentDashboard = lazy(() => import("./pages/student/StudentParentDashboard"));
const Checkpoint = lazy(() => import("./pages/student/Checkpoint"));
const Sessions = lazy(() => import("./pages/student/Sessions"));

const TeacherDashboard = lazy(() => import("./pages/teacher/TeacherDashboard"));
const TeacherStudents = lazy(() => import("./pages/teacher/TeacherStudents"));
const TeacherStudentDetail = lazy(() => import("./pages/teacher/TeacherStudentDetail"));
const TeacherParents = lazy(() => import("./pages/teacher/TeacherParents"));
const TeacherAdmins = lazy(() => import("./pages/teacher/TeacherAdmins"));
const TeacherCourses = lazy(() => import("./pages/teacher/TeacherCourses"));
const TeacherBooks = lazy(() => import("./pages/teacher/TeacherBooks"));
const TeacherQuestions = lazy(() => import("./pages/teacher/TeacherQuestions"));
const TeacherAssignments = lazy(() => import("./pages/teacher/TeacherAssignments"));
const TeacherResources = lazy(() => import("./pages/teacher/TeacherResources"));
const RegisterUser = lazy(() => import("./pages/teacher/RegisterUser"));
const TeacherSessions = lazy(() => import("./pages/teacher/TeacherSessions"));
const TeacherTopics = lazy(() => import("./pages/teacher/TeacherTopics"));
const ParentDashboard = lazy(() => import("./pages/parent/ParentDashboard"));
const ParentDashboardLayout = lazy(() => import("./pages/parent/ParentDashboardLayout"));



function page(element: ReactElement) {
  return (
    <Suspense fallback={<MascotLoader />}>
      <PageTransition>{element}</PageTransition>
    </Suspense>
  );
}

function authPage(element: ReactElement) {
  return <Suspense fallback={<MascotLoader />}>{element}</Suspense>;
}

function RootRedirect() {
  const { user, roles, loading } = useAuth();
  if (loading) return <MascotLoader />;
  return <Navigate to={user ? dashboardPathForAccess(user.accountType, roles) : "/login"} replace />;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <CourseProvider>
      <CanonicalUrl />
      <Routes>
        {enabled(CONFIG.features.pages.public?.home) && (
          <Route path="/" element={authPage(<HomePage />)} />
        )}
        {enabled(CONFIG.features.pages.public?.about) && (
          <Route path="/about" element={authPage(<AboutPage />)} />
        )}
        {enabled(CONFIG.features.pages.public?.privacy) && (
          <Route path="/privacy" element={authPage(<PrivacyPolicyPage />)} />
        )}
        {enabled(CONFIG.features.pages.public?.terms) && (
          <Route path="/terms" element={authPage(<TermsOfServicePage />)} />
        )}
        <Route path="/home" element={<RootRedirect />} />
        <Route path="/login" element={authPage(<LoginPage />)} />
        <Route path="/register" element={authPage(<RegisterPage />)} />

        <Route element={<ProtectedRoute role="student" />}>
          <Route path="/student/assignments/:assignmentId/practice" element={page(<AssignmentPractice />)} />
          <Route path="/student/skills/:skillId/practice" element={page(<SkillPractice />)} />
          <Route path="/student/weekly-exams/:examId/practice" element={page(<WeeklyExamPractice />)} />

          <Route path="/student" element={<AppShell role="student" />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={page(<StudentDashboard />)} />
            <Route path="courses" element={page(<StudentCourses />)} />
            <Route path="books" element={page(<StudentBooks />)} />
            <Route path="assignments" element={page(<StudentAssignments />)} />
            <Route path="skills" element={page(<StudentSkills />)} />
            <Route path="parent-dashboard" element={page(<StudentParentDashboard />)} />
            <Route path="weak-points" element={page(<WeakPoints />)} />
            <Route path="mistake-history" element={page(<MistakeHistory />)} />
            <Route path="checkpoint" element={page(<Checkpoint />)} />
            <Route path="weekly-exams" element={page(<Checkpoint />)} />
            <Route path="sessions" element={page(<Sessions />)} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route element={<AppShell role="admin" />}>
            <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="/teacher/dashboard" element={page(<TeacherDashboard />)} />
            <Route path="/teacher/students" element={page(<TeacherStudents />)} />
            <Route path="/teacher/students/:studentId" element={page(<TeacherStudentDetail />)} />
            <Route path="/teacher/parents" element={page(<TeacherParents />)} />
            <Route path="/teacher/admins" element={page(<TeacherAdmins />)} />
            <Route path="/teacher/courses" element={page(<TeacherCourses />)} />
            <Route path="/teacher/books" element={page(<TeacherBooks />)} />
            <Route path="/teacher/questions" element={page(<TeacherQuestions />)} />
            <Route path="/teacher/assignments" element={page(<TeacherAssignments />)} />
            <Route path="/teacher/resources" element={page(<TeacherResources />)} />
            <Route path="/teacher/sessions" element={page(<TeacherSessions />)} />
            <Route path="/teacher/topics" element={page(<TeacherTopics />)} />
            <Route path="/teacher/register-user" element={page(<RegisterUser />)} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute role="parent" />}>
          <Route path="/parent" element={<AppShell role="parent" />}>
            <Route index element={<Navigate to="/parent/dashboard" replace />} />
            <Route element={page(<ParentDashboardLayout />)}>
              <Route path="dashboard" element={page(<ParentDashboard />)} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CourseProvider>
  );
}
