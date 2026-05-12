/**
 * Features/FSD: regras de negócio da feature de Activity (filtros, totais e agregações).
 */
import type {
  Activity,
  ActivityFilters,
  PeriodFilter,
} from "@/entities/activity/model/activityTypes";
import { isDateWithinRange } from "@/shared/lib/date";

export interface ActivityTotals {
  totalCalories: number;
  totalDurationMinutes: number;
  totalDistanceKm: number;
}

export interface ActivityTrendPoint {
  label: string;
  calories: number;
  durationMinutes: number;
  distanceKm: number;
}

export const filterActivities = (activities: Activity[], filters: ActivityFilters) =>
  activities.filter((activity) => {
    if (filters.category !== "all" && activity.category !== filters.category) {
      return false;
    }
    return isDateWithinRange(activity.date, filters.fromDate, filters.toDate);
  });

export const calculateTotals = (activities: Activity[]): ActivityTotals =>
  activities.reduce<ActivityTotals>(
    (accumulator, activity) => ({
      totalCalories: accumulator.totalCalories + activity.calories,
      totalDurationMinutes: accumulator.totalDurationMinutes + activity.durationMinutes,
      totalDistanceKm: accumulator.totalDistanceKm + activity.distanceKm,
    }),
    {
      totalCalories: 0,
      totalDurationMinutes: 0,
      totalDistanceKm: 0,
    },
  );

export const getRecentActivities = (activities: Activity[], limit = 5) =>
  [...activities].sort((first, second) => second.date.localeCompare(first.date)).slice(0, limit);

const normalizeDateLabel = (date: Date) =>
  date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });

const normalizeMonthLabel = (date: Date) =>
  date.toLocaleDateString("pt-BR", {
    month: "short",
    year: "2-digit",
  });

const toLocalDate = (dateValue: string) => {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
};

const addActivityToPoint = (point: ActivityTrendPoint, activity: Activity) => {
  point.calories += activity.calories;
  point.durationMinutes += activity.durationMinutes;
  point.distanceKm += activity.distanceKm;
};

export const buildTrendData = (
  activities: Activity[],
  period: PeriodFilter,
): ActivityTrendPoint[] => {
  const now = new Date();

  if (period === "weekly") {
    const points = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - index));
      return {
        label: normalizeDateLabel(date),
        calories: 0,
        durationMinutes: 0,
        distanceKm: 0,
        dateKey: date.toISOString().slice(0, 10),
      };
    });

    const pointMap = new Map(points.map((point) => [point.dateKey, point]));
    activities.forEach((activity) => {
      const found = pointMap.get(activity.date);
      if (found) {
        addActivityToPoint(found, activity);
      }
    });

    return points.map((point) => ({
      label: point.label,
      calories: point.calories,
      durationMinutes: point.durationMinutes,
      distanceKm: point.distanceKm,
    }));
  }

  const points = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      label: normalizeMonthLabel(date),
      calories: 0,
      durationMinutes: 0,
      distanceKm: 0,
      monthKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    };
  });

  const pointMap = new Map(points.map((point) => [point.monthKey, point]));

  activities.forEach((activity) => {
    const activityDate = toLocalDate(activity.date);
    const monthKey = `${activityDate.getFullYear()}-${String(activityDate.getMonth() + 1).padStart(2, "0")}`;
    const found = pointMap.get(monthKey);
    if (found) {
      addActivityToPoint(found, activity);
    }
  });

  return points.map((point) => ({
    label: point.label,
    calories: point.calories,
    durationMinutes: point.durationMinutes,
    distanceKm: point.distanceKm,
  }));
};
