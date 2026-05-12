/**
 * Features/FSD: lista de atividades com ações de edição e exclusão.
 */
import Link from "next/link";

import type { Activity } from "@/entities/activity/model/activityTypes";
import { formatCalories, formatDistance, formatDuration } from "@/shared/lib/format";
import { Button } from "@/shared/ui/Button";

interface ActivityListProps {
  activities: Activity[];
  deletingId?: string | null;
  emptyMessage?: string;
  onDelete: (id: string) => void;
}

export const ActivityList = ({
  activities,
  deletingId = null,
  emptyMessage = "Nenhuma atividade encontrada para os filtros aplicados.",
  onDelete,
}: ActivityListProps) => {
  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {activities.map((activity) => (
        <li
          key={activity.id}
          className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {activity.title}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {activity.category} • {activity.date}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {formatCalories(activity.calories)} • {formatDuration(activity.durationMinutes)} •{" "}
                {formatDistance(activity.distanceKm)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href={`/activities/${activity.id}`}>
                <Button variant="secondary">Editar</Button>
              </Link>
              <Button
                variant="danger"
                isLoading={deletingId === activity.id}
                onClick={() => onDelete(activity.id)}
              >
                Excluir
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
