/**
 * Features/FSD: resumo rápido de métricas principais da atividade física.
 */
import type { ActivityTotals } from "@/features/activity/lib/activityCalculations";
import { formatCalories, formatDistance, formatDuration } from "@/shared/lib/format";

interface ActivitySummaryCardsProps {
  totals: ActivityTotals;
  totalActivities: number;
}

export const ActivitySummaryCards = ({ totals, totalActivities }: ActivitySummaryCardsProps) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">Atividades</p>
      <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{totalActivities}</p>
    </article>
    <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">Calorias</p>
      <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {formatCalories(totals.totalCalories)}
      </p>
    </article>
    <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">Tempo total</p>
      <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {formatDuration(totals.totalDurationMinutes)}
      </p>
    </article>
    <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">Distância</p>
      <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {formatDistance(totals.totalDistanceKm)}
      </p>
    </article>
  </div>
);
