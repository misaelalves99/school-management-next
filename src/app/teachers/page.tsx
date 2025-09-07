// src/app/teachers/page.tsx

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTeachers } from "../hooks/useTeachers";
import styles from "./TeachersPage.module.css";

export default function TeachersPage() {
  const router = useRouter();
  const { teachers } = useTeachers();
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra os professores pelo nome ou disciplina
  const filteredTeachers = useMemo(() => {
    if (!searchTerm.trim()) return teachers;
    const term = searchTerm.toLowerCase();
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(term) ||
        t.subject.toLowerCase().includes(term)
    );
  }, [searchTerm, teachers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className={styles.pageContainer}>
      <aside className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Professores</h2>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
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

        {filteredTeachers.length > 0 ? (
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
                {filteredTeachers.map((t) => (
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
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={styles.noResults}>Nenhum professor encontrado.</p>
        )}
      </main>
    </div>
  );
}
