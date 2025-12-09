// src/app/(dashboard)/enrollments/page.tsx

'use client';

import { useMemo, useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaGraduationCap,
  FaPlus,
  FaFilter,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaInfoCircle,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';

import styles from './EnrollmentsPage.module.css';

import Card from '@/app/components/ui/Card';
import DataTable, {
  type DataTableColumn,
} from '@/app/components/ui/DataTable';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';

import { useEnrollments } from '@/core/hooks/useEnrollments';
import { useStudents } from '@/core/hooks/useStudents';
import { useClassRooms } from '@/core/hooks/useClassRooms';
import { formatDate } from '@/core/utils/formatDate';
import type { Student } from '@/types/Student';
import type { ClassRoom } from '@/types/ClassRoom';
import type { Enrollment } from '@/types/Enrollment';

type EnrollmentStatus = 'ACTIVE' | 'PENDING' | 'CANCELLED';

interface EnrollmentRow {
  id: number;
  studentName: string;
  classRoomName: string;
  date: string;
  status: EnrollmentStatus;
}

function getStatusLabel(status: EnrollmentStatus): string {
  switch (status) {
    case 'ACTIVE':
      return 'Ativa';
    case 'PENDING':
      return 'Pendente';
    case 'CANCELLED':
      return 'Cancelada';
    default:
      return status;
  }
}

function getStatusVariant(
  status: EnrollmentStatus,
): 'success' | 'warning' | 'danger' | 'neutral' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'CANCELLED':
      return 'danger';
    default:
      return 'neutral';
  }
}

export default function EnrollmentsPage(): JSX.Element {
  const { enrollments } = useEnrollments();
  const { students } = useStudents();
  const { classRooms } = useClassRooms();
  const router = useRouter();

  const [statusFilter, setStatusFilter] = useState<'ALL' | EnrollmentStatus>(
    'ALL',
  );
  const [search, setSearch] = useState('');

  const studentNameById = useMemo(() => {
    const map: Record<number, string> = {};
    students.forEach((s: Student) => {
      if (typeof s.id === 'number') {
        map[s.id] = s.name ?? '';
      }
    });
    return map;
  }, [students]);

  const classRoomNameById = useMemo(() => {
    const map: Record<number, string> = {};
    classRooms.forEach((c: ClassRoom) => {
      if (typeof c.id === 'number') {
        map[c.id] = c.name ?? '';
      }
    });
    return map;
  }, [classRooms]);

  const rows: EnrollmentRow[] = useMemo(
    () =>
      enrollments.map((enrollment: Enrollment) => ({
        id: enrollment.id,
        studentName:
          studentNameById[enrollment.studentId] ?? 'Aluno não encontrado',
        classRoomName:
          classRoomNameById[enrollment.classRoomId] ?? 'Turma não encontrada',
        date: enrollment.enrollmentDate,
        status: (enrollment.status ?? 'PENDING') as EnrollmentStatus,
      })),
    [enrollments, studentNameById, classRoomNameById],
  );

  const filteredRows: EnrollmentRow[] = useMemo(() => {
    let current = rows;

    if (statusFilter !== 'ALL') {
      current = current.filter(
        (row: EnrollmentRow) => row.status === statusFilter,
      );
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      current = current.filter(
        (row: EnrollmentRow) =>
          row.studentName.toLowerCase().includes(term) ||
          row.classRoomName.toLowerCase().includes(term),
      );
    }

    return current;
  }, [rows, statusFilter, search]);

  const total = rows.length;
  const totalActive = rows.filter(
    (r: EnrollmentRow) => r.status === 'ACTIVE',
  ).length;
  const totalPending = rows.filter(
    (r: EnrollmentRow) => r.status === 'PENDING',
  ).length;
  const totalCancelled = rows.filter(
    (r: EnrollmentRow) => r.status === 'CANCELLED',
  ).length;

  const columns: DataTableColumn<EnrollmentRow>[] = [
    {
      key: 'student',
      header: 'Aluno',
      minWidth: '220px',
      render: (row: EnrollmentRow) => (
        <div className={styles.cellMain}>
          <span className={styles.cellTitle}>{row.studentName}</span>
          <span className={styles.cellSubtitle}>Matrícula #{row.id}</span>
        </div>
      ),
    },
    {
      key: 'classRoom',
      header: 'Turma',
      minWidth: '160px',
      render: (row: EnrollmentRow) => (
        <div className={styles.cellMain}>
          <span className={styles.cellTitle}>{row.classRoomName}</span>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Data de matrícula',
      minWidth: '160px',
      render: (row: EnrollmentRow) => (
        <span className={styles.cellMono}>{formatDate(row.date)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      minWidth: '120px',
      render: (row: EnrollmentRow) => (
        <Badge variant={getStatusVariant(row.status)}>
          {getStatusLabel(row.status)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      minWidth: '180px',
      align: 'right',
      render: (row: EnrollmentRow) => (
        <div className={styles.actionsCell}>
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.btnInfo}`}
            aria-label={`Ver detalhes da matrícula #${row.id}`}
            title="Ver detalhes"
            onClick={() => router.push(`/enrollments/details/${row.id}`)}
          >
            <FaInfoCircle size={15} />
          </button>

          <button
            type="button"
            className={`${styles.iconBtn} ${styles.btnWarning}`}
            aria-label={`Editar matrícula #${row.id}`}
            title="Editar"
            onClick={() => router.push(`/enrollments/edit/${row.id}`)}
          >
            <FaEdit size={15} />
          </button>

          <button
            type="button"
            className={`${styles.iconBtn} ${styles.btnDanger}`}
            aria-label={`Excluir matrícula #${row.id}`}
            title="Excluir"
            onClick={() => router.push(`/enrollments/delete/${row.id}`)}
          >
            <FaTrash size={15} />
          </button>
        </div>
      ),
    },
  ];

  function handleStatusFilterChange(value: 'ALL' | EnrollmentStatus): void {
    setStatusFilter(value);
  }

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>): void {
    setSearch(e.target.value);
  }

  return (
    <div className={styles.page}>
      {/* ===== Header (layout padrão Subjects/Students/Classrooms) ===== */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <FaGraduationCap className={styles.titleIcon} />
            Matrículas
          </h1>
          <p className={styles.subtitle}>
            Painel central para acompanhar todas as matrículas ativas,
            pendentes e canceladas, com filtros rápidos por status e busca por
            aluno ou turma.
          </p>

          <div className={styles.headerMetaRow}>
            <span className={styles.headerMetaLabel}>
              Visão da secretaria •
            </span>
            <span className={styles.headerMetaValue}>
              {total} matrícula{total === 1 ? '' : 's'} cadastrada
              {total === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <Link href="/enrollments/create">
            <Button variant="primary" size="md">
              <FaPlus className={styles.actionIcon} />
              Nova matrícula
            </Button>
          </Link>
        </div>
      </header>

      {/* ===== Stats ===== */}
      <section className={styles.statsBar}>
        <Card className={styles.statCard}>
          <div className={styles.statIconNeutral}>
            <FaGraduationCap />
          </div>
          <div className={styles.statText}>
            <span className={styles.statLabel}>Total de matrículas</span>
            <span className={styles.statValue}>{total}</span>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statIconSuccess}>
            <FaCheckCircle />
          </div>
          <div className={styles.statText}>
            <span className={styles.statLabel}>Ativas</span>
            <span className={styles.statValue}>{totalActive}</span>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statIconWarning}>
            <FaHourglassHalf />
          </div>
          <div className={styles.statText}>
            <span className={styles.statLabel}>Pendentes</span>
            <span className={styles.statValue}>{totalPending}</span>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statIconDanger}>
            <FaTimesCircle />
          </div>
          <div className={styles.statText}>
            <span className={styles.statLabel}>Canceladas</span>
            <span className={styles.statValue}>{totalCancelled}</span>
          </div>
        </Card>
      </section>

      {/* ===== Filtros + Tabela ===== */}
      <section className={styles.content}>
        <Card className={styles.contentCard}>
          <div className={styles.filtersBar}>
            <div className={styles.filtersLeft}>
              <span className={styles.filtersTitle}>
                <FaFilter className={styles.filtersIcon} />
                Filtros de status
              </span>

              <div className={styles.statusFilters}>
                <button
                  type="button"
                  className={styles.statusButton}
                  data-active={statusFilter === 'ALL'}
                  onClick={() => handleStatusFilterChange('ALL')}
                >
                  Todos
                  <span className={styles.statusCount}>{total}</span>
                </button>
                <button
                  type="button"
                  className={styles.statusButton}
                  data-active={statusFilter === 'ACTIVE'}
                  onClick={() => handleStatusFilterChange('ACTIVE')}
                >
                  Ativas
                  <span className={styles.statusCount}>{totalActive}</span>
                </button>
                <button
                  type="button"
                  className={styles.statusButton}
                  data-active={statusFilter === 'PENDING'}
                  onClick={() => handleStatusFilterChange('PENDING')}
                >
                  Pendentes
                  <span className={styles.statusCount}>{totalPending}</span>
                </button>
                <button
                  type="button"
                  className={styles.statusButton}
                  data-active={statusFilter === 'CANCELLED'}
                  onClick={() => handleStatusFilterChange('CANCELLED')}
                >
                  Canceladas
                  <span className={styles.statusCount}>{totalCancelled}</span>
                </button>
              </div>
            </div>

            <div className={styles.searchWrapper}>
              <input
                type="text"
                placeholder="Buscar por aluno ou turma..."
                className={styles.searchInput}
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <DataTable<EnrollmentRow>
              columns={columns}
              data={filteredRows}
              getRowKey={(row) => row.id}
              emptyMessage={
                search || statusFilter !== 'ALL'
                  ? 'Nenhuma matrícula encontrada com os filtros atuais.'
                  : 'Nenhuma matrícula cadastrada ainda. Comece registrando a primeira turma da escola.'
              }
            />
          </div>
        </Card>
      </section>
    </div>
  );
}
