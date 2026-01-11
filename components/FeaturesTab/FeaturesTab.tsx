import styles from './FeaturesTab.module.css';
import cardStyles from '../CamperCard/CamperCard.module.css';
import type { Camper } from '@/types/camper';

type Props = {
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

const FORM_LABELS: Record<string, string> = {
  panelTruck: 'Panel truck',
  fullyIntegrated: 'Fully integrated',
  alcove: 'Alcove',
};

// ✅ 1:1 як у CamperCard
const MIXED_ICON_IDS = new Set<string>([]);
const FORCE_OUTLINE_ICON_IDS = new Set<string>([
  'icon-lucide_microwave',
  'icon-hugeicons_gas-stove',
  'icon-ion_water-outline',
]);

export default function FeaturesTab({ camper }: Props) {
  const badges: Badge[] = [
    camper.transmission
      ? {
          key: 'transmission',
          label:
            camper.transmission.toLowerCase() === 'automatic'
              ? 'Automatic'
              : toTitle(camper.transmission),
          iconId: 'icon-diagram',
        }
      : null,

    camper.AC ? { key: 'AC', label: 'AC', iconId: 'icon-wind' } : null,

    camper.engine
      ? { key: 'engine', label: toTitle(camper.engine), iconId: 'icon-fuel-pump' }
      : null,

    camper.kitchen ? { key: 'kitchen', label: 'Kitchen', iconId: 'icon-cup-hot' } : null,
    camper.radio ? { key: 'radio', label: 'Radio', iconId: 'icon-ui-radios' } : null,
    camper.bathroom ? { key: 'bathroom', label: 'Bathroom', iconId: 'icon-ph_shower' } : null,

    camper.refrigerator
      ? { key: 'refrigerator', label: 'Refrigerator', iconId: 'icon-solar_fridge-outline' }
      : null,

    camper.microwave
      ? { key: 'microwave', label: 'Microwave', iconId: 'icon-lucide_microwave' }
      : null,

    camper.gas ? { key: 'gas', label: 'Gas', iconId: 'icon-hugeicons_gas-stove' } : null,

    camper.water
      ? { key: 'water', label: 'Water', iconId: 'icon-ion_water-outline' }
      : null,

    camper.TV ? { key: 'TV', label: 'TV', iconId: 'icon-tv' } : null,
  ].filter(Boolean) as Badge[];

  const details = [
    { key: 'form', label: 'Form', value: FORM_LABELS[camper.form ?? ''] ?? camper.form ?? '' },
    { key: 'length', label: 'Length', value: camper.length },
    { key: 'width', label: 'Width', value: camper.width },
    { key: 'height', label: 'Height', value: camper.height },
    { key: 'tank', label: 'Tank', value: camper.tank },
    { key: 'consumption', label: 'Consumption', value: camper.consumption },
  ].filter((d) => Boolean(d.value));

  return (
    <div className={styles.card}>
      <ul className={cardStyles.badges} aria-label="Camper features">
        {badges.map((b) => {
          const modeClass = MIXED_ICON_IDS.has(b.iconId)
            ? cardStyles.badgeIconMixed
            : cardStyles.badgeIconOutline;

          const finalIconClass = FORCE_OUTLINE_ICON_IDS.has(b.iconId)
            ? cardStyles.badgeIconForceOutline
            : modeClass;

          return (
            <li key={b.key} className={cardStyles.badge}>
              <svg className={`${cardStyles.badgeIcon} ${finalIconClass}`} aria-hidden="true">
                <use href={`/icons/sprite.svg#${b.iconId}`} />
              </svg>
              <span>{b.label}</span>
            </li>
          );
        })}
      </ul>

      <h3 className={styles.detailsTitle}>Vehicle details</h3>
      <div className={styles.line} />

      <dl className={styles.details}>
        {details.map((d) => (
          <div key={d.key} className={styles.detailsRow}>
            <dt className={styles.detailsKey}>{d.label}</dt>
            <dd className={styles.detailsValue}>{d.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}