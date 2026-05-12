/**
 * Teste unitário dos hooks TanStack Query da feature de atividades.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";

import { useActivities } from "@/features/activity/api/useActivityQueries";

const mockGetAllActivities = jest.fn();

jest.mock("@/entities/activity/api/activityDb", () => ({
  getAllActivities: (...args: unknown[]) => mockGetAllActivities(...args),
  getActivityById: jest.fn(),
  createActivity: jest.fn(),
  updateActivity: jest.fn(),
  deleteActivity: jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

describe("useActivityQueries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna atividades filtradas por categoria", async () => {
    mockGetAllActivities.mockResolvedValue([
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
        durationMinutes: 30,
        calories: 120,
        distanceKm: 0,
        createdAt: "2026-05-11T12:00:00.000Z",
        updatedAt: "2026-05-11T12:00:00.000Z",
      },
    ]);

    const { result } = renderHook(
      () =>
        useActivities({
          category: "running",
          fromDate: null,
          toDate: null,
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0]?.category).toBe("running");
  });
});
