import { GeneralProgress } from '../../lib/types';
import { DashboardCard } from './DashboardCard';
import { Target, CheckCircle, Trophy, TrendingUp } from 'lucide-react';
import { to800 } from '../../lib/utils';
import { useI18n } from "../../contexts/I18nContext";

interface ChildDashboardViewProps {
  progress: GeneralProgress;
}

export function ChildDashboardView({ progress }: ChildDashboardViewProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          label={t("score")}
          value={`${to800(progress.averageScore)}/800`} 
          icon={Target} 
          tone="blue"
          helper={t("overallPerformance")}
        />
        <DashboardCard 
          label={t("booksProgress")}
          value={`${progress.completedAssignments}/${progress.totalAssignments}`} 
          icon={CheckCircle} 
          tone="green"
          helper={t("completedAssignments")}
        />
        <DashboardCard 
          label={t("completionRate")} 
          value={`${progress.totalAssignments > 0 ? Math.round((progress.completedAssignments / progress.totalAssignments) * 100) : 0}%`} 
          icon={TrendingUp} 
          tone="amber"
          helper={t("engagementLevel")}
        />
        <DashboardCard 
          label={t("studentRankLabel")} 
          value={progress.studentRank > 0 ? `#${progress.studentRank}` : t("unranked")} 
          icon={Trophy} 
          tone={progress.studentRank === 1 ? "green" : progress.studentRank > 0 ? "blue" : "amber"}
          helper={progress.rankedStudents > 0 ? t("outOfRankedStudents").replace("{count}", String(progress.rankedStudents)) : t("noScoredAttemptsYet")}
        />
      </div>
    </div>
  );
}
