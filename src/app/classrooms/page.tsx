// src/app/classrooms/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ClassRoomList.module.css';
import { useClassRooms } from '@/app/hooks/useClassRooms';

const ClassroomsPage: React.FC = () => {
  const router = useRouter();
  const { classRooms } = useClassRooms();
  const [searchString, setSearchString] = useState('');

  const filteredData = classRooms.filter((c) =>
    c.name.toLowerCase().includes(searchString.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Salas</h2>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            placeholder="Digite o nome ou capacidade..."
          />
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Buscar
          </button>
        </form>
        <button
          onClick={() => router.push('/classrooms/create')}
          className={`${styles.btn} ${styles.btnSuccess}`}
        >
          Cadastrar Nova Sala
        </button>
      </div>

      <div className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Salas</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Capacidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhuma sala encontrada.
                </td>
              </tr>
            ) : (
              filteredData.map((room) => (
                <tr key={room.id}>
                  <td>{room.name}</td>
                  <td>{room.capacity}</td>
                  <td>
                    <button
                      className={`${styles.btn} ${styles.btnWarning}`}
                      onClick={() => router.push(`/classrooms/edit/${room.id}`)}
                    >
                      Editar
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnInfo}`}
                      onClick={() => router.push(`/classrooms/details/${room.id}`)}
                    >
                      Detalhes
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnDanger}`}
                      onClick={() => router.push(`/classrooms/delete/${room.id}`)}
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
};

export default ClassroomsPage;
