import styles from './Filters.module.css';

export default function Filters() {
  return (
    <aside className={styles.filters}>
      <div className={styles.block}>
        <label className={styles.label}>Location</label>
        <div className={styles.input}>
          <svg className={styles.icon}>
            <use href="/icons/sprite.svg#icon-map" />
          </svg>
          <input type="text" placeholder="Kyiv, Ukraine" />
        </div>
      </div>

      <div className={styles.block}>
        <p className={styles.label}>Vehicle equipment</p>

        <div className={styles.grid}>
          <button className={styles.option}>
            <svg><use href="/icons/sprite.svg#icon-ac" /></svg>
            AC
          </button>
          <button className={styles.option}>
            <svg><use href="/icons/sprite.svg#icon-automatic" /></svg>
            Automatic
          </button>
          <button className={styles.option}>
            <svg><use href="/icons/sprite.svg#icon-kitchen" /></svg>
            Kitchen
          </button>
          <button className={styles.option}>
            <svg><use href="/icons/sprite.svg#icon-tv" /></svg>
            TV
          </button>
          <button className={styles.option}>
            <svg><use href="/icons/sprite.svg#icon-bathroom" /></svg>
            Bathroom
          </button>
        </div>
      </div>

      <div className={styles.block}>
        <p className={styles.label}>Vehicle type</p>

        <div className={styles.grid}>
          <button className={styles.option}>
            <svg><use href="/icons/sprite.svg#icon-van" /></svg>
            Van
          </button>
          <button className={styles.option}>
            <svg><use href="/icons/sprite.svg#icon-fully" /></svg>
            Fully Integrated
          </button>
          <button className={styles.option}>
            <svg><use href="/icons/sprite.svg#icon-alcove" /></svg>
            Alcove
          </button>
        </div>
      </div>

      <button className={styles.search}>Search</button>
    </aside>
  );
}
