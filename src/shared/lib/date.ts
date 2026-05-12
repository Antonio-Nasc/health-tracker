/**
 * Shared/FSD: funções genéricas de datas, reutilizadas em filtros e gráficos.
 */
export const parseLocalDate = (dateValue: string) => {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
};

export const formatDatePtBr = (dateValue: string) =>
  parseLocalDate(dateValue).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export const isDateWithinRange = (
  dateValue: string,
  fromDate: string | null,
  toDate: string | null,
) => {
  const reference = parseLocalDate(dateValue);
  const from = fromDate ? parseLocalDate(fromDate) : null;
  const to = toDate ? parseLocalDate(toDate) : null;

  if (from && reference < from) {
    return false;
  }
  if (to && reference > to) {
    return false;
  }
  return true;
};
