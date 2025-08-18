// src/app/teachers/page.tsx

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './TeachersPage.module.css';
import { getTeachers, Teacher } from '../mocks/teachers';

const PAGE_SIZE = 2;

export default function TeachersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const allTeachers = getTeachers();

  const filteredTeachers = useMemo(() => {
    if (!searchTerm.trim()) return allTeachers;
    const term = searchTerm.toLowerCase();
    return allTeachers.filter(
      t => t.name.toLowerCase().includes(term) || t.subject.toLowerCase().includes(term),
    );
  }, [searchTerm, allTeachers]);

  const totalItems = filteredTeachers.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const currentItems = filteredTeachers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Professores</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            goToPage(1);
          }}
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
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum professor encontrado.
                </td>
              </tr>
            ) : (
              currentItems.map((teacher: Teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.subject}</td>
                  <td>
                    <button
                      className={`${styles.btn} ${styles.btnInfo}`}
                      onClick={() => router.push(`/teachers/details/${teacher.id}`)}
                    >
                      Detalhes
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnWarning}`}
                      onClick={() => router.push(`/teachers/edit/${teacher.id}`)}
                    >
                      Editar
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnDanger}`}
                      onClick={() => router.push(`/teachers/delete/${teacher.id}`)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.pageLink}
            aria-label="Página anterior"
          >
            Anterior
          </button>

          <span className={styles.pageInfo}>
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.pageLink}
            aria-label="Próxima página"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
