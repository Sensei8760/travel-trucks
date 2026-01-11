'use client';

import { useState } from 'react';
import type { Camper } from '@/types/camper';
import FeaturesTab from '@/components/FeaturesTab/FeaturesTab';
import ReviewsTab from '@/components/ReviewsTab/ReviewsTab';
import styles from './CamperTabs.module.css';

type TabKey = 'features' | 'reviews';

type Props = {
  camper: Camper;
  aside?: React.ReactNode; // ✅ сюди передамо BookingForm
};

export default function CamperTabs({ camper, aside }: Props) {
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

      <div className={styles.layout}>
        <div className={styles.panel}>
          {active === 'features' ? (
            <FeaturesTab camper={camper} />
          ) : (
            <ReviewsTab reviews={camper.reviews ?? []} />
          )}
        </div>

        {aside ? <aside className={styles.aside}>{aside}</aside> : null}
      </div>
    </section>
  );
}
