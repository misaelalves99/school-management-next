// src/app/enrollments/page.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import styles from './EnrollmentsPage.module.css';

import type { Enrollment } from '../types/Enrollment';
import mockEnrollments from '../mocks/enrollments';
import mockStudents from '../mocks/students';
import mockClassRooms from '../mocks/classRooms';

const PAGE_SIZE = 2;

export default function EnrollmentsPage() {
  const [searchString, setSearchString] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    let filtered: Enrollment[] = mockEnrollments;

    if (searchString) {
      const lowerSearch = searchString.toLowerCase();
      filtered = filtered.filter((e) => e.status.toLowerCase().includes(lowerSearch));
    }

    setFilteredEnrollments(filtered);
    setCurrentPage(1);
  }, [searchString]);

  const totalPages = useMemo(
    () => Math.ceil(filteredEnrollments.length / PAGE_SIZE),
    [filteredEnrollments]
  );

  const paginatedEnrollments = useMemo(
    () =>
      filteredEnrollments.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [filteredEnrollments, currentPage]
  );

  const getStudentName = (id: number) =>
    mockStudents.find((s) => s.id === id)?.name ?? 'Aluno não informado';
  const getClassRoomName = (id: number) =>
    mockClassRooms.find((c) => c.id === id)?.name ?? 'Turma não informada';

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Matrículas</h2>
        <input
          type="text"
          value={searchString}
          placeholder="Buscar Matrícula ou Status..."
          onChange={(e) => setSearchString(e.target.value)}
        />
        <Link href="/enrollments/create" className={`${styles.btn} ${styles.btnSuccess}`}>
          Cadastrar Nova Matrícula
        </Link>
      </div>

      <div className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Matrículas</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Turma</th>
              <th>Status</th>
              <th>Data da Matrícula</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEnrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td>{getStudentName(enrollment.studentId)}</td>
                <td>{getClassRoomName(enrollment.classRoomId)}</td>
                <td>{enrollment.status}</td>
                <td>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
                <td>
                  <Link href={`/enrollments/details/${enrollment.id}`} className={`${styles.btn} ${styles.btnInfo}`}>
                    Detalhes
                  </Link>{' '}
                  <Link href={`/enrollments/edit/${enrollment.id}`} className={`${styles.btn} ${styles.btnWarning}`}>
                    Editar
                  </Link>{' '}
                  <Link href={`/enrollments/delete/${enrollment.id}`} className={`${styles.btn} ${styles.btnDanger}`}>
                    Excluir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          {currentPage > 1 && (
            <button onClick={() => setCurrentPage(currentPage - 1)} className={styles.pageLink}>
              Anterior
            </button>
          )}
          <span className={styles.pageInfo}>
            Página {currentPage} de {totalPages}
          </span>
          {currentPage < totalPages && (
            <button onClick={() => setCurrentPage(currentPage + 1)} className={styles.pageLink}>
              Próxima
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
