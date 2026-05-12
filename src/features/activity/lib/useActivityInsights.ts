/**
 * Features/FSD: hook de composição para resumir dados de atividade de forma reutilizável.
 */
import { useMemo } from "react";

import type { Activity } from "@/entities/activity/model/activityTypes";
import {
  buildTrendData,
  calculateTotals,
  getRecentActivities,
} from "@/features/activity/lib/activityCalculations";

export const useActivityInsights = (activities: Activity[]) =>
  useMemo(
    () => ({
      totals: calculateTotals(activities),
      recentActivities: getRecentActivities(activities),
      weeklyTrend: buildTrendData(activities, "weekly"),
      monthlyTrend: buildTrendData(activities, "monthly"),
    }),
    [activities],
  );
