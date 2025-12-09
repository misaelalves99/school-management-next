// src/app/(dashboard)/classrooms/page.tsx

'use client';

import { useMemo, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaChalkboardTeacher,
  FaPlus,
  FaSearch,
  FaInfoCircle,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';

import styles from './ClassRoomsPage.module.css';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import DataTable from '@/app/components/ui/DataTable';
import { useClassRooms } from '@/core/hooks/useClassRooms';
import type { ClassRoom } from '@/types/ClassRoom';

type PeriodFilter = 'all' | 'morning' | 'afternoon' | 'night';

type ClassRoomRow = {
  id: number;
  name: string;
  code?: string;
  schedule?: string;
  capacity?: number;
  createdAt?: string;
};

export default function ClassRoomsPage(): JSX.Element {
  const { classRooms } = useClassRooms();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');

  const totalClassRooms = classRooms.length;

  const totalCapacity = classRooms.reduce(
    (acc: number, room: ClassRoom) => {
      const cap = typeof room.capacity === 'number' ? room.capacity : 0;
      return acc + cap;
    },
    0,
  );

  const filteredClassRooms: ClassRoomRow[] = useMemo(() => {
    return classRooms
      .filter((room: ClassRoom) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;

        const nameMatch = room.name?.toLowerCase().includes(term);
        const codeMatch = room.code?.toLowerCase().includes(term);

        return nameMatch || codeMatch;
      })
      .filter((room: ClassRoom) => {
        if (periodFilter === 'all') return true;

        const period = (room.period ?? room.schedule ?? '').toLowerCase();

        if (periodFilter === 'morning') {
          return period.includes('manhã') || period.includes('morning');
        }
        if (periodFilter === 'afternoon') {
          return period.includes('tarde') || period.includes('afternoon');
        }
        if (periodFilter === 'night') {
          return period.includes('noite') || period.includes('night');
        }

        return true;
      })
      .map((room: ClassRoom) => ({
        id: room.id,
        name: room.name,
        code: room.code,
        schedule: room.schedule,
        capacity: room.capacity,
        createdAt: room.createdAt,
      }));
  }, [classRooms, searchTerm, periodFilter]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePeriodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPeriodFilter(e.target.value as PeriodFilter);
  };

  return (
    <div className={styles.page}>
      {/* ===== Header (layout igual Subjects/Students/Teachers) ===== */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <FaChalkboardTeacher className={styles.titleIcon} />
            Turmas e Salas
          </h1>
          <p className={styles.subtitle}>
            Organize turmas por série, período e capacidade, mantendo a visão da
            ocupação da escola sempre clara para coordenação e secretaria.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Link href="/classrooms/create">
            <Button variant="primary" size="md">
              <FaPlus />
              Nova turma
            </Button>
          </Link>
        </div>
      </header>

      {/* ===== Stats row ===== */}
      <section className={styles.statsRow}>
        <Card className={styles.statCard}>
          <span className={styles.statLabel}>Total de turmas</span>
          <strong className={styles.statValue}>{totalClassRooms}</strong>
          <span className={styles.statHint}>Ativas no painel</span>
        </Card>

        <Card className={styles.statCard}>
          <span className={styles.statLabel}>Capacidade somada</span>
          <strong className={styles.statValue}>{totalCapacity}</strong>
          <span className={styles.statHint}>Alunos suportados</span>
        </Card>

        <Card className={styles.statCardSecondary}>
          <span className={styles.statLabel}>Ocupação por período</span>
          <span className={styles.statInline}>
            <span className={styles.statDotMorning} />
            Manhã
          </span>
          <span className={styles.statInline}>
            <span className={styles.statDotAfternoon} />
            Tarde
          </span>
          <span className={styles.statInline}>
            <span className={styles.statDotNight} />
            Noite
          </span>
        </Card>
      </section>

      {/* ===== Filters ===== */}
      <section className={styles.filtersRow}>
        <div className={styles.filtersLeft}>
          <div className={styles.searchWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por nome ou código..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>

          <select
            className={styles.select}
            value={periodFilter}
            onChange={handlePeriodChange}
          >
            <option value="all">Todos os períodos</option>
            <option value="morning">Somente manhã</option>
            <option value="afternoon">Somente tarde</option>
            <option value="night">Somente noite</option>
          </select>
        </div>

        <div className={styles.filtersRight}>
          <Badge variant="info">
            {filteredClassRooms.length} turma(s) exibida(s)
          </Badge>
        </div>
      </section>

      {/* ===== Table ===== */}
      <section>
        <Card>
          <DataTable<ClassRoomRow>
            columns={[
              {
                key: 'name',
                header: 'Turma',
                width: '32%',
                render: (row: ClassRoomRow) => (
                  <div className={styles.nameCell}>
                    <span className={styles.nameMain}>{row.name}</span>
                    <span className={styles.nameMeta}>
                      {row.code ? `Código: ${row.code}` : 'Sem código'}
                    </span>
                  </div>
                ),
              },
              {
                key: 'schedule',
                header: 'Horário / turno',
                width: '26%',
                render: (row: ClassRoomRow) => (
                  <Badge variant="soft">
                    {row.schedule ?? 'Não informado'}
                  </Badge>
                ),
              },
              {
                key: 'capacity',
                header: 'Capacidade',
                width: '16%',
                align: 'right',
                render: (row: ClassRoomRow) => (
                  <span className={styles.capacityText}>
                    {typeof row.capacity === 'number'
                      ? `${row.capacity} alunos`
                      : '—'}
                  </span>
                ),
              },
              {
                key: 'actions',
                header: 'Ações',
                width: '18%',
                align: 'right',
                render: (row: ClassRoomRow) => (
                  <div className={styles.actionsCell}>
                    <button
                      type="button"
                      className={`${styles.iconBtn} ${styles.btnInfo}`}
                      aria-label={`Ver detalhes da turma ${row.name}`}
                      title="Ver detalhes"
                      onClick={() =>
                        router.push(`/classrooms/details/${row.id}`)
                      }
                    >
                      <FaInfoCircle size={15} />
                    </button>
                    <button
                      type="button"
                      className={`${styles.iconBtn} ${styles.btnWarning}`}
                      aria-label={`Editar turma ${row.name}`}
                      title="Editar"
                      onClick={() =>
                        router.push(`/classrooms/edit/${row.id}`)
                      }
                    >
                      <FaEdit size={15} />
                    </button>
                    <button
                      type="button"
                      className={`${styles.iconBtn} ${styles.btnDanger}`}
                      aria-label={`Remover turma ${row.name}`}
                      title="Remover"
                      onClick={() =>
                        router.push(`/classrooms/delete/${row.id}`)
                      }
                    >
                      <FaTrash size={15} />
                    </button>
                  </div>
                ),
              },
            ]}
            data={filteredClassRooms}
            emptyMessage="Nenhuma turma encontrada com os filtros atuais."
            getRowKey={(row: ClassRoomRow) => row.id}
          />
        </Card>
      </section>
    </div>
  );
}
