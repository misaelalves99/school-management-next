// src/app/teachers/page.tsx

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './TeachersPage.module.css';
import { useTeachers } from '../hooks/useTeachers';

export default function TeachersPage() {
  const router = useRouter();
  const { teachers } = useTeachers(); // pega a lista do contexto
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeachers = useMemo(() => {
    if (!searchTerm.trim()) return teachers;
    const term = searchTerm.toLowerCase();
    return teachers.filter(
      t => t.name.toLowerCase().includes(term) || t.subject.toLowerCase().includes(term),
    );
  }, [searchTerm, teachers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Professores</h2>
        <form
          onSubmit={e => e.preventDefault()}
          className={styles.searchForm}
          role="search"
          aria-label="Buscar professores"
        >
          <input
            type="text"
            name="searchString"
            placeholder="Digite o nome ou disciplina..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
            aria-label="Campo de busca de professores"
          />
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Buscar
          </button>
        </form>

        <button
          className={`${styles.btn} ${styles.btnSuccess}`}
          onClick={() => router.push('/teachers/create')}
        >
          Cadastrar Novo Professor
        </button>
      </div>

      <div className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Professores</h2>

        <table className={styles.table} aria-label="Lista de professores">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Disciplina</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum professor encontrado.
                </td>
              </tr>
            ) : (
              filteredTeachers.map(t => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.email}</td>
                  <td>{t.subject}</td>
                  <td>
                    <button
                      className={`${styles.btn} ${styles.btnInfo}`}
                      onClick={() => router.push(`/teachers/details/${t.id}`)}
                    >
                      Detalhes
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnWarning}`}
                      onClick={() => router.push(`/teachers/edit/${t.id}`)}
                    >
                      Editar
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnDanger}`}
                      onClick={() => router.push(`/teachers/delete/${t.id}`)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
