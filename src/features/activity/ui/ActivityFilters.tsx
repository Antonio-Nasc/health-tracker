/**
 * Features/FSD: bloco visual de filtros por categoria e intervalo de datas.
 */
import {
  ACTIVITY_CATEGORIES,
  type ActivityFilters as ActivityFiltersModel,
  type Category,
} from "@/entities/activity/model/activityTypes";
import { Button } from "@/shared/ui/Button";

interface ActivityFiltersProps {
  filters: ActivityFiltersModel;
  onCategoryChange: (category: Category | "all") => void;
  onDateRangeChange: (fromDate: string | null, toDate: string | null) => void;
  onClear: () => void;
}

export const ActivityFilters = ({
  filters,
  onCategoryChange,
  onDateRangeChange,
  onClear,
}: ActivityFiltersProps) => (
  <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end">
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Categoria</span>
      <select
        className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        value={filters.category}
        onChange={(event) => onCategoryChange(event.target.value as Category | "all")}
      >
        <option value="all">Todas</option>
        {ACTIVITY_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </label>

    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Data inicial</span>
      <input
        type="date"
        className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        value={filters.fromDate ?? ""}
        onChange={(event) => onDateRangeChange(event.target.value || null, filters.toDate ?? null)}
      />
    </label>

    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Data final</span>
      <input
        type="date"
        className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        value={filters.toDate ?? ""}
        onChange={(event) =>
          onDateRangeChange(filters.fromDate ?? null, event.target.value || null)
        }
      />
    </label>

    <Button variant="ghost" onClick={onClear}>
      Limpar filtros
    </Button>
  </div>
);
