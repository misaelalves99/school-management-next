// app/components/Navbar/Navbar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '@/app/hooks/useAuth';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const toggleProfile = () => setProfileOpen(prev => !prev);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const isActive = (path: string) => pathname === path;

  // Fecha o dropdown de perfil ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo */}
        <Link href="/" className={styles.navbarBrand}>
          <span className={styles.logoText}>Minha Escola</span>
        </Link>

        {/* Menu + Perfil wrapper */}
        <div className={styles.navbarMenuWrapper}>
          {/* Menu Links */}
          <ul className={`${styles.navbarMenu} ${menuOpen ? styles.active : ''}`}>
            {[
              { path: '/', label: 'Início' },
              { path: '/students', label: 'Alunos' },
              { path: '/teachers', label: 'Professores' },
              { path: '/subjects', label: 'Disciplinas' },
              { path: '/classrooms', label: 'Salas' },
              { path: '/enrollments', label: 'Matrículas' }
            ].map(link => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={isActive(link.path) ? styles.activeLink : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Toggle Mobile */}
          <button
            className={styles.navbarToggle}
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            ☰
          </button>

          {/* Perfil */}
          <div className={styles.profileWrapper} ref={profileRef}>
            <button
              className={styles.profileBtn}
              onClick={toggleProfile}
              aria-label="Abrir menu de perfil"
            >
              <FaUserCircle size={28} />
            </button>

            {profileOpen && (
              <div className={styles.profileMenu}>
                <button onClick={handleLogout} className={styles.profileMenuItem}>
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
