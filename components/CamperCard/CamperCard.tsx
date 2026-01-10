import styles from './CamperCard.module.css';

export default function CamperCard() {
  return (
    <article className={styles.card}>
      <img
        className={styles.image}
        src="/images/camper.jpg"
        alt="Camper"
      />

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>Mavericks</h3>
          <span className={styles.price}>€8000.00</span>
        </div>

        <p className={styles.meta}>
          <svg className={styles.star} aria-hidden="true">
            <use href="/icons/sprite.svg#icon-Property-1Default-1" />
          </svg>
          <span className={styles.rating}>4.4</span>
          <span className={styles.reviews}>(2 Reviews)</span>
          <span className={styles.dot}>•</span>
          <span>Kyiv, Ukraine</span>
        </p>

        <p className={styles.description}>
          Embrace simplicity and freedom with the Mavericks panel truck...
        </p>

        <ul className={styles.features}>
          <li>Automatic</li>
          <li>Petrol</li>
          <li>Kitchen</li>
          <li>AC</li>
        </ul>

        <button className={styles.more}>Show more</button>
      </div>
    </article>
  );
}
