import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  BarChart3,
  Bookmark,
  BookOpen,
  ChevronDown,
  ClipboardCheck,
  FileQuestion,
  Files,
  GraduationCap,
  HelpCircle,
  Home,
  Languages,
  LibraryBig,
  LogOut,

  Settings2,
  Shield,
  ShieldQuestion,
  Target,
  Users,
  Video,
  LayoutDashboard,
} from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useI18n, type TranslationKey } from "../contexts/I18nContext";
import { useCourse } from "../contexts/CourseContext";
import type { Role } from "../lib/types";
import { CONFIG } from "../lib/config";
import { cn, initials } from "../lib/utils";
import { NoRolesBanner } from "./AccountExpiryBanner";

const navByRole: Record<Role, { label: TranslationKey; path: string; icon: any }[]> = {
  student: [
    { label: "dashboard", path: "/student/dashboard", icon: Home },
    { label: "books", path: "/student/books", icon: BookOpen },
    { label: "assignments", path: "/student/assignments", icon: ClipboardCheck },
    { label: "skills", path: "/student/skills", icon: Target },
    { label: "weakPoints", path: "/student/weak-points", icon: ShieldQuestion },
    { label: "checkpoint", path: "/student/checkpoint", icon: BarChart3 },
    { label: "sessions", path: "/student/sessions", icon: Video },
    { label: "mistakes", path: "/student/mistake-history", icon: FileQuestion },
    { label: "studentParentDashboard", path: "/student/parent-dashboard", icon: LayoutDashboard },
  ],
  admin: [
    { label: "dashboard", path: "/teacher/dashboard", icon: Home },
    { label: "students", path: "/teacher/students", icon: Users },
    { label: "parents", path: "/teacher/parents", icon: Users },
    { label: "admins", path: "/teacher/admins", icon: Shield },
    { label: "courses", path: "/teacher/courses", icon: GraduationCap },
    { label: "books", path: "/teacher/books", icon: LibraryBig },
    { label: "questions", path: "/teacher/questions", icon: HelpCircle },
    { label: "topics", path: "/teacher/topics", icon: Bookmark },
    { label: "assignmentsAndSkills", path: "/teacher/assignments", icon: ClipboardCheck },
    { label: "resources", path: "/teacher/resources", icon: Files },
    { label: "sessions", path: "/teacher/sessions", icon: Video },
    { label: "registerUser", path: "/teacher/register-user", icon: Settings2 },
  ],
  parent: [
    { label: "dashboard", path: "/parent/dashboard", icon: LayoutDashboard },
  ],
};

function ShellNav({ role, mobile = false }: { role: Role; mobile?: boolean }) {
  const { t } = useI18n();
  const configRole = role === "admin" ? "teacher" : role;
  const rolePages = CONFIG.features.pages[configRole as keyof typeof CONFIG.features.pages];
  const nav = navByRole[role].filter((item) => {
    const pageKey = item.path.split("/").pop()!;
    if (!rolePages) return true;
    return (rolePages as Record<string, boolean | undefined>)[pageKey] !== false;
  });

  return (
    <nav
      className={cn(
        mobile
          ? "flex gap-1 overflow-x-auto px-2 py-2"
          : "mt-8 flex flex-1 flex-col gap-1 px-3",
      )}
      aria-label={t("roleNavigation").replace("{role}", role)}
    >
      {nav.map((item) => (
        <NavButton key={item.path} item={item} mobile={mobile} />
      ))}
    </nav>
  );
}

function NavButton({ item, mobile }: { item: any; mobile: boolean }) {
  const { t } = useI18n();
  return (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) =>
        cn(
          "group inline-flex items-center gap-3 rounded-button text-sm font-bold transition",
          mobile
            ? "min-w-[86px] flex-col justify-center px-2 py-2 text-[11px]"
            : "px-3 py-2.5",
          isActive
            ? mobile
              ? "bg-ziad-primary text-ziad-light"
              : "bg-ziad-light text-ziad-ink shadow-sm"
            : mobile
              ? "text-ziad-ink/70 hover:bg-ziad-light"
              : "text-ziad-light/82 hover:bg-ziad-light/12 hover:text-ziad-light",
        )
      }
    >
      <item.icon className={cn("h-5 w-5", mobile ? "h-4 w-4" : "")} />
      <span>{t(item.label)}</span>
    </NavLink>
  );
}

export function AppShell({ role }: { role: Role }) {
  const { user, roles, signOut } = useAuth();
  const { t, language, toggleLanguage } = useI18n();
  const { selectedCourse, courses, setSelectedCourse, isCourseEnded, loading } = useCourse();
  const hasRoles = roles.length > 0;
  const hasNoCourses = role === "student" && !loading && courses.length === 0;

  if (!user) return null;

  return (
    <div className={cn("min-h-screen", !hasNoCourses && "lg:grid lg:grid-cols-[280px_1fr]")}>
      {!hasNoCourses && (
        <aside className="sticky top-0 hidden h-screen bg-ziad-primary text-ziad-light lg:flex lg:flex-col">
          <div className="px-5 pt-5">
            <Link to="/" className="flex items-center gap-3 rounded-card outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ziad-light/60">
              <img src="/logo_no_bg@149w.png" alt={t("altLogo")} width="149" height="56" className="h-14 w-[149px] rounded-card bg-white shadow-soft" />
              <span className="text-base font-extrabold text-ziad-light">{t("appName")}</span>
            </Link>
          </div>
          <ShellNav role={role} />
          <div className="border-t border-ziad-light/16 p-4">
            <div className="flex items-center gap-3 rounded-card bg-ziad-light/10 p-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-ziad-light text-sm font-extrabold text-ziad-primary">
                {initials(user.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold">{user.name}</p>
              </div>
            </div>
          </div>
        </aside>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-ziad-line bg-ziad-panel/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3 lg:hidden">
              <Link to="/" className="flex min-w-0 items-center gap-3 rounded-card outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ziad-primary/40">
                <img src="/square_logo.png" alt={t("altLogo")} width="40" height="40" className="h-10 w-auto rounded-card" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-ziad-ink">{t("appName")}</p>
                  <p className="truncate text-xs text-ziad-ink/75">{user.name}</p>
                </div>
              </Link>
            </div>
            <div className="hidden min-w-0 lg:block">
              <p className="text-xs font-bold uppercase text-ziad-ink/75">{t(role as any)}</p>
              <h2 className="text-base font-extrabold text-ziad-ink">{t("welcomeBackName").replace("{name}", user.name)}</h2>
            </div>
            <div className="ms-auto flex items-center gap-2">
              {role !== "admin" && role !== "parent" && user && !loading && courses.length > 0 && (
                <CourseSelector
                  courses={courses}
                  selectedCourse={selectedCourse}
                  onSelectCourse={(course) => { void setSelectedCourse(course); }}
                  t={t as (key: string) => string}
                />
              )}
              {role !== "admin" && role !== "parent" && user && !loading && courses.length === 0 && (
                <div className="rounded-button border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                  {t("noCoursesContactAdmin")}
                </div>
              )}
              <button
                type="button"
                onClick={toggleLanguage}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-button border border-ziad-line bg-ziad-panel px-3 text-sm font-bold text-ziad-ink transition hover:bg-ziad-light"
                aria-label={`${t("toggleLanguageLabel")} — ${language === "en" ? t("languageAr") : t("languageEn")}`}
              >
                <Languages className="h-4 w-4" aria-hidden="true" />
                {language === "en" ? t("languageAr") : t("languageEn")}
              </button>
              <button
                type="button"
                onClick={() => void signOut()}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-button border border-ziad-line bg-ziad-panel px-3 text-sm font-bold text-ziad-ink transition hover:bg-ziad-light"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t("logout")}</span>
              </button>
            </div>
          </div>
        </header>

        <main className="page-scroll safe-bottom min-h-[calc(100vh-4rem)] px-4 py-5 sm:px-6 lg:px-8 lg:pb-8">
          {!hasRoles ? <NoRolesBanner /> : role === "student" && !loading && courses.length === 0 ? (
            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="rounded-card border border-amber-300 bg-amber-50 px-8 py-6 text-center shadow-sm">
                <p className="text-lg font-bold text-amber-800">{t("accountNotActivated")}</p>
              </div>
            </div>
          ) : (
            <>
              {role === "student" && isCourseEnded && selectedCourse && (
                <div className="mb-5 flex flex-col gap-3 rounded-card border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span>📅</span>
                    <p className="text-sm font-semibold">
                      {t("courseEndedOn").replace("{course}", selectedCourse.name).replace("{date}", new Date(selectedCourse.examDate).toLocaleDateString())}
                    </p>
                  </div>
                </div>
              )}
              <Outlet />
            </>
          )}
        </main>
      </div>

      {!hasNoCourses && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ziad-line bg-ziad-panel/98 shadow-[0_-10px_35px_rgba(33,71,35,0.12)] backdrop-blur lg:hidden">
          <ShellNav role={role} mobile />
        </div>
      )}
    </div>
  );
}

function CourseSelector({ courses, selectedCourse, onSelectCourse, t }: {
  courses: import("../lib/api-service").AdminCourse[];
  selectedCourse: import("../lib/api-service").AdminCourse | null;
  onSelectCourse: (course: import("../lib/api-service").AdminCourse) => void;
  t: (key: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="inline-flex h-10 items-center gap-2 rounded-button border border-ziad-line bg-ziad-panel px-3 text-sm font-bold text-ziad-ink transition hover:bg-ziad-light"
      >
        <GraduationCap className="h-4 w-4" />
        <span className="max-w-[120px] truncate">{selectedCourse?.name || t("courses")}</span>
        <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-card border border-ziad-line bg-ziad-panel shadow-lift">
          <div className="py-1">
            {courses.map(course => (
              <button
                key={course.id}
                onClick={() => { onSelectCourse(course); setOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm transition",
                  course.id === selectedCourse?.id
                    ? "bg-ziad-primary text-white"
                    : "text-ziad-ink hover:bg-ziad-light"
                )}
              >
                <GraduationCap className="h-4 w-4" />
                <span className="truncate">{course.name}</span>
                {!course.isActive && <span className="ml-auto text-xs">📅</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
