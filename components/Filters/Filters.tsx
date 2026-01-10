import styles from './Filters.module.css';

export default function Filters() {
  return (
    <aside className={styles.filters}>
      {/* Location */}
      <div className={styles.section}>
        <label className={styles.label}>Location</label>

        <div className={styles.location}>
          <svg className={styles.icon} aria-hidden="true">
            <use href="/icons/sprite.svg#icon-Map" />
          </svg>
          <span>Kyiv, Ukraine</span>
        </div>
      </div>

      {/* Filters title */}
      <p className={styles.filtersTitle}>Filters</p>

      {/* Vehicle equipment */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Vehicle equipment</p>
        <div className={styles.divider} />

        <div className={styles.grid}>
          <button className={`${styles.option} ${styles.active}`}>
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-wind" />
            </svg>
            AC
          </button>

          <button className={styles.option}>
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-diagram" />
            </svg>
            Automatic
          </button>

          <button className={styles.option}>
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-cup-hot" />
            </svg>
            Kitchen
          </button>

          <button className={styles.option}>
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-tv" />
            </svg>
            TV
          </button>

          <button className={styles.option}>
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-ph_shower" />
            </svg>
            Bathroom
          </button>
        </div>
      </div>

      {/* Vehicle type */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Vehicle type</p>
        <div className={styles.divider} />

        <div className={styles.grid}>
          <button className={styles.option}>
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-bi_grid-1x2" />
            </svg>
            Van
          </button>

          <button className={styles.option}>
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-bi_grid" />
            </svg>
            Fully Integrated
          </button>

          <button className={styles.option}>
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-bi_grid-3x3-gap" />
            </svg>
            Alcove
          </button>
        </div>
      </div>

      <button className={styles.search}>Search</button>
    </aside>
  );
}
