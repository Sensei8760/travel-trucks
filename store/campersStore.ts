import { create } from 'zustand';
import type { Camper } from '@/types/camper';
import { fetchCampers } from '@/services/campersApi';

interface CampersState {
  campers: Camper[];
  isLoading: boolean;
  page: number;

  getCampers: (reset?: boolean) => Promise<void>;
}

export const useCampersStore = create<CampersState>((set, get) => ({
  campers: [],
  isLoading: false,
  page: 1,

  getCampers: async (reset = false) => {
    if (get().isLoading) return;

    const page = reset ? 1 : get().page;

    set({ isLoading: true });

    try {
      const data = await fetchCampers({ page, limit: 4 });

      set((state) => ({
        campers: reset ? data : [...state.campers, ...data],
        page: page + 1,
        isLoading: false,
      }));
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },
}));
