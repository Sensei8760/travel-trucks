import { create } from 'zustand';
import { Camper } from '@/types/camper';
import { fetchCampers } from '@/services/campersApi';

interface Filters {
  location: string;
  form: string;
  AC: boolean;
  kitchen: boolean;
  TV: boolean;
  radio: boolean;
  bathroom: boolean;
}

interface CampersState {
  campers: Camper[];
  page: number;
  isLoading: boolean;
  filters: Filters;

  fetchCampersList: (reset?: boolean) => Promise<void>;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  resetCampers: () => void;
}

export const useCampersStore = create<CampersState>((set, get) => ({
  campers: [],
  page: 1,
  isLoading: false,

  filters: {
    location: '',
    form: '',
    AC: false,
    kitchen: false,
    TV: false,
    radio: false,
    bathroom: false,
  },

  fetchCampersList: async (reset = false) => {
    const { page, filters, campers } = get();

    set({ isLoading: true });

    const data = await fetchCampers({
      page: reset ? 1 : page,
      limit: 4,
      ...filters,
    });

    set({
      campers: reset ? data : [...campers, ...data],
      page: reset ? 2 : page + 1,
      isLoading: false,
    });
  },

  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),

  resetCampers: () =>
    set({
      campers: [],
      page: 1,
    }),
}));
