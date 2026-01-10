import CamperCard from '../CamperCard/CamperCard';
import styles from './CampersList.module.css';

export default function CampersList() {
  return (
    <div className={styles.list}>
      <CamperCard />
      <CamperCard />
      <CamperCard />
      <CamperCard />

      <button className={styles.loadMore}>Load more</button>
    </div>
  );
}
