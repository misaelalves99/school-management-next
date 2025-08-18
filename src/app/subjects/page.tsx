// src/app/subjects/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './SubjectsPage.module.css';
import { mockSubjects } from '@/app/mocks/subjects';
import { Subject } from '../types/Subject';

const pageSize = 2;

export default function SubjectsIndexPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered: Subject[] = mockSubjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated: Subject[] = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Disciplinas</h2>
        <form onSubmit={(e) => e.preventDefault()} className={styles.searchForm}>
          <input
            type="text"
            value={search}
            placeholder="Digite o nome ou descrição..."
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <button className={`${styles.btn} ${styles.btnPrimary}`}>Buscar</button>
        </form>

        <Link href="/subjects/create" className={`${styles.btn} ${styles.btnSuccess}`}>
          Cadastrar Nova Disciplina
        </Link>
      </div>

      <div className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Disciplinas</h2>
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
            {paginated.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.name}</td>
                <td>{subject.description}</td>
                <td>{subject.workloadHours}</td>
                <td>
                  <Link href={`/subjects/details/${subject.id}`} className={`${styles.btn} ${styles.btnInfo}`}>Detalhes</Link>
                  <Link href={`/subjects/edit/${subject.id}`} className={`${styles.btn} ${styles.btnWarning}`}>Editar</Link>
                  <Link href={`/subjects/delete/${subject.id}`} className={`${styles.btn} ${styles.btnDanger}`}>Excluir</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          {page > 1 && (
            <button onClick={() => setPage(page - 1)} className={styles.pageLink}>
              Anterior
            </button>
          )}
          <span className={styles.pageInfo}>Página {page} de {totalPages}</span>
          {page < totalPages && (
            <button onClick={() => setPage(page + 1)} className={styles.pageLink}>
              Próxima
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
