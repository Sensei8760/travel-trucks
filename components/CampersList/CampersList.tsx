'use client';

import { useEffect } from 'react';
import CamperCard from '@/components/CamperCard/CamperCard';
import { useCampersStore } from '@/store/campersStore';
import { useFiltersStore } from '@/store/filtersStore';
import styles from './CampersList.module.css';

export default function CampersList() {
  const { campers, isLoading, getCampers } = useCampersStore();
  const hasHydrated = useFiltersStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    getCampers(true);
  }, [hasHydrated, getCampers]);

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        {campers.map((camper) => (
          <li key={camper.id} className={styles.item}>
            <CamperCard camper={camper} />
          </li>
        ))}
      </ul>

      {!isLoading && campers.length > 0 && (
        <button className={styles.loadMore} onClick={() => getCampers()}>
          Load more
        </button>
      )}

      {isLoading && <p>Loading...</p>}
    </div>
  );
}
