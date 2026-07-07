import { useEffect, useState } from "react";
import { Loader2, X, TrendingUp, Users } from "lucide-react";
import { getAverageScoreTrendByCourse, getStudentsByCourse, type AverageScoreTrendDto, type StudentCourseDto } from "../../lib/api-service";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CourseAnalyticsModalProps {
  courseId: number;
  courseName: string;
  onClose: () => void;
}

export function CourseAnalyticsModal({ courseId, courseName, onClose }: CourseAnalyticsModalProps) {
  const [loading, setLoading] = useState(true);
  const [trend, setTrend] = useState<AverageScoreTrendDto[]>([]);
  const [students, setStudents] = useState<StudentCourseDto[]>([]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      getAverageScoreTrendByCourse(courseId),
      getStudentsByCourse(courseId)
    ]).then(([trendData, studentsData]) => {
      if (active) {
        setTrend(trendData);
        setStudents(studentsData);
        setLoading(false);
      }
    }).catch(console.error);

    return () => { active = false; };
  }, [courseId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ziad-ink/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-card border border-ziad-line bg-ziad-panel shadow-soft">
        <div className="flex items-center justify-between border-b border-ziad-line bg-ziad-light/30 px-6 py-4">
          <div>
            <h2 className="text-xl font-extrabold text-ziad-ink">{courseName} - Analytics</h2>
            <p className="text-xs font-bold uppercase text-ziad-primary">Performance & Enrollment</p>
          </div>
          <button onClick={onClose} className="rounded-button p-2 text-ziad-ink hover:bg-ziad-line">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-ziad-primary" />
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-card border border-ziad-line bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-ziad-primary" />
                  <h3 className="text-lg font-extrabold text-ziad-ink">Average Score Trend</h3>
                </div>
                <div className="h-64">
                  {trend.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey="averageScore" stroke="#0f766e" strokeWidth={3} dot={{ r: 4, fill: "#0f766e", strokeWidth: 2, stroke: "#f7fafc" }} />
                        <CartesianGrid stroke="#E1E7ED" strokeDasharray="4 4" vertical={false} />
                        <XAxis dataKey="date" tick={{ fill: "#39495c", fontSize: 12 }} />
                        <YAxis domain={[0, 100]} tick={{ fill: "#39495c", fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E1E7ED" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-button border border-dashed border-ziad-line bg-ziad-light/30 text-sm font-bold text-ziad-ink/75">
                      No attempts recorded yet
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-card border border-ziad-line bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-ziad-primary" />
                  <h3 className="text-lg font-extrabold text-ziad-ink">Enrolled Students ({students.length})</h3>
                </div>
                <div className="h-64 overflow-y-auto">
                  {students.length > 0 ? (
                    <div className="divide-y divide-ziad-line border-t border-ziad-line">
                      {students.map(s => (
                        <div key={s.id} className="py-3">
                          <p className="text-sm font-extrabold text-ziad-ink">{s.name}</p>
                          <p className="text-xs font-semibold text-ziad-ink/72">Phone: {s.phoneNumber || "N/A"}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-button border border-dashed border-ziad-line bg-ziad-light/30 text-sm font-bold text-ziad-ink/75">
                      No students enrolled
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
