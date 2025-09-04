// src/app/classrooms/page.test.tsx

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useClassRooms } from '../hooks/useClassRooms';
import type { ClassRoom } from '../types/Classroom';
import styles from './ClassRoomList.module.css';

const PAGE_SIZE = 10;

export default function ClassroomsPage() {
  const { classRooms } = useClassRooms();
  const [searchString, setSearchString] = useState('');
  const [page, setPage] = useState(1);

  const filteredData: ClassRoom[] = useMemo(() => {
    const term = searchString.toLowerCase();
    return classRooms.filter((c: ClassRoom) =>
      c.name.toLowerCase().includes(term) ||
      c.schedule.toLowerCase().includes(term) ||
      c.capacity.toString().includes(term)
    );
  }, [searchString, classRooms]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const pagedData: ClassRoom[] = filteredData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
    setPage(1);
  };

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className={styles.pageContainer}>
      <aside className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Salas</h2>
        <form onSubmit={e => e.preventDefault()} className={styles.searchForm}>
          <input
            type="text"
            value={searchString}
            onChange={handleSearchChange}
            placeholder="Digite nome, horário ou capacidade..."
            className={styles.input}
          />
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Buscar
          </button>
        </form>

        <Link href="/classrooms/create" className={`${styles.btn} ${styles.btnSuccess}`}>
          Cadastrar Nova Sala
        </Link>
      </aside>

      <main className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Salas</h2>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Capacidade</th>
                <th>Horário</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.noResults}>
                    Nenhuma sala encontrada.
                  </td>
                </tr>
              ) : (
                pagedData.map((room: ClassRoom) => (
                  <tr key={room.id}>
                    <td>{room.name}</td>
                    <td>{room.capacity}</td>
                    <td>{room.schedule}</td>
                    <td className={styles.actionsCell}>
                      <Link
                        href={`/classrooms/details/${room.id}`}
                        className={`${styles.btn} ${styles.btnInfo}`}
                      >
                        Detalhes
                      </Link>
                      <Link
                        href={`/classrooms/edit/${room.id}`}
                        className={`${styles.btn} ${styles.btnWarning}`}
                      >
                        Editar
                      </Link>
                      <Link
                        href={`/classrooms/delete/${room.id}`}
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
      </main>
    </div>
  );
}
