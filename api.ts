import { MistakeDetail } from '../../lib/types';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { useI18n } from "../../contexts/I18nContext";

interface MistakesTrackerProps {
  mistakes: MistakeDetail[];
}

export function MistakesTracker({ mistakes }: MistakesTrackerProps) {
  const { t } = useI18n();
  if (mistakes.length === 0) {
    return (
      <div className="rounded-card border border-ziad-line bg-ziad-panel p-12 text-center shadow-sm">
        <CheckCircle2 className="h-12 w-12 text-ziad-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold text-ziad-ink text-right">{t("noRecentMistakes")}</h3>
        <p className="mt-2 font-medium text-ziad-ink/72">{t("everythingLooksPerfect")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-ziad-line bg-ziad-panel shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ziad-light border-b border-ziad-line">
              <th className="px-6 py-4 text-xs font-bold uppercase text-ziad-ink/75 tracking-wider">Question</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-ziad-ink/75 tracking-wider">Child's Answer</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-ziad-ink/75 tracking-wider">{t("correctAnswer")}</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-ziad-ink/75 tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ziad-line">
            {mistakes.map((m, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2 max-w-md">
                    <span className="font-bold text-ziad-ink line-clamp-2">{m.questionText}</span>
                    {m.questionImageUrl && (
                      <img src={m.questionImageUrl} alt={t("altQuestionImage")} loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="h-12 w-fit rounded border border-ziad-line object-contain bg-white" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 w-fit px-3 py-1 rounded-full border border-red-100">
                    <XCircle className="h-4 w-4" />
                    <span>{m.selectedChoiceText}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-ziad-primary font-bold bg-ziad-light w-fit px-3 py-1 rounded-full border border-ziad-line">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{m.correctChoiceText}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-ziad-ink/72 text-sm font-medium whitespace-nowrap">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(m.date).toLocaleDateString()}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
