// src/app/subjects/page.tsx

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './SubjectsPage.module.css';
import { useSubjects } from '../hooks/useSubjects';
import type { Subject } from '../types/Subject';

export default function SubjectsIndexPage() {
  const { subjects } = useSubjects();
  const [search, setSearch] = useState('');

  const filtered: Subject[] = useMemo(() => {
    const term = search.toLowerCase();
    return subjects.filter(
      s =>
        s.name.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
    );
  }, [search, subjects]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Disciplinas</h2>
        <form onSubmit={(e) => e.preventDefault()} className={styles.searchForm}>
          <input
            type="text"
            value={search}
            placeholder="Digite o nome ou descrição..."
            onChange={(e) => setSearch(e.target.value)}
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhuma disciplina encontrada.
                </td>
              </tr>
            ) : (
              filtered.map((subject) => (
                <tr key={subject.id}>
                  <td>{subject.name}</td>
                  <td>{subject.description}</td>
                  <td>{subject.workloadHours}</td>
                  <td>
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
    </div>
  );
}
