import type { Camper } from '@/types/camper';
import styles from './FeaturesTab.module.css';

type Props = {
  camper: Camper;
};

type Badge = {
  key: string;
  label: string;
  iconId: string;
};

function toTitle(s?: string) {
  if (!s) return '';
  const str = String(s).toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatForm(form?: string) {
  if (!form) return '';
  if (form === 'panelTruck') return 'Panel truck';
  if (form === 'fullyIntegrated') return 'Fully integrated';
  if (form === 'alcove') return 'Alcove';
  return toTitle(form);
}

function withSpaceUnit(value?: string) {
  if (!value) return '';
  // 5.4m -> 5.4 m ; 132l -> 132 l
  return value.replace(/(\d)([a-zA-Z])/g, '$1 $2');
}

export default function FeaturesTab({ camper }: Props) {
  const badges: Badge[] = [];

  if (camper.transmission) {
    badges.push({
      key: 'transmission',
      label: camper.transmission === 'automatic' ? 'Automatic' : toTitle(camper.transmission),
      iconId: 'icon-diagram',
    });
  }

  if (camper.AC) badges.push({ key: 'AC', label: 'AC', iconId: 'icon-wind' });
  if (camper.engine) badges.push({ key: 'engine', label: toTitle(camper.engine), iconId: 'icon-fuel-pump' });
  if (camper.kitchen) badges.push({ key: 'kitchen', label: 'Kitchen', iconId: 'icon-cup-hot' });
  if (camper.radio) badges.push({ key: 'radio', label: 'Radio', iconId: 'icon-ui-radios' });

  // (якщо захочеш — легко додати інші, але на скріні зараз ці)

  return (
    <div className={styles.card}>
      <ul className={styles.badges}>
        {badges.map((b) => (
          <li key={b.key} className={styles.badge}>
            <svg className={styles.badgeIcon} aria-hidden="true">
              <use href={`/icons/sprite.svg#${b.iconId}`} />
            </svg>
            <span className={styles.badgeText}>{b.label}</span>
          </li>
        ))}
      </ul>

      <h3 className={styles.detailsTitle}>Vehicle details</h3>
      <div className={styles.divider} />

      <dl className={styles.details}>
        <div className={styles.row}>
          <dt>Form</dt>
          <dd>{formatForm(camper.form)}</dd>
        </div>

        <div className={styles.row}>
          <dt>Length</dt>
          <dd>{withSpaceUnit(camper.length)}</dd>
        </div>

        <div className={styles.row}>
          <dt>Width</dt>
          <dd>{withSpaceUnit(camper.width)}</dd>
        </div>

        <div className={styles.row}>
          <dt>Height</dt>
          <dd>{withSpaceUnit(camper.height)}</dd>
        </div>

        <div className={styles.row}>
          <dt>Tank</dt>
          <dd>{withSpaceUnit(camper.tank)}</dd>
        </div>

        <div className={styles.row}>
          <dt>Consumption</dt>
          <dd>{camper.consumption}</dd>
        </div>
      </dl>
    </div>
  );
}
