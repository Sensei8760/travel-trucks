import Filters from '@/components/Filters/Filters';
import CampersList from '@/components/CampersList/CampersList';
import styles from './CatalogPage.module.css';

export default function CatalogPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <Filters />
        </aside>

        <section className={styles.content}>
          <CampersList />
        </section>
      </div>
    </main>
  );
}
