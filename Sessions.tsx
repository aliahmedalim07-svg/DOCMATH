import { useEffect, useState } from "react";
import { ChevronDown, GraduationCap, Loader2, Users } from "lucide-react";
import { getMyChildren, getCourses, type AdminCourse } from "../../lib/api-service";
import type { ParentChild } from "../../lib/types";
import { Outlet, useOutletContext } from "react-router-dom";
import { useI18n } from "../../contexts/I18nContext";

export interface ParentContextType {
  selectedChildId: string;
  children: ParentChild[];
  selectedCourseId: string;
  courses: AdminCourse[];
}

export default function ParentDashboardLayout() {
  const { t } = useI18n();
  const [children, setChildren] = useState<ParentChild[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const childrenData = await getMyChildren();
        setChildren(childrenData);
        if (childrenData.length > 0) {
          setSelectedChildId(childrenData[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch children:", error);
      }
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-ziad-primary" />
        <p className="text-ziad-ink/72 font-semibold animate-pulse">{t("loadingFamilyDashboard")}</p>
      </div>
    );
  }


  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20">
      <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase text-ziad-primary">{t("parentDashboard")}</p>
            <h1 className="text-3xl font-extrabold text-ziad-ink">{t("familyProgress")}</h1>
            <p className="max-w-2xl text-sm leading-6 text-ziad-ink/62">
              {t("trackScoresWeakPoints")}
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-card border border-ziad-line bg-ziad-light/45 p-3">
            <div className="grid h-11 w-11 place-items-center rounded-button bg-ziad-panel text-ziad-primary shadow-sm">
              <Users className="h-5 w-5" />
            </div>
            <div className="relative min-w-[180px]">
              <p className="text-xs font-bold uppercase text-ziad-ink/72">{t("activeStudent")}</p>
              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="mt-1 w-full appearance-none bg-transparent py-1 pr-9 text-base font-extrabold text-ziad-ink outline-none"
              >
                {children.map((child) => (
                  <option key={child.id} value={child.id} className="text-ziad-ink font-bold">
                    {child.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 bottom-1.5 h-5 w-5 text-ziad-primary" />
            </div>

            <div className="h-8 w-px bg-ziad-line" />

            <div className="grid h-11 w-11 place-items-center rounded-button bg-ziad-panel text-ziad-primary shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="relative min-w-[180px]">
              <p className="text-xs font-bold uppercase text-ziad-ink/72">{t("courses")}</p>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="mt-1 w-full appearance-none bg-transparent py-1 pr-9 text-base font-extrabold text-ziad-ink outline-none"
              >
                <option value="" className="text-ziad-ink/72">{t("allCourses")}</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id} className="text-ziad-ink font-bold">
                    {course.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 bottom-1.5 h-5 w-5 text-ziad-primary" />
            </div>
          </div>
        </div>
      </section>

      <Outlet context={{ selectedChildId, children, selectedCourseId, courses } as ParentContextType} />
    </div>
  );
}

export function useParentDashboard() {
  return useOutletContext<ParentContextType>();
}
