/**
 * Testes unitários das regras de negócio de cálculo e agregação de atividades.
 */
import type { Activity } from "@/entities/activity/model/activityTypes";
import {
  buildTrendData,
  calculateTotals,
  filterActivities,
} from "@/features/activity/lib/activityCalculations";

const baseActivities: Activity[] = [
  {
    id: "1",
    title: "Corrida",
    category: "running",
    date: "2026-05-10",
    durationMinutes: 40,
    calories: 300,
    distanceKm: 5,
    createdAt: "2026-05-10T12:00:00.000Z",
    updatedAt: "2026-05-10T12:00:00.000Z",
  },
  {
    id: "2",
    title: "Yoga",
    category: "yoga",
    date: "2026-05-11",
    durationMinutes: 50,
    calories: 180,
    distanceKm: 0,
    createdAt: "2026-05-11T12:00:00.000Z",
    updatedAt: "2026-05-11T12:00:00.000Z",
  },
];

describe("activityCalculations", () => {
  it("calcula totais corretamente", () => {
    const totals = calculateTotals(baseActivities);
    expect(totals).toEqual({
      totalCalories: 480,
      totalDurationMinutes: 90,
      totalDistanceKm: 5,
    });
  });

  it("aplica filtros de categoria e período", () => {
    const filtered = filterActivities(baseActivities, {
      category: "running",
      fromDate: "2026-05-09",
      toDate: "2026-05-10",
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.id).toBe("1");
  });

  it("gera trend semanal com sete pontos", () => {
    const today = new Date().toISOString().slice(0, 10);
    const activities: Activity[] = [
      {
        ...baseActivities[0],
        id: "today-activity",
        date: today,
      },
    ];

    const weeklyData = buildTrendData(activities, "weekly");
    expect(weeklyData).toHaveLength(7);
    const caloriesSum = weeklyData.reduce((accumulator, point) => accumulator + point.calories, 0);
    expect(caloriesSum).toBe(300);
  });
});
