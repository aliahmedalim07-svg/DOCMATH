import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { getCourses, getCourse, type AdminCourse, type BackendCourseDetail } from "../lib/api-service";
import { useOptionalAuth } from "./AuthContext";

interface CourseContextValue {
  selectedCourse: AdminCourse | null;
  courses: AdminCourse[];
  setSelectedCourse: (course: AdminCourse | null) => Promise<void>;
  setCourses: (courses: AdminCourse[]) => void;
  deadline: string | null;
  isCourseEnded: boolean;
  loading: boolean;
  courseDetails: BackendCourseDetail | null;
}

const CourseContext = createContext<CourseContextValue | undefined>(undefined);
const selectedCourseKey = "dr-ziad-math-ig-selected-course";

export function CourseProvider({ children }: { children: ReactNode }) {
  const auth = useOptionalAuth();
  const user = auth?.user;
  const authLoading = auth?.loading ?? false;
  const hasAuthProvider = Boolean(auth);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [selectedCourse, setSelectedCourseState] = useState<AdminCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [courseDetails, setCourseDetails] = useState<BackendCourseDetail | null>(null);

  const setSelectedCourse = useCallback(async (course: AdminCourse | null) => {
    setSelectedCourseState(course);
    if (course) {
      localStorage.setItem(selectedCourseKey, course.id);
      const details = await getCourse(Number(course.id));
      setCourseDetails(details);
    } else {
      localStorage.removeItem(selectedCourseKey);
      setCourseDetails(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (authLoading) return;

      if (hasAuthProvider && !user) {
        setCourses([]);
        setSelectedCourseState(null);
        setCourseDetails(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getCourses();
        if (cancelled) return;
        setCourses(data);

        const storedId = localStorage.getItem(selectedCourseKey);
        let initialCourse: AdminCourse | null = null;

        if (storedId) {
          const found = data.find(c => c.id === storedId);
          if (found) {
            initialCourse = found;
          } else if (data.length > 0) {
            initialCourse = data[0];
          }
        } else if (data.length > 0) {
          initialCourse = data[0];
        }

        if (initialCourse) {
          setSelectedCourseState(initialCourse);
          try {
            const details = await getCourse(Number(initialCourse.id));
            if (!cancelled) setCourseDetails(details);
          } catch {
            // course details fetch failed — proceed with basic info
          }
        }
      } catch {
        // courses fetch failed — keep empty state
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();

    return () => { cancelled = true; };
  }, [authLoading, hasAuthProvider, user?.id]);

  const deadline = courseDetails?.deadline ?? selectedCourse?.examDate ?? null;
  const today = new Date().toISOString().split("T")[0];
  const isCourseEnded = deadline ? deadline < today : false;

  return (
    <CourseContext.Provider value={{
      selectedCourse,
      courses,
      setSelectedCourse,
      setCourses,
      deadline,
      isCourseEnded,
      loading,
      courseDetails,
    }}>
      {children}
    </CourseContext.Provider>
  );
}

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) throw new Error("useCourse must be used inside CourseProvider");
  return context;
};
