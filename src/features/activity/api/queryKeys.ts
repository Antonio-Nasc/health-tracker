/**
 * Features/FSD: centraliza query keys para evitar inconsistência de cache no TanStack Query.
 */
export const activityQueryKeys = {
  all: ["activities"] as const,
  filtered: (category: string, fromDate: string | null, toDate: string | null) =>
    [...activityQueryKeys.all, category, fromDate, toDate] as const,
  detail: (id: string) => [...activityQueryKeys.all, id] as const,
};
