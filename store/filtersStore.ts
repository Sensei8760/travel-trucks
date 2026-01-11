// store/filtersStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type VehicleType = 'van' | 'fullyIntegrated' | 'alcove' | null;
export type EquipmentKey = 'AC' | 'automatic' | 'kitchen' | 'TV' | 'bathroom';

type EquipmentState = Record<EquipmentKey, boolean>;

interface FiltersState {
  location: string;
  vehicleType: VehicleType;
  equipment: EquipmentState;

  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  setLocation: (value: string) => void;
  toggleEquipment: (key: EquipmentKey) => void;
  setVehicleType: (type: VehicleType) => void;
  reset: () => void;
}

const getInitialEquipment = (): EquipmentState => ({
  AC: false,
  automatic: false,
  kitchen: false,
  TV: false,
  bathroom: false,
});

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set, get) => ({
      location: '',
      vehicleType: null,
      equipment: getInitialEquipment(),

      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      setLocation: (value) => set({ location: value }),

      toggleEquipment: (key) =>
        set((state) => ({
          equipment: { ...state.equipment, [key]: !state.equipment[key] },
        })),

      setVehicleType: (type) => set({ vehicleType: type }),

      reset: () =>
        set({
          location: '',
          vehicleType: null,
          equipment: getInitialEquipment(),
        }),
    }),
    {
      name: 'traveltrucks_filters',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        location: state.location,
        vehicleType: state.vehicleType,
        equipment: state.equipment,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
