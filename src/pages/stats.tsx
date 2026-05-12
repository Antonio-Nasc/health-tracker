/**
 * Pages/FSD: página de estatísticas semanais/mensais com gráficos e filtros.
 * Estratégia Next.js: SSG + ISR para shell; dados de atividade continuam client-side.
 */
import dynamic from "next/dynamic";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";

import { useHealthStore } from "@/app/store/healthStore";
import { useActivities } from "@/features/activity/api/useActivityQueries";
import { buildTrendData, calculateTotals } from "@/features/activity/lib/activityCalculations";
import { ActivityFilters } from "@/features/activity/ui/ActivityFilters";
import { Button } from "@/shared/ui/Button";

const ActivityTrendChart = dynamic(
  () =>
    import("@/features/activity/ui/ActivityTrendChart").then((module) => module.ActivityTrendChart),
  { ssr: false },
);

interface StatsPageProps {
  generatedAt: string;
}

export const getStaticProps: GetStaticProps<StatsPageProps> = async () => ({
  props: {
    generatedAt: new Date().toISOString(),
  },
  revalidate: 300,
});

export default function StatsPage({ generatedAt }: InferGetStaticPropsType<typeof getStaticProps>) {
  const filters = useHealthStore((state) => state.filters);
  const selectedPeriod = useHealthStore((state) => state.selectedPeriod);
  const setSelectedPeriod = useHealthStore((state) => state.setSelectedPeriod);
  const setCategoryFilter = useHealthStore((state) => state.setCategoryFilter);
  const setDateRange = useHealthStore((state) => state.setDateRange);
  const clearFilters = useHealthStore((state) => state.clearFilters);

  const { data: activities = [], isLoading } = useActivities(filters);
  const totals = calculateTotals(activities);
  const weekly = buildTrendData(activities, "semanal");
  const monthly = buildTrendData(activities, "mensal");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-4 py-6 md:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Estatísticas
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Shell gerado em {new Date(generatedAt).toLocaleString("pt-BR")}
          </p>
        </div>
        <Link href="/">
          <Button variant="ghost">Voltar ao dashboard</Button>
        </Link>
      </header>

      <ActivityFilters
        filters={filters}
        onCategoryChange={setCategoryFilter}
        onDateRangeChange={setDateRange}
        onClear={clearFilters}
      />

      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Atividades filtradas</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {activities.length}
          </p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Calorias totais</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {totals.totalCalories}
          </p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Tempo total (min)</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {totals.totalDurationMinutes}
          </p>
        </article>
      </section>

      <section className="flex flex-wrap gap-2">
        <Button
          variant={selectedPeriod === "semanal" ? "primary" : "secondary"}
          onClick={() => setSelectedPeriod("semanal")}
        >
          Visão semanal
        </Button>
        <Button
          variant={selectedPeriod === "mensal" ? "primary" : "secondary"}
          onClick={() => setSelectedPeriod("mensal")}
        >
          Visão mensal
        </Button>
      </section>

      {isLoading ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Carregando estatísticas...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <ActivityTrendChart
            title="Calorias por período"
            data={selectedPeriod === "semanal" ? weekly : monthly}
            metric="calories"
            visualization="bar"
          />
          <ActivityTrendChart
            title="Distância por período"
            data={selectedPeriod === "semanal" ? weekly : monthly}
            metric="distanceKm"
          />
        </div>
      )}
    </main>
  );
}
