/**
 * Shared/FSD: formatadores centralizados para manter consistência visual na UI.
 */
export const formatCalories = (value: number) =>
  `${value.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} kcal`;

export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) {
    return `${remainingMinutes} min`;
  }
  return `${hours}h ${remainingMinutes}min`;
};

export const formatDistance = (kilometers: number) =>
  `${kilometers.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} km`;
