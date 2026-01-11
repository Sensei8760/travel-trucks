// store/campersStore.ts
import { create } from 'zustand';
import type { Camper } from '@/types/camper';
import { fetchCampers, type FetchCampersParams } from '@/services/campersApi';
import { useFiltersStore } from '@/store/filtersStore';

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

    set({ isLoading: true });

    try {
      const data = await fetchCampers({
        page,
        limit: 4,

        location,
        form,
        transmission,

        AC: equipment.AC,
        kitchen: equipment.kitchen,
        TV: equipment.TV,
        bathroom: equipment.bathroom,
      });

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
