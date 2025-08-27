// src/app/students/page.tsx

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './StudentsPage.module.css';
import { useStudents } from '../hooks/useStudents';

export default function StudentsPage() {
  const router = useRouter();
  const { students } = useStudents(); // pega a lista do Context
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra os alunos com base no searchTerm
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    const term = searchTerm.toLowerCase();
    return students.filter(
      s =>
        s.name.toLowerCase().includes(term) ||
        s.enrollmentNumber.toLowerCase().includes(term) ||
        (s.phone?.toLowerCase().includes(term) ?? false) ||
        (s.address?.toLowerCase().includes(term) ?? false)
    );
  }, [searchTerm, students]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Alunos</h2>
        <form onSubmit={e => e.preventDefault()} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Digite nome, matrícula, telefone ou endereço..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Buscar
          </button>
        </form>
        <button
          className={`${styles.btn} ${styles.btnSuccess}`}
          onClick={() => router.push('/students/create')}
        >
          Cadastrar Novo Aluno
        </button>
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
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum aluno encontrado.
                </td>
              </tr>
            ) : (
              filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.enrollmentNumber}</td>
                  <td>{student.phone || '-'}</td>
                  <td>{student.address || '-'}</td>
                  <td>
                    <button
                      className={`${styles.btn} ${styles.btnInfo}`}
                      onClick={() => router.push(`/students/details/${student.id}`)}
                    >
                      Detalhes
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnWarning}`}
                      onClick={() => router.push(`/students/edit/${student.id}`)}
                    >
                      Editar
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnDanger}`}
                      onClick={() => router.push(`/students/delete/${student.id}`)}
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
