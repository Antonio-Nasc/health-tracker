/**
 * Entities/FSD: tipos puros da entidade Activity, sem dependência de UI.
 */
export const ACTIVITY_CATEGORIES = [
  "correndo",
  "caminhando",
  "treinando",
  "yoga",
  "ciclismo",
  "natação",
  "outros",
] as const;

export type Category = (typeof ACTIVITY_CATEGORIES)[number];

export type PeriodFilter = "semanal" | "mensal";

export interface Activity {
  id: string;
  title: string;
  category: Category;
  date: string; // Formato YYYY-MM-DD
  durationMinutes: number;
  calories: number;
  distanceKm: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityInput {
  title: string;
  category: Category;
  date: string;
  durationMinutes: number;
  calories: number;
  distanceKm: number;
  notes?: string;
}

export type ActivityUpdateInput = Partial<ActivityInput>;

export interface ActivityFilters {
  category: Category | "all";
  fromDate: string | null;
  toDate: string | null;
}
