// src/app/students/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './StudentsPage.module.css';

import { mockStudents } from '../mocks/students';
import type { Student } from '../types/Student';

export default function StudentsIndexPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const filtered = mockStudents.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);
    setStudents(paginated);
    setTotalPages(Math.ceil(filtered.length / pageSize));
  }, [search, page]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Alunos</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            setPage(1);
          }}
          className={styles.searchForm}
        >
          <input
            type="text"
            placeholder="Digite o nome..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Buscar
          </button>
        </form>
        <Link href="/students/create" className={`${styles.btn} ${styles.btnSuccess}`}>
          Cadastrar Novo Aluno
        </Link>
      </div>

      <div className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Alunos</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Matrícula</th>
              <th>Telefone</th>
              <th>Endereço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.enrollmentNumber}</td>
                <td>{student.phone || '-'}</td>
                <td>{student.address || '-'}</td>
                <td>
                  <Link href={`/students/details/${student.id}`} className={`${styles.btn} ${styles.btnInfo}`}>Detalhes</Link>
                  <Link href={`/students/edit/${student.id}`} className={`${styles.btn} ${styles.btnWarning}`}>Editar</Link>
                  <Link href={`/students/delete/${student.id}`} className={`${styles.btn} ${styles.btnDanger}`}>Excluir</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          {page > 1 && (
            <button className={styles.pageLink} onClick={() => setPage(p => p - 1)}>Anterior</button>
          )}
          <span className={styles.pageInfo}>Página {page} de {totalPages}</span>
          {page < totalPages && (
            <button className={styles.pageLink} onClick={() => setPage(p => p + 1)}>Próxima</button>
          )}
        </div>
      </div>
    </div>
  );
}
