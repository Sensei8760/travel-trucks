// store/favoritesStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface FavoritesState {
  ids: string[];

  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],

      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      toggleFavorite: (id) => {
        set((state) => {
          const exists = state.ids.includes(id);
          return { ids: exists ? state.ids.filter((x) => x !== id) : [...state.ids, id] };
        });
      },

      isFavorite: (id) => get().ids.includes(id),
    }),
    {
      name: 'traveltrucks_favorites',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ ids: state.ids }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
