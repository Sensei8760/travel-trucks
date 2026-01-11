import { create } from 'zustand';
import type { Camper } from '@/types/camper';
import { fetchCampers, type FetchCampersParams } from '@/services/campersApi';
import { useFiltersStore } from '@/store/filtersStore';

interface CampersState {
  campers: Camper[];
  isLoading: boolean;
  page: number;
  hasMore: boolean;

  // "останній запит перемагає" — щоб не було гонок при зміні фільтрів під час завантаження
  requestSeq: number;

  activeQueryKey: string;
  getCampers: (reset?: boolean) => Promise<void>;
}

function makeQueryKey() {
  const { location, vehicleType, equipment } = useFiltersStore.getState();
  return JSON.stringify({
    location: location.trim().toLowerCase(),
    vehicleType,
    equipment,
  });
}

export const useCampersStore = create<CampersState>((set, get) => ({
  campers: [],
  isLoading: false,
  page: 1,
  hasMore: true,
  requestSeq: 0,
  activeQueryKey: '',

  getCampers: async (reset = false) => {
    const state = get();

    // Load more — не запускаємо паралельно, але reset (нові фільтри) — дозволяємо.
    if (state.isLoading && !reset) return;

    const newKey = makeQueryKey();

    // якщо фільтри змінилися — мусимо скинути попередні результати
    if (!reset && state.activeQueryKey && state.activeQueryKey !== newKey) {
      reset = true;
    }

    const page = reset ? 1 : state.page;

    const { location, vehicleType, equipment } = useFiltersStore.getState();

    const form: FetchCampersParams['form'] =
      vehicleType === 'van'
        ? 'panelTruck'
        : vehicleType === 'fullyIntegrated'
          ? 'fullyIntegrated'
          : vehicleType === 'alcove'
            ? 'alcove'
            : undefined;

    const transmission: FetchCampersParams['transmission'] =
      equipment.automatic ? 'automatic' : undefined;

    const limit = 4;
    const seq = state.requestSeq + 1;

    set({
      isLoading: true,
      requestSeq: seq,
      ...(reset ? { campers: [], page: 1, hasMore: true } : {}),
    });

    try {
      const data = await fetchCampers({
        page,
        limit,

        location,
        form,
        transmission,

        AC: equipment.AC,
        kitchen: equipment.kitchen,
        TV: equipment.TV,
        bathroom: equipment.bathroom,
      });

      // Якщо під час запиту стартував новий — цей результат ігноруємо
      if (get().requestSeq !== seq) return;

      set((s) => {
        const merged = reset ? data : [...s.campers, ...data];

        // Дедуп по id (на випадок нестабільного сортування на бекенді)
        const uniq = Array.from(new Map(merged.map((c) => [c.id, c])).values());

        return {
          campers: uniq,
          page: data.length > 0 ? page + 1 : page,
          isLoading: false,
          activeQueryKey: newKey,
          hasMore: data.length === limit, // якщо прийшло менше ніж limit — більше сторінок нема
        };
      });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },
}));