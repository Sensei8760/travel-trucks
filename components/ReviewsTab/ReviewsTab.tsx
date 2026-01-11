// components/ReviewsTab/ReviewsTab.tsx
import styles from './ReviewsTab.module.css';

type Review = {
  reviewer_name: string;
  reviewer_rating: number;
  comment: string;
};

type Props = {
  reviews: Review[];
};

function getInitial(name: string) {
  const s = name.trim();
  return s ? s[0].toUpperCase() : '?';
}

export default function ReviewsTab({ reviews }: Props) {
  if (!reviews.length) {
    return <p className={styles.empty}>No reviews yet.</p>;
  }

  return (
    <ul className={styles.list}>
      {reviews.map((r, idx) => (
        <li key={`${r.reviewer_name}-${idx}`} className={styles.item}>
          <div className={styles.header}>
            <div className={styles.avatar} aria-hidden="true">
              {getInitial(r.reviewer_name)}
            </div>

            <div className={styles.meta}>
              <p className={styles.name}>{r.reviewer_name}</p>

              <div className={styles.stars} aria-label={`Rating ${r.reviewer_rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => {
                  const filled = i < r.reviewer_rating;
                  return (
                    <svg
                      key={i}
                      className={`${styles.star} ${filled ? styles.filled : styles.emptyStar}`}
                      aria-hidden="true"
                    >
                      <use href="/icons/sprite.svg#icon-Property-1Default-1" />
                    </svg>
                  );
                })}
              </div>
            </div>
          </div>

          <p className={styles.comment}>{r.comment}</p>
        </li>
      ))}
    </ul>
  );
}
