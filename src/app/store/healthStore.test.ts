/**
 * Teste unitário do store global (Zustand) para validar filtros, tema e toasts.
 */
import { useHealthStore } from "@/app/store/healthStore";

describe("healthStore", () => {
  beforeEach(() => {
    useHealthStore.setState({
      darkMode: false,
      selectedPeriod: "semanal",
      filters: {
        category: "all",
        fromDate: null,
        toDate: null,
      },
      toasts: [],
    });
  });

  it("alterna o dark mode", () => {
    useHealthStore.getState().toggleDarkMode();
    expect(useHealthStore.getState().darkMode).toBe(true);
  });

  it("define e limpa filtros", () => {
    const store = useHealthStore.getState();
    store.setCategoryFilter("correndo");
    store.setDateRange("2026-05-01", "2026-05-10");

    expect(useHealthStore.getState().filters).toEqual({
      category: "correndo",
      fromDate: "2026-05-01",
      toDate: "2026-05-10",
    });

    store.clearFilters();
    expect(useHealthStore.getState().filters).toEqual({
      category: "all",
      fromDate: null,
      toDate: null,
    });
  });

  it("adiciona e remove toast", () => {
    const store = useHealthStore.getState();
    store.pushToast({
      title: "Teste",
      description: "Mensagem de teste",
      variant: "info",
    });
    expect(useHealthStore.getState().toasts).toHaveLength(1);

    const [toast] = useHealthStore.getState().toasts;
    store.removeToast(toast.id);
    expect(useHealthStore.getState().toasts).toHaveLength(0);
  });
});
