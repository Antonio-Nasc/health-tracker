/**
 * Pages/FSD: detalhe da atividade com edição e exclusão.
 * Estratégia Next.js: SSR para resolver o parâmetro da rota em cada request.
 */
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { useHealthStore } from "@/app/store/healthStore";
import {
  useActivity,
  useDeleteActivity,
  useUpdateActivity,
} from "@/features/activity/api/useActivityQueries";
import { ActivityForm } from "@/features/activity/ui/ActivityForm";
import { Button } from "@/shared/ui/Button";

interface ActivityDetailProps {
  id: string;
}

export const getServerSideProps: GetServerSideProps<ActivityDetailProps> = async (context) => {
  const id = context.params?.id;
  if (typeof id !== "string") {
    return { notFound: true };
  }
  return {
    props: {
      id,
    },
  };
};

export default function ActivityDetailPage({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const pushToast = useHealthStore((state) => state.pushToast);
  const { data: activity, isLoading } = useActivity(id);
  const updateActivityMutation = useUpdateActivity();
  const deleteActivityMutation = useDeleteActivity();

  const handleUpdate = async (
    payload: Parameters<typeof updateActivityMutation.mutateAsync>[0]["payload"],
  ) => {
    try {
      await updateActivityMutation.mutateAsync({ id, payload });
      pushToast({
        title: "Atividade atualizada",
        description: "As alterações foram salvas.",
        variant: "success",
      });
      router.push("/");
    } catch {
      pushToast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar a atividade.",
        variant: "error",
      });
    }
  };

  const handleDelete = async () => {
    const shouldDelete = window.confirm("Tem certeza que deseja excluir esta atividade?");
    if (!shouldDelete) {
      return;
    }
    try {
      await deleteActivityMutation.mutateAsync(id);
      pushToast({
        title: "Atividade removida",
        description: "Registro excluído com sucesso.",
        variant: "info",
      });
      router.push("/");
    } catch {
      pushToast({
        title: "Erro ao excluir",
        description: "Não foi possível remover a atividade.",
        variant: "error",
      });
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-5 px-4 py-6 md:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Detalhe da atividade</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {activity?.title ?? "Carregando..."}
          </h1>
        </div>
        <Link href="/">
          <Button variant="ghost">Voltar</Button>
        </Link>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        {isLoading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Buscando atividade...</p>
        ) : !activity ? (
          <p className="text-sm text-rose-600 dark:text-rose-400">
            Atividade não encontrada. Talvez ela tenha sido removida.
          </p>
        ) : (
          <ActivityForm
            mode="edit"
            initialValues={activity}
            isSubmitting={updateActivityMutation.isPending}
            onSubmit={handleUpdate}
          />
        )}
      </section>

      <section className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-700 dark:bg-rose-950/30">
        <h2 className="text-lg font-semibold text-rose-900 dark:text-rose-100">Zona de risco</h2>
        <p className="mt-1 text-sm text-rose-700 dark:text-rose-300">
          Esta ação remove definitivamente a atividade do histórico local.
        </p>
        <div className="mt-3">
          <Button
            variant="danger"
            isLoading={deleteActivityMutation.isPending}
            onClick={handleDelete}
          >
            Excluir atividade
          </Button>
        </div>
      </section>
    </main>
  );
}
