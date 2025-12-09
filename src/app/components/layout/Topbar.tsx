// src/app/components/layout/Topbar.tsx
'use client';

import { useRouter } from 'next/navigation';
import type { Route } from 'next';           // ⬅ importa o tipo Route
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '@/core/hooks/useAuth';
import styles from './Topbar.module.css';

const LOGIN_ROUTE = '/auth/login' as Route;  // ⬅ rota tipada

export default function Topbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push(LOGIN_ROUTE);             // ⬅ usa a rota tipada
    } catch (error) {
      console.error('Erro ao sair:', error);
      alert('Não foi possível encerrar a sessão. Tente novamente.');
    }
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <span className={styles.appTag}>Painel</span>
        <span className={styles.appTitle}>School Management</span>
      </div>

      <div className={styles.right}>
        <div className={styles.userArea}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>
              {user?.displayName || 'Usuário'}
            </span>
            <span className={styles.userEmail}>
              {user?.email || 'Conta autenticada'}
            </span>
          </div>

          <div className={styles.avatar}>
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt={user.displayName || 'Avatar'} />
            ) : (
              <FaUserCircle size={24} />
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            <FaSignOutAlt size={14} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
