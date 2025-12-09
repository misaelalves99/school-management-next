// src/app/(dashboard)/layout.tsx

'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';               // ⬅ importa Route
import { useAuth } from '@/core/hooks/useAuth';

import Topbar from '../components/layout/Topbar';
import Sidebar from '../components/layout/Sidebar';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: ReactNode;
}

const LOGIN_ROUTE = '/auth/login' as Route;      // ⬅ mesma constante aqui

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(LOGIN_ROUTE);              // ⬅ usa a rota tipada
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className={styles.loadingRoot}>
        <div className={styles.loadingBox}>
          <div className={styles.loadingSpinner} />
          <span className={styles.loadingText}>
            Carregando painel da escola...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.dashboardRoot}>
      <Sidebar />

      <div className={styles.mainColumn}>
        <Topbar />

        <div className={styles.contentScroll}>
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </div>
  );
}
