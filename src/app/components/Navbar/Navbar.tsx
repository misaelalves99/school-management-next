// app/components/Navbar/Navbar.tsx

'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const Navbar: FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarLogo}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoText}>Minha Escola</span>
          </Link>
        </div>
        <ul className={styles.navbarMenu}>
          <li>
            <Link href="/" className={isActive('/') ? styles.active : ''}>
              Início
            </Link>
          </li>
          <li>
            <Link href="/students" className={isActive('/students') ? styles.active : ''}>
              Alunos
            </Link>
          </li>
          <li>
            <Link href="/teachers" className={isActive('/teachers') ? styles.active : ''}>
              Professores
            </Link>
          </li>
          <li>
            <Link href="/subjects" className={isActive('/subjects') ? styles.active : ''}>
              Disciplinas
            </Link>
          </li>
          <li>
            <Link href="/classrooms" className={isActive('/classrooms') ? styles.active : ''}>
              Salas
            </Link>
          </li>
          <li>
            <Link href="/enrollments" className={isActive('/enrollments') ? styles.active : ''}>
              Matrículas
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
