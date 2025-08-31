// src/app/subjects/page.tsx

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './SubjectsPage.module.css';
import { useSubjects } from '../hooks/useSubjects';

const PAGE_SIZE = 10;

export default function SubjectsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { subjects } = useSubjects();

  // filtra usando memo para otimização
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return subjects.filter(
      s =>
        s.name.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
    );
  }, [subjects, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Disciplinas</h2>
        <form onSubmit={(e) => e.preventDefault()} className={styles.searchForm}>
          <input
            type="text"
            value={search}
            placeholder="Digite o nome ou descrição..."
            onChange={handleSearchChange}
            className={styles.input}
          />
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            Buscar
          </button>
        </form>

        <Link
          href="/subjects/create"
          className={`${styles.btn} ${styles.btnSuccess}`}
        >
          Cadastrar Nova Disciplina
        </Link>
      </div>

      <div className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Disciplinas</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Carga Horária</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{ textAlign: 'center', padding: '20px' }}
                  >
                    Nenhuma disciplina encontrada.
                  </td>
                </tr>
              ) : (
                paginated.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.name}</td>
                    <td>{subject.description}</td>
                    <td>{subject.workloadHours}</td>
                    <td className={styles.actionsCell}>
                      <Link
                        href={`/subjects/details/${subject.id}`}
                        className={`${styles.btn} ${styles.btnInfo}`}
                      >
                        Detalhes
                      </Link>
                      <Link
                        href={`/subjects/edit/${subject.id}`}
                        className={`${styles.btn} ${styles.btnWarning}`}
                      >
                        Editar
                      </Link>
                      <Link
                        href={`/subjects/delete/${subject.id}`}
                        className={`${styles.btn} ${styles.btnDanger}`}
                      >
                        Excluir
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className={styles.pageLink}
            >
              Anterior
            </button>
            <span className={styles.pageInfo}>
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className={styles.pageLink}
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
