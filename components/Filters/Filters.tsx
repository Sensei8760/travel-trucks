'use client';

import { useMemo, useState } from 'react';
import styles from './Filters.module.css';
import {
  useFiltersStore,
  type EquipmentKey,
  type VehicleType,
} from '@/store/filtersStore';
import { useCampersStore } from '@/store/campersStore';

const COUNTRY = 'Ukraine';
const STORE_PREFIX = `${COUNTRY}, `; // "Ukraine, "
const DISPLAY_SUFFIX = `, ${COUNTRY}`; // ", Ukraine"

const cleanSpaces = (s: string) => s.replace(/\s+/g, ' ').trim();

const capitalizeFirst = (s: string) => {
  const v = cleanSpaces(s);
  if (!v) return '';
  return v.charAt(0).toUpperCase() + v.slice(1);
};

// дістає місто з будь-якого формату: "Ukraine, Kyiv" або "Kyiv, Ukraine" або "Kyiv"
const extractCity = (raw: string) => {
  const s = cleanSpaces(raw);
  if (!s) return '';

  const lower = s.toLowerCase();

  // "Ukraine, Kyiv"
  if (lower.startsWith(STORE_PREFIX.toLowerCase())) {
    return cleanSpaces(s.slice(STORE_PREFIX.length));
  }

  // "Kyiv, Ukraine"
  if (lower.endsWith(DISPLAY_SUFFIX.toLowerCase())) {
    return cleanSpaces(s.slice(0, s.length - DISPLAY_SUFFIX.length));
  }

  // "Kyiv, something" -> беремо першу частину
  if (s.includes(',')) return cleanSpaces(s.split(',')[0]);

  return s;
};

const toStoreLocation = (input: string) => {
  const city = capitalizeFirst(extractCity(input));
  if (!city) return '';
  return `${STORE_PREFIX}${city}`; // "Ukraine, Kyiv"
};

const toDisplayLocation = (storeLocation: string) => {
  const city = capitalizeFirst(extractCity(storeLocation));
  if (!city) return '';
  return `${city}${DISPLAY_SUFFIX}`; // "Kyiv, Ukraine"
};

export default function Filters() {
  const {
    location,
    setLocation,
    equipment,
    toggleEquipment,
    vehicleType,
    setVehicleType,
  } = useFiltersStore();

  const getCampers = useCampersStore((s) => s.getCampers);

  const isActiveEquipment = (key: EquipmentKey) => equipment[key];
  const isActiveType = (type: VehicleType) => vehicleType === type;

  const [isLocFocused, setIsLocFocused] = useState(false);
  const [cityDraft, setCityDraft] = useState('');

  const displayValue = useMemo(() => {
    if (isLocFocused) return cityDraft; // тільки місто
    return toDisplayLocation(location); // "Kyiv, Ukraine"
  }, [isLocFocused, cityDraft, location]);

  const handleLocationFocus = () => {
    setIsLocFocused(true);
    setCityDraft(extractCity(location)); // показуємо тільки місто
  };

  const handleLocationBlur = () => {
    setIsLocFocused(false);

    // нормалізуємо значення та фіксуємо store у форматі бекенду
    const storeValue = toStoreLocation(cityDraft);
    setCityDraft(extractCity(storeValue)); // лишаємо тільки місто
    setLocation(storeValue);
  };

  const handleLocationChange = (value: string) => {
    const city = capitalizeFirst(extractCity(value));
    setCityDraft(city);

    // одразу тримаємо store у форматі бекенду (для коректної фільтрації)
    setLocation(city ? `${STORE_PREFIX}${city}` : '');
  };

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
            value={displayValue}
            onFocus={handleLocationFocus}
            onBlur={handleLocationBlur}
            onChange={(e) => handleLocationChange(e.target.value)}
            placeholder="City"
            autoComplete="off"
          />
        </div>
      </div>

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
            className={`${styles.option} ${
              isActiveType('van') ? styles.active : ''
            }`}
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
              setVehicleType(
                isActiveType('fullyIntegrated') ? null : 'fullyIntegrated'
              )
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
            onClick={() =>
              setVehicleType(isActiveType('alcove') ? null : 'alcove')
            }
          >
            <svg aria-hidden="true">
              <use href="/icons/sprite.svg#icon-bi_grid-3x3-gap" />
            </svg>
            <span>Alcove</span>
          </button>
        </div>
      </div>

      <button type="button" className={styles.search} onClick={() => getCampers(true)}>
        Search
      </button>
    </aside>
  );
}