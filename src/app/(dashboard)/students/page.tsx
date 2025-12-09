// src/app/(dashboard)/students/page.tsx

'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaUserGraduate,
  FaUserPlus,
  FaSearch,
  FaInfoCircle,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';

import styles from './StudentsPage.module.css';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import DataTable from '@/app/components/ui/DataTable';
import { useStudents } from '@/core/hooks/useStudents';
import type { Student } from '@/types/Student';

type StatusFilter = 'all' | 'has-phone' | 'no-phone';

export default function StudentsPage(): JSX.Element {
  const router = useRouter();
  const { students } = useStudents();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const totalStudents = students.length;

  const filteredStudents = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return students.filter((student: Student) => {
      const name = (student.name ?? '').toLowerCase();
      const email = (student.email ?? '').toLowerCase();
      const enrollment = (student.enrollmentNumber ?? '').toLowerCase();

      const matchesSearch =
        !term ||
        name.includes(term) ||
        email.includes(term) ||
        enrollment.includes(term);

      const hasPhone =
        !!student.phone && student.phone.trim().length > 0;

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'has-phone'
          ? hasPhone
          : !hasPhone;

      return matchesSearch && matchesStatus;
    });
  }, [students, searchTerm, statusFilter]);

  const columns = [
    {
      key: 'name',
      header: 'Aluno',
      render: (student: Student) => (
        <div className={styles.studentCell}>
          <div className={styles.avatarCircle}>
            {student.name ? student.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className={styles.studentInfo}>
            <span className={styles.studentName}>{student.name}</span>
            <span className={styles.studentEmail}>
              {student.email || 'E-mail não informado'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'enrollmentNumber',
      header: 'Matrícula',
      render: (student: Student) => (
        <span className={styles.muted}>
          {student.enrollmentNumber ?? '—'}
        </span>
      ),
    },
    {
      key: 'dateOfBirth',
      header: 'Nascimento',
      render: (student: Student) => {
        const formatted = student.dateOfBirth
          ? new Date(student.dateOfBirth).toLocaleDateString('pt-BR')
          : '—';
        return <span className={styles.muted}>{formatted}</span>;
      },
    },
    {
      key: 'phone',
      header: 'Telefone',
      render: (student: Student) =>
        student.phone ? (
          <span className={styles.phone}>{student.phone}</span>
        ) : (
          <Badge variant="warning" size="sm">
            Sem telefone
          </Badge>
        ),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (student: Student) => (
        <div className={styles.actionsCell}>
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.btnInfo}`}
            onClick={() => router.push(`/students/details/${student.id}`)}
            aria-label={`Ver detalhes do aluno ${student.name}`}
            title="Ver detalhes"
          >
            <FaInfoCircle size={15} />
          </button>

          <button
            type="button"
            className={`${styles.iconBtn} ${styles.btnWarning}`}
            onClick={() => router.push(`/students/edit/${student.id}`)}
            aria-label={`Editar aluno ${student.name}`}
            title="Editar aluno"
          >
            <FaEdit size={15} />
          </button>

          <button
            type="button"
            className={`${styles.iconBtn} ${styles.btnDanger}`}
            onClick={() => router.push(`/students/delete/${student.id}`)}
            aria-label={`Excluir aluno ${student.name}`}
            title="Excluir aluno"
          >
            <FaTrash size={15} />
          </button>
        </div>
      ),
    },
  ];

  const handleCreate = (): void => {
    router.push('/students/create');
  };

  return (
    <div className={styles.page}>
      {/* ===== Header (layout igual Subjects) ===== */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <FaUserGraduate className={styles.titleIcon} />
            Alunos
          </h1>
          <p className={styles.subtitle}>
            Visão centralizada de todos os alunos da escola. Faça buscas
            rápidas por nome, e-mail ou matrícula e gerencie os dados
            de contato e matrícula em poucos cliques.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleCreate}
          >
            <FaUserPlus />
            Novo aluno
          </Button>
        </div>
      </header>

      {/* ===== Filtros (busca + chips) ===== */}
      <section className={styles.filtersSection}>
        <Card className={styles.filtersCard}>
          <div className={styles.filtersForm}>
            {/* Busca rápida */}
            <div className={styles.searchGroup}>
              <span className={styles.fieldLabel}>Busca rápida</span>
              <div className={styles.searchControl}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Buscar por nome, e-mail ou matrícula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filtro por contato (chips) */}
            <div className={styles.subjectGroup}>
              <span className={styles.fieldLabel}>Filtro por contato</span>
              <div className={styles.subjectChips}>
                <button
                  type="button"
                  className={`${styles.chip} ${
                    statusFilter === 'all' ? styles.chipActive : ''
                  }`}
                  onClick={() => setStatusFilter('all')}
                >
                  Todos
                </button>
                <button
                  type="button"
                  className={`${styles.chip} ${
                    statusFilter === 'has-phone' ? styles.chipActive : ''
                  }`}
                  onClick={() => setStatusFilter('has-phone')}
                >
                  Com telefone
                </button>
                <button
                  type="button"
                  className={`${styles.chip} ${
                    statusFilter === 'no-phone' ? styles.chipActive : ''
                  }`}
                  onClick={() => setStatusFilter('no-phone')}
                >
                  Sem telefone
                </button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ===== Tabela ===== */}
      <section className={styles.tableSection}>
        <Card className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Lista de alunos</h2>
            <p className={styles.tableMeta}>
              Exibindo {filteredStudents.length} de {totalStudents}{' '}
              alunos cadastrados
            </p>
          </div>

          <div className={styles.tableWrapper}>
            <DataTable<Student>
              columns={columns}
              data={filteredStudents}
              getRowKey={(student, index) => student.id ?? index}
              emptyMessage="Nenhum aluno encontrado com os filtros atuais."
            />
          </div>
        </Card>
      </section>
    </div>
  );
}
