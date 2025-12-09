// src/app/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaDoorOpen,
  FaClipboardList,
  FaLock,
} from 'react-icons/fa';

import styles from './Sidebar.module.css';

type NavItem = {
  label: string;
  href: Route;
  icon: React.ComponentType<{ size?: number }>;
};

const PRIMARY_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/' as Route, icon: FaHome },
  { label: 'Alunos', href: '/students' as Route, icon: FaUserGraduate },
  { label: 'Professores', href: '/teachers' as Route, icon: FaChalkboardTeacher },
  { label: 'Disciplinas', href: '/subjects' as Route, icon: FaBookOpen },
  { label: 'Salas de aula', href: '/classrooms' as Route, icon: FaDoorOpen },
  { label: 'Matrículas', href: '/enrollments' as Route, icon: FaClipboardList },
];

const SECONDARY_ITEMS: NavItem[] = [
  {
    label: 'Política de Privacidade',
    href: '/privacy-policy' as Route,
    icon: FaLock,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isRouteActive = (href: Route) => {
    if (href === '/') return pathname === '/';
    // pathname continua sendo string, então só comparamos como string
    return pathname.startsWith(href as string);
  };

  const sidebarClassName = useMemo(
    () =>
      [
        styles.sidebar,
        collapsed ? styles.sidebarCollapsed : '',
        'dashboard-sidebar',
      ]
        .filter(Boolean)
        .join(' '),
    [collapsed]
  );

  return (
    <aside className={sidebarClassName}>
      {/* Logo + botão de colapso */}
      <div className={styles.header}>
        <Link href={'/' as Route} className={styles.logo}>
          <span className={styles.logoMark}>SM</span>
          {!collapsed && (
            <div className={styles.logoTextWrapper}>
              <span className={styles.logoTitle}>School Manager</span>
              <span className={styles.logoSubtitle}>Painel administrativo</span>
            </div>
          )}
        </Link>

        <button
          type="button"
          className={styles.collapseButton}
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <span className={styles.collapseBar} />
          <span className={styles.collapseBar} />
        </button>
      </div>

      {/* Navegação principal */}
      <nav className={styles.nav}>
        <span className={styles.sectionLabel}>
          {!collapsed ? 'Principal' : '•'}
        </span>
        <ul className={styles.navList}>
          {PRIMARY_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isRouteActive(item.href);

            return (
              <li key={item.href} className={styles.navItem}>
                <Link
                  href={item.href}
                  className={[
                    styles.navLink,
                    active ? styles.navLinkActive : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className={styles.navIcon}>
                    <Icon size={18} />
                  </span>
                  {!collapsed && (
                    <span className={styles.navLabel}>{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Navegação secundária */}
      <nav className={styles.nav}>
        <span className={styles.sectionLabel}>
          {!collapsed ? 'Institucional' : '•'}
        </span>
        <ul className={styles.navList}>
          {SECONDARY_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isRouteActive(item.href);

            return (
              <li key={item.href} className={styles.navItem}>
                <Link
                  href={item.href}
                  className={[
                    styles.navLink,
                    active ? styles.navLinkActive : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className={styles.navIcon}>
                    <Icon size={18} />
                  </span>
                  {!collapsed && (
                    <span className={styles.navLabel}>{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Rodapé do sidebar */}
      <footer className={styles.footer}>
        {!collapsed ? (
          <>
            <span className={styles.footerTitle}>School Management</span>
            <span className={styles.footerText}>
              v1.0 • Ambiente de demonstração
            </span>
          </>
        ) : (
          <span className={styles.footerDot} />
        )}
      </footer>
    </aside>
  );
}
