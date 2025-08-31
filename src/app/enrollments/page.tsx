// src/app/enrollments/page.tsx

"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./EnrollmentsPage.module.css";
import { useEnrollments } from "../hooks/useEnrollments";
import { useStudents } from "../hooks/useStudents";
import { useClassRooms } from "../hooks/useClassRooms";
import type { EnrollmentWithNames } from "../types/Enrollment";

const PAGE_SIZE = 10;

export default function EnrollmentIndexPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchString, setSearchString] = useState(
    searchParams.get("searchString") || ""
  );
  const currentPage = Number(searchParams.get("page") || "1");

  const { enrollments } = useEnrollments();
  const { students = [] } = useStudents();
  const { classRooms = [] } = useClassRooms();

  const [data, setData] = useState<{
    items: EnrollmentWithNames[];
    currentPage: number;
    totalItems: number;
  }>({ items: [], currentPage, totalItems: 0 });

  const mapToWithNames = useCallback(
    (enrollment: (typeof enrollments)[number]): EnrollmentWithNames => {
      const student = students.find((s) => s.id === enrollment.studentId);
      const classRoom = classRooms.find((c) => c.id === enrollment.classRoomId);
      return {
        ...enrollment,
        studentName: student?.name ?? "Aluno não informado",
        classRoomName: classRoom?.name ?? "Turma não informada",
      };
    },
    [students, classRooms]
  );

  const loadData = useCallback(() => {
    const filtered = enrollments.filter((e) =>
      searchString
        ? e.status.toLowerCase().includes(searchString.toLowerCase())
        : true
    );

    const start = (currentPage - 1) * PAGE_SIZE;
    const paginated = filtered.slice(start, start + PAGE_SIZE);
    const itemsWithNames = paginated.map(mapToWithNames);

    setData({
      items: itemsWithNames,
      currentPage,
      totalItems: filtered.length,
    });
  }, [enrollments, searchString, currentPage, mapToWithNames]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(data.totalItems / PAGE_SIZE)),
    [data.totalItems]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchString(value);
    router.push(`?searchString=${value}&page=1`);
  };

  return (
    <div className={styles.pageContainer}>
      <aside className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Matrículas</h2>
        <form
          className={styles.searchForm}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={searchString}
            placeholder="Buscar Matrícula ou Status..."
            onChange={handleSearchChange}
            className={styles.input}
          />
          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            Buscar
          </button>
        </form>

        <Link
          href="/enrollments/create"
          className={`${styles.btn} ${styles.btnSuccess}`}
        >
          Cadastrar Nova Matrícula
        </Link>
      </aside>

      <main className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Matrículas</h2>

        <div className={styles.tableWrapper}>
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
              {data.items.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.noResults}>
                    Nenhuma matrícula encontrada.
                  </td>
                </tr>
              ) : (
                data.items.map((e) => (
                  <tr key={e.id}>
                    <td>{e.studentName}</td>
                    <td>{e.classRoomName}</td>
                    <td>{e.status}</td>
                    <td>
                      {new Date(e.enrollmentDate).toLocaleDateString()}
                    </td>
                    <td className={styles.actionsCell}>
                      <Link
                        href={`/enrollments/details/${e.id}`}
                        className={`${styles.btn} ${styles.btnInfo}`}
                      >
                        Detalhes
                      </Link>
                      <Link
                        href={`/enrollments/edit/${e.id}`}
                        className={`${styles.btn} ${styles.btnWarning}`}
                      >
                        Editar
                      </Link>
                      <Link
                        href={`/enrollments/delete/${e.id}`}
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
            <Link
              href={`?page=${Math.max(
                1,
                data.currentPage - 1
              )}&searchString=${searchString}`}
              className={styles.pageLink}
              aria-disabled={data.currentPage === 1}
            >
              Anterior
            </Link>

            <span className={styles.pageInfo}>
              Página {data.currentPage} de {totalPages}
            </span>

            <Link
              href={`?page=${Math.min(
                totalPages,
                data.currentPage + 1
              )}&searchString=${searchString}`}
              className={styles.pageLink}
              aria-disabled={data.currentPage === totalPages}
            >
              Próxima
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
