import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoDark}>Travel</span>
          <span className={styles.logoLight}>Trucks</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>
            Home
          </Link>
          <Link href="/catalog" className={styles.link}>
            Catalog
          </Link>
        </nav>
      </div>
    </header>
  );
}
