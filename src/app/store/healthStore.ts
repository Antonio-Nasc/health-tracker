/**
 * App/FSD: store global de estado de interface (tema, filtros e toasts) com Zustand.
 */
import { create } from "zustand";

import type {
  ActivityFilters,
  Category,
  PeriodFilter,
} from "@/entities/activity/model/activityTypes";

export type ToastVariant = "success" | "error" | "info";

export interface ToastPayload {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface HealthStoreState {
  darkMode: boolean;
  filters: ActivityFilters;
  selectedPeriod: PeriodFilter;
  toasts: ToastPayload[];
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;
  setCategoryFilter: (category: Category | "all") => void;
  setDateRange: (fromDate: string | null, toDate: string | null) => void;
  clearFilters: () => void;
  setSelectedPeriod: (period: PeriodFilter) => void;
  pushToast: (toast: Omit<ToastPayload, "id">) => void;
  removeToast: (id: string) => void;
}

const defaultFilters: ActivityFilters = {
  category: "all",
  fromDate: null,
  toDate: null,
};

const createToastId = () => `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useHealthStore = create<HealthStoreState>((set) => ({
  darkMode: false,
  filters: defaultFilters,
  selectedPeriod: "weekly",
  toasts: [],
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setDarkMode: (enabled) => set({ darkMode: enabled }),
  setCategoryFilter: (category) =>
    set((state) => ({
      filters: {
        ...state.filters,
        category,
      },
    })),
  setDateRange: (fromDate, toDate) =>
    set((state) => ({
      filters: {
        ...state.filters,
        fromDate,
        toDate,
      },
    })),
  clearFilters: () => set({ filters: defaultFilters }),
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),
  pushToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: createToastId() }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
