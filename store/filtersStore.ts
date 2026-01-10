import { create } from 'zustand';

export type VehicleType = 'van' | 'fullyIntegrated' | 'alcove' | null;

export type EquipmentKey = 'AC' | 'automatic' | 'kitchen' | 'TV' | 'bathroom';

interface FiltersState {
  location: string;
  vehicleType: VehicleType;
  equipment: Record<EquipmentKey, boolean>;

  setLocation: (value: string) => void;
  toggleEquipment: (key: EquipmentKey) => void;
  setVehicleType: (type: VehicleType) => void;
  reset: () => void;
}

const initialEquipment: Record<EquipmentKey, boolean> = {
  AC: false,
  automatic: false,
  kitchen: false,
  TV: false,
  bathroom: false,
};

export const useFiltersStore = create<FiltersState>((set) => ({
  location: '',
  vehicleType: null,
  equipment: initialEquipment,

  setLocation: (value) => set({ location: value }),
  toggleEquipment: (key) =>
    set((state) => ({
      equipment: { ...state.equipment, [key]: !state.equipment[key] },
    })),
  setVehicleType: (type) => set({ vehicleType: type }),
  reset: () => set({ location: '', vehicleType: null, equipment: initialEquipment }),
}));
