// src/app/teachers/page.tsx

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTeachers } from "../hooks/useTeachers";
import styles from "./TeachersPage.module.css";

const PAGE_SIZE = 10;

export default function TeachersPage() {
  const router = useRouter();
  const { teachers } = useTeachers();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTeachers = useMemo(() => {
    if (!searchTerm.trim()) return teachers;
    const term = searchTerm.toLowerCase();
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(term) ||
        t.subject.toLowerCase().includes(term)
    );
  }, [searchTerm, teachers]);

  const totalItems = filteredTeachers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentItems = filteredTeachers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
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
      <aside className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Professores</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToPage(1);
          }}
          className={styles.searchForm}
        >
          <input
            type="text"
            placeholder="Digite o nome ou disciplina..."
            value={searchTerm}
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
        <button
          className={`${styles.btn} ${styles.btnSuccess}`}
          onClick={() => router.push("/teachers/create")}
        >
          Cadastrar Novo Professor
        </button>
      </aside>

      <main className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Professores</h2>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Disciplina</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.noResults}>
                    Nenhum professor encontrado.
                  </td>
                </tr>
              ) : (
                currentItems.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.name}</td>
                    <td>{t.subject}</td>
                    <td className={styles.actionsCell}>
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

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.pageLink}
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
            >
              Próxima
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
