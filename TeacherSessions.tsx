import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getChildDashboardStats } from "../../lib/api-service";
import type { ParentDashboardData } from "../../lib/types";
import { DashboardDisplay } from "../../components/dashboard/DashboardDisplay";
import { useAuth } from "../../contexts/AuthContext";
import { useCourse } from "../../contexts/CourseContext";
import { useI18n } from "../../contexts/I18nContext";

export default function StudentParentDashboard() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { selectedCourse } = useCourse();
  const [dashboardData, setDashboardData] = useState<ParentDashboardData | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchStats = async () => {
      setDataLoading(true);
      try {
        const stats = await getChildDashboardStats(user.id, selectedCourse?.id || undefined);
        setDashboardData(stats);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setDashboardData(null);
      } finally {
        setDataLoading(false);
      }
    };
    fetchStats();
  }, [user?.id, selectedCourse?.id]);

  if (dataLoading && !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-ziad-primary" />
        <p className="text-ziad-ink/72 font-semibold">{t("updatingDataForChild")}</p>
      </div>
    );
  }

  return <DashboardDisplay data={dashboardData!} dataLoading={dataLoading} />;
}
