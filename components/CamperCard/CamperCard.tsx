import Image from 'next/image';
import styles from './CamperCard.module.css';
import type { Camper } from '@/types/camper';

interface CamperCardProps {
  camper: Camper;
}

export default function CamperCard({ camper }: CamperCardProps) {
  const {
    name,
    price,
    rating,
    location,
    description,
    gallery,
    reviews,
  } = camper;

  const imageSrc =
    gallery?.[0]?.original || gallery?.[0]?.thumb || '/placeholder.jpg';

  return (
    <article className={styles.card}>
      <Image
        className={styles.image}
        src={imageSrc}
        alt={name}
        width={292}
        height={320}
        priority={false}
      />

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{name}</h3>
          <span className={styles.price}>€{Number(price).toFixed(2)}</span>
        </div>

        <p className={styles.meta}>
          <svg className={styles.star} aria-hidden="true">
            <use href="/icons/sprite.svg#icon-Property-1Default-1" />
          </svg>

          <span className={styles.rating}>{rating}</span>
          <span className={styles.reviews}>({reviews?.length ?? 0} Reviews)</span>

          <span className={styles.dot}>•</span>

          <span className={styles.location}>{location}</span>
        </p>

        <p className={styles.description}>{description}</p>

        {/* тут далі твої “пілли” (Automatic / Petrol / Kitchen / AC) + кнопка Show more */}
      </div>
    </article>
  );
}
