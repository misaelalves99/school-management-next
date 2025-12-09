// src/app/(dashboard)/page.tsx

'use client';

import { useMemo } from 'react';
import { FiUsers, FiUserCheck, FiBookOpen, FiLayers } from 'react-icons/fi';

import styles from './DashboardHome.module.css';

import Card from '../components/ui/Card';
import DataTable, {
  type DataTableColumn,
} from '../components/ui/DataTable';

import { useStudents } from '@/core/hooks/useStudents';
import { useTeachers } from '@/core/hooks/useTeachers';
import { useSubjects } from '@/core/hooks/useSubjects';
import { useClassRooms } from '@/core/hooks/useClassRooms';
import { useEnrollments } from '@/core/hooks/useEnrollments';

import type { Enrollment } from '@/types/Enrollment';
import type { ClassRoom } from '@/types/ClassRoom';
import type { Student } from '@/types/Student';

export default function DashboardHomePage() {
  const { students } = useStudents();
  const { teachers } = useTeachers();
  const { subjects } = useSubjects();
  const { classRooms } = useClassRooms();
  const { enrollments } = useEnrollments();

  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalSubjects = subjects.length;
  const totalClasses = classRooms.length;

  const activeEnrollments = useMemo(
    () =>
      enrollments.filter((e: Enrollment) =>
        e.status?.toLowerCase() === 'active' ||
        e.status?.toLowerCase() === 'ativa',
      ),
    [enrollments],
  );

  const totalActiveEnrollments = activeEnrollments.length;
  const totalEnrollments = enrollments.length;

  // Últimas matrículas (mais recentes primeiro)
  const recentEnrollments = useMemo(
    () =>
      [...enrollments]
        .sort((a: Enrollment, b: Enrollment) => {
          const da = new Date(a.enrollmentDate).getTime();
          const db = new Date(b.enrollmentDate).getTime();
          return db - da;
        })
        .slice(0, 5),
    [enrollments],
  );

  const getStudentById = (id: number): Student | undefined =>
    students.find((s: Student) => s.id === id);

  const getClassById = (id: number): ClassRoom | undefined =>
    classRooms.find((c: ClassRoom) => c.id === id);

  const formatDate = (iso: string) => {
    if (!iso) return '—';
    const dt = new Date(iso);
    if (Number.isNaN(dt.getTime())) return '—';
    return dt.toLocaleDateString('pt-BR');
  };

  const mapStatusToLabel = (status: string | undefined) => {
    if (!status) return '—';
    const value = status.toLowerCase();

    if (value === 'active' || value === 'ativa') return 'Ativa';
    if (value === 'pending' || value === 'pendente') return 'Pendente';
    if (value === 'canceled' || value === 'cancelada') return 'Cancelada';

    // fallback
    return status;
  };

  const mapStatusToClassName = (status: string | undefined) => {
    if (!status) return styles.statusPill;

    const value = status.toLowerCase();

    if (value === 'active' || value === 'ativa')
      return `${styles.statusPill} ${styles.statusActive}`;
    if (value === 'pending' || value === 'pendente')
      return `${styles.statusPill} ${styles.statusPending}`;
    if (value === 'canceled' || value === 'cancelada')
      return `${styles.statusPill} ${styles.statusCanceled}`;

    return styles.statusPill;
  };

  const today = new Date();
  const formattedToday = today.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // ===== Colunas da tabela de matrículas =====
  const enrollmentColumns: DataTableColumn<Enrollment>[] = [
    {
      key: 'student',
      header: 'Aluno',
      render: (row: Enrollment) =>
        getStudentById(row.studentId)?.name ?? `#${row.studentId}`,
    },
    {
      key: 'classRoom',
      header: 'Turma',
      render: (row: Enrollment) =>
        getClassById(row.classRoomId)?.name ?? `#${row.classRoomId}`,
    },
    {
      key: 'date',
      header: 'Data',
      render: (row: Enrollment) => formatDate(row.enrollmentDate),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Enrollment) => (
        <span className={mapStatusToClassName(row.status)}>
          {mapStatusToLabel(row.status)}
        </span>
      ),
    },
  ];

  // ===== Colunas da tabela de turmas =====
  const classRoomColumns: DataTableColumn<ClassRoom>[] = [
    {
      key: 'name',
      header: 'Turma',
      render: (room: ClassRoom) => room.name,
    },
    {
      key: 'capacity',
      header: 'Capacidade',
      render: (room: ClassRoom) => room.capacity ?? '—',
    },
    {
      key: 'enrollments',
      header: 'Matrículas',
      render: (room: ClassRoom) =>
        enrollments.filter((e: Enrollment) => e.classRoomId === room.id).length,
    },
  ];

  return (
    <div className={styles.page}>
      {/* Header topo do dashboard */}
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <h1 className={styles.headerTitle}>Visão geral da escola</h1>
          <p className={styles.headerSubtitle}>
            Acompanhe rapidamente alunos, professores, disciplinas, turmas e matrículas em um painel único.
          </p>
        </div>

        <div>
          <div className={styles.headerBadge}>
            Hoje • {formattedToday}
          </div>
        </div>
      </header>

      {/* Cards principais */}
      <section className={styles.gridMain}>
        <Card
          title="Alunos"
          helperText="Total cadastrados no sistema"
          value={totalStudents}
          variant="primary"
          icon={<FiUsers size={18} />}
        />
        <Card
          title="Professores"
          helperText="Atuando em turmas e disciplinas"
          value={totalTeachers}
          variant="success"
          icon={<FiUserCheck size={18} />}
        />
        <Card
          title="Disciplinas"
          helperText="Conteúdos e matérias cadastradas"
          value={totalSubjects}
          variant="warning"
          icon={<FiBookOpen size={18} />}
        />
        <Card
          title="Turmas / Matrículas"
          helperText={`${totalClasses} turmas • ${totalEnrollments} matrículas`}
          value={totalActiveEnrollments || totalEnrollments}
          variant="danger"
          icon={<FiLayers size={18} />}
        >
          <span>
            {totalActiveEnrollments > 0
              ? `${totalActiveEnrollments} matrículas ativas`
              : 'Nenhuma matrícula marcada como ativa'}
          </span>
        </Card>
      </section>

      {/* Seções secundárias: últimas matrículas + visão rápida de capacidade */}
      <section className={styles.gridSecondary}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Últimas matrículas</h2>
              <p className={styles.sectionSubtitle}>
                Acompanhe rapidamente quem entrou em cada turma recentemente.
              </p>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <DataTable<Enrollment>
              columns={enrollmentColumns}
              data={recentEnrollments}
              getRowKey={(row, index) => row.id ?? index}
              emptyMessage="Nenhuma matrícula encontrada ainda."
              dense
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Resumo de turmas</h2>
              <p className={styles.sectionSubtitle}>
                Capacidade total versus alunos matriculados por turma.
              </p>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <DataTable<ClassRoom>
              columns={classRoomColumns}
              data={classRooms.slice(0, 6)}
              getRowKey={(room) => room.id}
              emptyMessage="Nenhuma turma cadastrada."
              dense
            />
          </div>
        </div>
      </section>
    </div>
  );
}
