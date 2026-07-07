import { WeakPointDetail } from '../../lib/types';
import { AlertTriangle, TrendingDown, Target } from 'lucide-react';
import { useI18n } from "../../contexts/I18nContext";

interface WeakPointsGalleryProps {
  weakPoints: WeakPointDetail[];
}

export function WeakPointsGallery({ weakPoints }: WeakPointsGalleryProps) {
  const { t } = useI18n();
  const filteredWeakPoints = weakPoints.filter((wp) => wp.mistakeCount > 0 || wp.accuracy < 70);
  if (filteredWeakPoints.length === 0) {
    return (
      <div className="rounded-card border border-ziad-line bg-ziad-panel p-12 text-center shadow-sm">
        <div className="mx-auto w-16 h-16 bg-ziad-light rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-ziad-primary" />
        </div>
        <h3 className="text-xl font-bold text-ziad-ink">{t("noWeakPointsDetected")}</h3>
        <p className="mt-2 text-ziad-ink/72 max-w-md mx-auto font-medium">{t("greatJobAllGood")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredWeakPoints.map((wp, idx) => (
        <div
          key={idx} 
          className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase text-ziad-primary">{t("weakPointsNeedsReview")}</p>
              <h3 className="text-xl font-extrabold text-ziad-ink">{wp.categoryName}</h3>
            </div>
            <div className={`rounded-button border p-3 ${wp.accuracy < 50 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
              <TrendingDown className="h-6 w-6" />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Target className="h-3 w-3 text-ziad-primary/70" />
                  <p className="text-xs font-black uppercase text-ziad-ink/70 tracking-wider">{t("currentAccuracy")}</p>
                </div>
                <p className={`text-4xl font-black tracking-tighter ${wp.accuracy < 50 ? 'text-red-600' : 'text-amber-600'}`}>
                  {Math.round(wp.accuracy)}<span className="text-lg opacity-75">%</span>
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs font-black uppercase text-ziad-ink/70 tracking-wider">{t("mistakesCount")}</p>
                <p className="text-2xl font-black text-ziad-ink">{wp.mistakeCount}</p>
              </div>
            </div>

            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
              <div 
                className={`h-full transition-[width] duration-300 ${wp.accuracy < 50 ? 'bg-red-600' : 'bg-amber-500'}`}
                style={{ width: `${wp.accuracy}%` }}
              />
            </div>
            <p className="border-t border-ziad-line pt-4 text-sm font-bold text-ziad-ink/72">{t("reviewSuggestedQuestions")}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
