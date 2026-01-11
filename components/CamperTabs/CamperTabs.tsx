'use client';

import { useState } from 'react';
import type { Camper } from '@/types/camper';
import FeaturesTab from '@/components/FeaturesTab/FeaturesTab';
import ReviewsTab from '@/components/ReviewsTab/ReviewsTab';
import styles from './CamperTabs.module.css';

type Props = {
  camper: Camper;
};

type TabKey = 'features' | 'reviews';

export default function CamperTabs({ camper }: Props) {
  const [active, setActive] = useState<TabKey>('features');

  return (
    <section className={styles.section}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tabBtn} ${active === 'features' ? styles.active : ''}`}
          onClick={() => setActive('features')}
        >
          Features
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${active === 'reviews' ? styles.active : ''}`}
          onClick={() => setActive('reviews')}
        >
          Reviews
        </button>
      </div>

      <div className={styles.panel}>
        {active === 'features' ? (
          <FeaturesTab camper={camper} />
        ) : (
          <ReviewsTab reviews={camper.reviews ?? []} />
        )}
      </div>
    </section>
  );
}
