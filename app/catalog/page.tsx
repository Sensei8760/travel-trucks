import Filters from '@/components/Filters/Filters';
import CampersList from '@/components/CampersList/CampersList';
import styles from './CatalogPage.module.css';

export default function CatalogPage() {
  return (
    <section className={styles.catalog}>
      <div className={styles.layout}>
        <Filters />
        <CampersList />
      </div>
    </section>
  );
}
