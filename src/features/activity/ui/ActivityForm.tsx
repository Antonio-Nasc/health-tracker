/**
 * Features/FSD: formulário de criação/edição da entidade Activity.
 */
import { useState } from "react";
import type { FormEvent } from "react";

import {
  ACTIVITY_CATEGORIES,
  type ActivityInput,
  type Category,
} from "@/entities/activity/model/activityTypes";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

interface ActivityFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<ActivityInput>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onSubmit: (payload: ActivityInput) => Promise<void> | void;
}

const buildDefaultValues = (initialValues?: Partial<ActivityInput>): ActivityInput => ({
  title: initialValues?.title ?? "",
  category: initialValues?.category ?? "caminhando",
  date: initialValues?.date ?? new Date().toISOString().slice(0, 10),
  durationMinutes: initialValues?.durationMinutes ?? 30,
  calories: initialValues?.calories ?? 150,
  distanceKm: initialValues?.distanceKm ?? 1.5,
  notes: initialValues?.notes ?? "",
});

export const ActivityForm = ({
  mode,
  initialValues,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: ActivityFormProps) => {
  const [values, setValues] = useState<ActivityInput>(buildDefaultValues(initialValues));
  const [error, setError] = useState<string | null>(null);

  const setField = <Key extends keyof ActivityInput>(field: Key, value: ActivityInput[Key]) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!values.title.trim()) {
      setError("Informe um título para a atividade.");
      return;
    }
    if (!values.date) {
      setError("Informe a data da atividade.");
      return;
    }
    setError(null);
    await onSubmit(values);
  };

  return (
    <form className="grid grid-cols-1 gap-3" onSubmit={handleSubmit}>
      <Input
        label="Título da atividade"
        placeholder="Ex.: Corrida de 5 km"
        value={values.title}
        onChange={(event) => setField("title", event.target.value)}
      />

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Categoria</span>
        <select
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          value={values.category}
          onChange={(event) => setField("category", event.target.value as Category)}
        >
          {ACTIVITY_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          label="Data"
          type="date"
          value={values.date}
          onChange={(event) => setField("date", event.target.value)}
        />
        <Input
          label="Duração (min)"
          type="number"
          min={0}
          value={values.durationMinutes}
          onChange={(event) => setField("durationMinutes", Number(event.target.value))}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          label="Calorias"
          type="number"
          min={0}
          value={values.calories}
          onChange={(event) => setField("calories", Number(event.target.value))}
        />
        <Input
          label="Distância (km)"
          type="number"
          min={0}
          step={0.1}
          value={values.distanceKm}
          onChange={(event) => setField("distanceKm", Number(event.target.value))}
        />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Observações</span>
        <textarea
          className="min-h-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-sky-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          placeholder="Ex.: ritmo, sensação, clima..."
          value={values.notes ?? ""}
          onChange={(event) => setField("notes", event.target.value)}
        />
      </label>

      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

      <div className="mt-1 flex flex-wrap gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          {mode === "create" ? "Adicionar atividade" : "Salvar alterações"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};
