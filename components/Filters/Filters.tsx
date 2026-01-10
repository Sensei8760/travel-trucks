'use client';

import styles from './Filters.module.css';
import { useFiltersStore, type EquipmentKey, type VehicleType } from '@/store/filtersStore';

export default function Filters() {
  const {
    location,
    setLocation,
    equipment,
    toggleEquipment,
    vehicleType,
    setVehicleType,
  } = useFiltersStore();

  const isActiveEquipment = (key: EquipmentKey) => equipment[key];
  const isActiveType = (type: VehicleType) => vehicleType === type;

  return (
    <aside className={styles.filters}>
      {/* Location */}
      <div className={styles.section}>
        <label className={styles.label} htmlFor="location">
          Location
        </label>

        <div
          className={`${styles.locationField} ${
            location.trim() ? styles.filled : ''
          }`}
        >
          <svg className={styles.locationIcon} aria-hidden="true">
            <use href="/icons/sprite.svg#icon-Map" />
          </svg>

          <input
            id="location"
            className={styles.locationInput}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City"
          />
        </div>
      </div>

      {/* Filters title */}
      <p className={styles.filtersTitle}>Filters</p>

      {/* Vehicle equipment */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Vehicle equipment</p>
        <div className={styles.divider} />

        <div className={styles.grid}>
          <button
            type="button"
            className={`${styles.option} ${
              isActiveEquipment('AC') ? styles.active : ''
            }`}
            onClick={() => toggleEquipment('AC')}
          >
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-wind" />
            </svg>
            <span>AC</span>
          </button>

          <button
            type="button"
            className={`${styles.option} ${
              isActiveEquipment('automatic') ? styles.active : ''
            }`}
            onClick={() => toggleEquipment('automatic')}
          >
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-diagram" />
            </svg>
            <span>Automatic</span>
          </button>

          <button
            type="button"
            className={`${styles.option} ${
              isActiveEquipment('kitchen') ? styles.active : ''
            }`}
            onClick={() => toggleEquipment('kitchen')}
          >
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-cup-hot" />
            </svg>
            <span>Kitchen</span>
          </button>

          <button
            type="button"
            className={`${styles.option} ${
              isActiveEquipment('TV') ? styles.active : ''
            }`}
            onClick={() => toggleEquipment('TV')}
          >
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-tv" />
            </svg>
            <span>TV</span>
          </button>

          <button
            type="button"
            className={`${styles.option} ${
              isActiveEquipment('bathroom') ? styles.active : ''
            }`}
            onClick={() => toggleEquipment('bathroom')}
          >
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-ph_shower" />
            </svg>
            <span>Bathroom</span>
          </button>
        </div>
      </div>

      {/* Vehicle type */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Vehicle type</p>
        <div className={styles.divider} />

        <div className={styles.grid}>
          <button
            type="button"
            className={`${styles.option} ${isActiveType('van') ? styles.active : ''}`}
            onClick={() => setVehicleType(isActiveType('van') ? null : 'van')}
          >
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-bi_grid-1x2" />
            </svg>
            <span>Van</span>
          </button>

          <button
            type="button"
            className={`${styles.option} ${
              isActiveType('fullyIntegrated') ? styles.active : ''
            }`}
            onClick={() =>
              setVehicleType(isActiveType('fullyIntegrated') ? null : 'fullyIntegrated')
            }
          >
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-bi_grid" />
            </svg>
            <span>Fully Integrated</span>
          </button>

          <button
            type="button"
            className={`${styles.option} ${
              isActiveType('alcove') ? styles.active : ''
            }`}
            onClick={() => setVehicleType(isActiveType('alcove') ? null : 'alcove')}
          >
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-bi_grid-3x3-gap" />
            </svg>
            <span>Alcove</span>
          </button>
        </div>
      </div>

      <button type="button" className={styles.search}>
        Search
      </button>
    </aside>
  );
}
