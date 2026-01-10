'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import clsx from 'clsx';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoDark}>Travel</span>
          <span className={styles.logoLight}>Trucks</span>
        </Link>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Link
            href="/"
            className={clsx(
              styles.link,
              pathname === '/' && styles.active
            )}
          >
            Home
          </Link>
          <Link
            href="/catalog"
            className={clsx(
              styles.link,
              pathname.startsWith('/catalog') && styles.active
            )}
          >
            Catalog
          </Link>
        </nav>
      </div>
    </header>
  );
}
