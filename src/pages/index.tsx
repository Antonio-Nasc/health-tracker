/**
 * Pages/FSD: Dashboard principal com visão resumida, CRUD e gráfico semanal.
 * Estratégia Next.js: SSG + ISR para shell da página; dados de atividades ficam no client (IndexedDB).
 */
import dynamic from "next/dynamic";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useHealthStore } from "@/app/store/healthStore";
import {
  useCreateActivity,
  useDeleteActivity,
  useActivities,
} from "@/features/activity/api/useActivityQueries";
import { useActivityInsights } from "@/features/activity/lib/useActivityInsights";
import { ActivityFilters } from "@/features/activity/ui/ActivityFilters";
import { ActivityForm } from "@/features/activity/ui/ActivityForm";
import { ActivityList } from "@/features/activity/ui/ActivityList";
import { ActivitySummaryCards } from "@/features/activity/ui/ActivitySummaryCards";
import { formatDatePtBr } from "@/shared/lib/date";
import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";

const ActivityTrendChart = dynamic(
  () =>
    import("@/features/activity/ui/ActivityTrendChart").then((module) => module.ActivityTrendChart),
  { ssr: false },
);

interface DashboardPageProps {
  generatedAt: string;
}

export const getStaticProps: GetStaticProps<DashboardPageProps> = async () => ({
  props: {
    generatedAt: new Date().toISOString(),
  },
  revalidate: 300,
});

export default function DashboardPage({
  generatedAt,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const darkMode = useHealthStore((state) => state.darkMode);
  const filters = useHealthStore((state) => state.filters);
  const setCategoryFilter = useHealthStore((state) => state.setCategoryFilter);
  const setDateRange = useHealthStore((state) => state.setDateRange);
  const clearFilters = useHealthStore((state) => state.clearFilters);
  const toggleDarkMode = useHealthStore((state) => state.toggleDarkMode);
  const pushToast = useHealthStore((state) => state.pushToast);

  const { data: activities = [], isLoading } = useActivities(filters);
  const createActivityMutation = useCreateActivity();
  const deleteActivityMutation = useDeleteActivity();

  const { totals, recentActivities, weeklyTrend } = useActivityInsights(activities);

  const deletingId = useMemo(
    () => (deleteActivityMutation.isPending ? (deleteActivityMutation.variables ?? null) : null),
    [deleteActivityMutation.isPending, deleteActivityMutation.variables],
  );

  const handleCreateActivity = async (
    payload: Parameters<typeof createActivityMutation.mutateAsync>[0],
  ) => {
    try {
      await createActivityMutation.mutateAsync(payload);
      pushToast({
        title: "Atividade adicionada",
        description: "O dashboard foi atualizado com sucesso.",
        variant: "success",
      });
      setIsCreateModalOpen(false);
    } catch {
      pushToast({
        title: "Falha ao adicionar atividade",
        description: "Tente novamente em alguns segundos.",
        variant: "error",
      });
    }
  };

  const handleDeleteActivity = async (id: string) => {
    const shouldDelete = window.confirm("Deseja remover esta atividade?");
    if (!shouldDelete) {
      return;
    }
    try {
      await deleteActivityMutation.mutateAsync(id);
      pushToast({
        title: "Atividade removida",
        description: "A atividade foi excluída.",
        variant: "info",
      });
    } catch {
      pushToast({
        title: "Erro ao excluir",
        description: "Não foi possível remover a atividade selecionada.",
        variant: "error",
      });
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-4 py-6 md:px-8">
      <header className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-600 dark:text-sky-400">HealthTracker</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Dashboard de atividades
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gerado em {new Date(generatedAt).toLocaleString("pt-BR")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={toggleDarkMode}>
            {darkMode ? "Tema claro" : "Tema escuro"}
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>Nova atividade</Button>
          <Link href="/stats">
            <Button variant="ghost">Ver estatísticas</Button>
          </Link>
        </div>
      </header>

      <ActivityFilters
        filters={filters}
        onCategoryChange={setCategoryFilter}
        onDateRangeChange={setDateRange}
        onClear={clearFilters}
      />

      <ActivitySummaryCards totals={totals} totalActivities={activities.length} />

      <ActivityTrendChart title="Evolução semanal" data={weeklyTrend} metric="calories" />

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Atividades recentes
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {recentActivities.length} registro(s)
          </span>
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Carregando atividades...</p>
        ) : (
          <ActivityList
            activities={recentActivities}
            deletingId={deletingId}
            onDelete={handleDeleteActivity}
          />
        )}
      </section>

      <footer className="text-center text-xs text-slate-500 dark:text-slate-400">
        Última atualização de shell (ISR): {formatDatePtBr(generatedAt.slice(0, 10))}
      </footer>

      <Modal
        open={isCreateModalOpen}
        title="Adicionar atividade"
        onClose={() => setIsCreateModalOpen(false)}
      >
        <ActivityForm
          mode="create"
          isSubmitting={createActivityMutation.isPending}
          onCancel={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateActivity}
        />
      </Modal>
    </main>
  );
}
