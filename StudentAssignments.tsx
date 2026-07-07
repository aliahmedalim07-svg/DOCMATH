import { useEffect, useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { getChildDashboardStats } from "../../lib/api-service";
import type { ParentDashboardData } from "../../lib/types";
import { WeakPointsGallery } from "../../components/dashboard/WeakPointsGallery";
import { useParentDashboard } from "./ParentDashboardLayout";
import { useI18n } from "../../contexts/I18nContext";

export default function ParentWeakPoints() {
  const { t } = useI18n();
  const { selectedChildId, selectedCourseId } = useParentDashboard();
  const [dashboardData, setDashboardData] = useState<ParentDashboardData | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!selectedChildId) return;

    const fetchStats = async () => {
      setDataLoading(true);
      try {
        const stats = await getChildDashboardStats(selectedChildId, selectedCourseId || undefined);
        setDashboardData(stats);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setDashboardData(null);
      } finally {
        setDataLoading(false);
      }
    };
    fetchStats();
  }, [selectedChildId, selectedCourseId]);

  if (dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-ziad-primary" />
        <p className="text-ziad-ink/72 font-semibold">{t("updatingDataForChild")}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
        <AlertTriangle className="h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-800">{t("noDataAvailablePeriod")}</h3>
        <p className="text-ziad-ink/70 max-w-sm font-medium">{t("couldNotRetrieveStats")}</p>
      </div>
    );
  }

  return <WeakPointsGallery weakPoints={dashboardData.weakPoints} />;
}
