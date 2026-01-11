// components/CamperCard/CamperCard.tsx
'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CamperCard.module.css';
import type { Camper } from '@/types/camper';
import { useFavoritesStore } from '@/store/favoritesStore';

type CamperCardProps = {
  camper: Camper;
};

type Badge = {
  key: string;
  label: string;
  iconId: string;
};

const toTitle = (value?: string) => {
  if (!value) return '';
  const s = String(value).toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const getFirstImageSrc = (gallery?: Camper['gallery']) => {
  const first = gallery?.[0];

  if (!first) return '/placeholder.jpg';
  if (typeof first === 'string') return first.trim() || '/placeholder.jpg';

  const original = first.original?.trim();
  const thumb = first.thumb?.trim();

  return original || thumb || '/placeholder.jpg';
};

const MIXED_ICON_IDS = new Set<string>([]);
const FORCE_OUTLINE_ICON_IDS = new Set<string>([
  'icon-lucide_microwave',
  'icon-hugeicons_gas-stove',
  'icon-ion_water-outline',
]);

export default function CamperCard({ camper }: CamperCardProps) {
  const {
    id,
    name,
    price,
    rating,
    location,
    description,
    gallery,
    reviews,
    transmission,
    engine,
    AC,
    kitchen,
    radio,
    bathroom,
    refrigerator,
    microwave,
    gas,
    water,
    TV,
  } = camper;

  const imageSrc = getFirstImageSrc(gallery);

  const isFav = useFavoritesStore((s) => s.ids.includes(id));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  const badges: Badge[] = useMemo(() => {
    const list: Badge[] = [];

    if (transmission) {
      list.push({
        key: 'transmission',
        label:
          transmission.toLowerCase() === 'automatic'
            ? 'Automatic'
            : toTitle(transmission),
        iconId: 'icon-diagram',
      });
    }

    if (AC) list.push({ key: 'AC', label: 'AC', iconId: 'icon-wind' });

    if (engine) {
      list.push({
        key: 'engine',
        label: toTitle(engine),
        iconId: 'icon-fuel-pump',
      });
    }

    if (kitchen) list.push({ key: 'kitchen', label: 'Kitchen', iconId: 'icon-cup-hot' });
    if (radio) list.push({ key: 'radio', label: 'Radio', iconId: 'icon-ui-radios' });
    if (bathroom) list.push({ key: 'bathroom', label: 'Bathroom', iconId: 'icon-ph_shower' });

    if (refrigerator) {
      list.push({
        key: 'refrigerator',
        label: 'Refrigerator',
        iconId: 'icon-solar_fridge-outline',
      });
    }

    if (microwave) {
      list.push({
        key: 'microwave',
        label: 'Microwave',
        iconId: 'icon-lucide_microwave',
      });
    }

    if (gas) {
      list.push({
        key: 'gas',
        label: 'Gas',
        iconId: 'icon-hugeicons_gas-stove',
      });
    }

    if (water) {
      list.push({
        key: 'water',
        label: 'Water',
        iconId: 'icon-ion_water-outline',
      });
    }

    if (TV) list.push({ key: 'TV', label: 'TV', iconId: 'icon-tv' });

    return list;
  }, [transmission, AC, engine, kitchen, radio, bathroom, refrigerator, microwave, gas, water, TV]);

  const reviewsCount = reviews?.length ?? 0;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          className={styles.image}
          src={imageSrc}
          alt={name}
          width={292}
          height={320}
          sizes="292px"
          unoptimized
        />
      </div>

      <div className={styles.content}>
        <div className={styles.topRow}>
          <h3 className={styles.title}>{name}</h3>

          <div className={styles.rightTop}>
            <span className={styles.price}>€{Math.trunc(Number(price))}</span>

            <button
              type="button"
              className={`${styles.favBtn} ${isFav ? styles.favBtnActive : ''}`}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isFav}
              onClick={() => toggleFavorite(id)}
            >
              <svg className={styles.heartIcon} aria-hidden="true">
                <use href="/icons/sprite.svg#icon-Property-1Default" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.metaRow}>
          <div className={styles.ratingWrap}>
            <svg className={styles.star} aria-hidden="true">
              <use href="/icons/sprite.svg#icon-Property-1Default-1" />
            </svg>
            <span className={styles.rating}>{Number(rating).toFixed(1)}</span>
            <span className={styles.reviews}>({reviewsCount} Reviews)</span>
          </div>

          <div className={styles.locationWrap}>
            <svg className={styles.map} aria-hidden="true">
              <use href="/icons/sprite.svg#icon-Map" />
            </svg>
            <span className={styles.location}>{location}</span>
          </div>
        </div>

        <p className={styles.description}>{description}</p>

        <ul className={styles.badges} aria-label="Camper features">
          {badges.map((b) => {
            const modeClass = MIXED_ICON_IDS.has(b.iconId)
              ? styles.badgeIconMixed
              : styles.badgeIconOutline;

            const finalIconClass = FORCE_OUTLINE_ICON_IDS.has(b.iconId)
              ? styles.badgeIconForceOutline
              : modeClass;

            return (
              <li key={b.key} className={styles.badge}>
                <svg className={`${styles.badgeIcon} ${finalIconClass}`} aria-hidden="true">
                  <use href={`/icons/sprite.svg#${b.iconId}`} />
                </svg>
                <span>{b.label}</span>
              </li>
            );
          })}
        </ul>

        <Link className={styles.moreBtn} href={`/catalog/${id}`}>
          Show more
        </Link>
      </div>
    </article>
  );
}
