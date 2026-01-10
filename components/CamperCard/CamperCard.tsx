import styles from './CamperCard.module.css';

export default function CamperCard() {
  return (
    <article className={styles.card}>
      <img src="/images/camper.jpg" alt="" />

      <div className={styles.info}>
        <div className={styles.header}>
          <h3>Mavericks</h3>
          <span>€8000.00</span>
        </div>

        <p className={styles.meta}>⭐ 4.4 (2 Reviews) • Kyiv, Ukraine</p>
        <p className={styles.desc}>
          Embrace simplicity and freedom with the Mavericks panel truck...
        </p>

        <div className={styles.tags}>
          <span>Automatic</span>
          <span>Petrol</span>
          <span>Kitchen</span>
          <span>AC</span>
        </div>

        <button className={styles.more}>Show more</button>
      </div>
    </article>
  );
}
