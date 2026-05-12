/**
 * Features/FSD: hooks da feature para CRUD assíncrono + cache com TanStack Query.
 */
import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";

import {
  createActivity,
  deleteActivity,
  getActivityById,
  getAllActivities,
  updateActivity,
} from "@/entities/activity/api/activityDb";
import type {
  Activity,
  ActivityFilters,
  ActivityInput,
  ActivityUpdateInput,
} from "@/entities/activity/model/activityTypes";
import { filterActivities } from "@/features/activity/lib/activityCalculations";

import { activityQueryKeys } from "./queryKeys";

export const useActivities = (filters: ActivityFilters): UseQueryResult<Activity[]> =>
  useQuery({
    queryKey: activityQueryKeys.filtered(filters.category, filters.fromDate, filters.toDate),
    queryFn: getAllActivities,
    select: (activities) => filterActivities(activities, filters),
  });

export const useActivity = (id?: string): UseQueryResult<Activity | null> =>
  useQuery({
    queryKey: activityQueryKeys.detail(id ?? ""),
    queryFn: () => getActivityById(id ?? ""),
    enabled: Boolean(id),
  });

export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ActivityInput) => createActivity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ActivityUpdateInput }) =>
      updateActivity(id, payload),
    onSuccess: (updatedActivity) => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
      if (updatedActivity) {
        queryClient.setQueryData(activityQueryKeys.detail(updatedActivity.id), updatedActivity);
      }
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteActivity(id),
    onSuccess: (_deleted, id) => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
      queryClient.removeQueries({ queryKey: activityQueryKeys.detail(id) });
    },
  });
};
