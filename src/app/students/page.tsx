// app/students/page.tsx

'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStudents } from "../hooks/useStudents";
import styles from "./StudentsPage.module.css";

export default function StudentsPage() {
  const router = useRouter();
  const { students } = useStudents();
  const [search, setSearch] = useState("");

  // Filtra os alunos pelo termo de busca
  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase();
    return students.filter((s) => s.name.toLowerCase().includes(term));
  }, [students, search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className={styles.pageContainer}>
      <aside className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Alunos</h2>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Digite o nome do aluno..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Buscar
          </button>
        </form>
        <button
          className={`${styles.btn} ${styles.btnSuccess}`}
          onClick={() => router.push("/students/create")}
        >
          Cadastrar Novo Aluno
        </button>
      </aside>

      <main className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Alunos</h2>

        {filteredStudents.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Matrícula</th>
                  <th>Telefone</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.enrollmentNumber || '-'}</td>
                    <td>{student.phone || '-'}</td>
                    <td className={styles.actionsCell}>
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
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={styles.noResults}>Nenhum aluno encontrado.</p>
        )}
      </main>
    </div>
  );
}
