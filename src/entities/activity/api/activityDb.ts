/**
 * Entities/FSD: camada de persistência da entidade Activity.
 * Usa IndexedDB no browser e fallback em memória para SSR/testes.
 */
import { openDB, type DBSchema, type IDBPDatabase } from "idb";

import type {
  Activity,
  ActivityInput,
  ActivityUpdateInput,
} from "@/entities/activity/model/activityTypes";

interface HealthTrackerDB extends DBSchema {
  activities: {
    key: string;
    value: Activity;
  };
}

const DB_NAME = "healthtracker-db";
const DB_VERSION = 1;
const STORE_NAME = "activities" as const;

const createDateLabelFromOffset = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() - offset);
  return date.toISOString().slice(0, 10);
};

const createSeedActivities = (): Activity[] => {
  const now = new Date().toISOString();
  return [
    {
      id: "seed-1",
      title: "Corrida leve no parque",
      category: "running",
      date: createDateLabelFromOffset(1),
      durationMinutes: 35,
      calories: 320,
      distanceKm: 5.2,
      notes: "Ritmo constante e foco na respiração.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "seed-2",
      title: "Caminhada pós-almoço",
      category: "walking",
      date: createDateLabelFromOffset(2),
      durationMinutes: 40,
      calories: 180,
      distanceKm: 3.1,
      notes: "Trajeto urbano com subidas moderadas.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "seed-3",
      title: "Treino funcional",
      category: "workout",
      date: createDateLabelFromOffset(3),
      durationMinutes: 50,
      calories: 410,
      distanceKm: 0,
      notes: "Circuito de força e mobilidade.",
      createdAt: now,
      updatedAt: now,
    },
  ];
};

let memoryActivities: Activity[] = createSeedActivities();
let databasePromise: Promise<IDBPDatabase<HealthTrackerDB>> | null = null;

const canUseIndexedDb = () => typeof window !== "undefined" && "indexedDB" in window;

const normalizeNumber = (value: number) => (Number.isFinite(value) ? Math.max(value, 0) : 0);

const sortActivities = (activities: Activity[]) =>
  [...activities].sort((first, second) => {
    const dateComparison = second.date.localeCompare(first.date);
    if (dateComparison !== 0) {
      return dateComparison;
    }
    return second.updatedAt.localeCompare(first.updatedAt);
  });

const createActivityId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `activity-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const getDatabase = async () => {
  if (!databasePromise) {
    databasePromise = openDB<HealthTrackerDB>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      },
    });
  }
  return databasePromise;
};

const ensureSeedData = async (database: IDBPDatabase<HealthTrackerDB>) => {
  const existing = await database.getAll(STORE_NAME);
  if (existing.length > 0) {
    return;
  }

  const seed = createSeedActivities();
  const transaction = database.transaction(STORE_NAME, "readwrite");
  await Promise.all(seed.map((activity) => transaction.store.put(activity)));
  await transaction.done;
};

export const getAllActivities = async (): Promise<Activity[]> => {
  if (!canUseIndexedDb()) {
    return sortActivities(memoryActivities);
  }

  const database = await getDatabase();
  await ensureSeedData(database);
  const activities = await database.getAll(STORE_NAME);
  return sortActivities(activities);
};

export const getActivityById = async (id: string): Promise<Activity | null> => {
  if (!canUseIndexedDb()) {
    return memoryActivities.find((activity) => activity.id === id) ?? null;
  }

  const database = await getDatabase();
  const activity = await database.get(STORE_NAME, id);
  return activity ?? null;
};

export const createActivity = async (input: ActivityInput): Promise<Activity> => {
  const now = new Date().toISOString();
  const newActivity: Activity = {
    id: createActivityId(),
    title: input.title.trim(),
    category: input.category,
    date: input.date,
    durationMinutes: normalizeNumber(input.durationMinutes),
    calories: normalizeNumber(input.calories),
    distanceKm: normalizeNumber(input.distanceKm),
    notes: input.notes?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  if (!canUseIndexedDb()) {
    memoryActivities = sortActivities([...memoryActivities, newActivity]);
    return newActivity;
  }

  const database = await getDatabase();
  await database.put(STORE_NAME, newActivity);
  return newActivity;
};

export const updateActivity = async (
  id: string,
  input: ActivityUpdateInput,
): Promise<Activity | null> => {
  const existingActivity = await getActivityById(id);
  if (!existingActivity) {
    return null;
  }

  const updatedActivity: Activity = {
    ...existingActivity,
    ...input,
    title: input.title?.trim() ?? existingActivity.title,
    notes: input.notes !== undefined ? input.notes.trim() || undefined : existingActivity.notes,
    durationMinutes:
      input.durationMinutes !== undefined
        ? normalizeNumber(input.durationMinutes)
        : existingActivity.durationMinutes,
    calories:
      input.calories !== undefined ? normalizeNumber(input.calories) : existingActivity.calories,
    distanceKm:
      input.distanceKm !== undefined
        ? normalizeNumber(input.distanceKm)
        : existingActivity.distanceKm,
    updatedAt: new Date().toISOString(),
  };

  if (!canUseIndexedDb()) {
    memoryActivities = memoryActivities.map((activity) =>
      activity.id === id ? updatedActivity : activity,
    );
    memoryActivities = sortActivities(memoryActivities);
    return updatedActivity;
  }

  const database = await getDatabase();
  await database.put(STORE_NAME, updatedActivity);
  return updatedActivity;
};

export const deleteActivity = async (id: string): Promise<boolean> => {
  if (!canUseIndexedDb()) {
    const previousLength = memoryActivities.length;
    memoryActivities = memoryActivities.filter((activity) => activity.id !== id);
    return memoryActivities.length !== previousLength;
  }

  const database = await getDatabase();
  const existingActivity = await database.get(STORE_NAME, id);
  if (!existingActivity) {
    return false;
  }
  await database.delete(STORE_NAME, id);
  return true;
};
