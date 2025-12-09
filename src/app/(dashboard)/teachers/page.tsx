// src/app/(dashboard)/teachers/page.tsx

'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaChalkboardTeacher,
  FaPlus,
  FaSearch,
  FaInfoCircle,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';

import styles from './TeachersPage.module.css';

import { useTeachers } from '@/core/hooks/useTeachers';
import type { Teacher } from '@/types/Teacher';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';

export default function TeachersPage() {
  const router = useRouter();
  const { teachers } = useTeachers();

  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string | 'all'>('all');

  const subjects = useMemo(() => {
    const unique = Array.from(
      new Set(teachers.map((t) => t.subject).filter(Boolean)),
    ) as string[];
    return unique.sort((a, b) => a.localeCompare(b));
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return teachers.filter((teacher: Teacher) => {
      const name = (teacher.name ?? '').toLowerCase();
      const email = (teacher.email ?? '').toLowerCase();
      const subject = (teacher.subject ?? '').toLowerCase();

      const matchesSearch =
        !term ||
        name.includes(term) ||
        email.includes(term) ||
        subject.includes(term);

      const matchesSubject =
        subjectFilter === 'all' ||
        subject === subjectFilter.toLowerCase();

      return matchesSearch && matchesSubject;
    });
  }, [teachers, search, subjectFilter]);

  const handleCreateClick = () => {
    router.push('/teachers/create');
  };

  const handleDetails = (id: number) => {
    router.push(`/teachers/details/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/teachers/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    router.push(`/teachers/delete/${id}`);
  };

  return (
    <div className={styles.page}>
      {/* ===== Header (igual layout de Subjects) ===== */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <FaChalkboardTeacher className={styles.titleIcon} />
            Professores
          </h1>
          <p className={styles.subtitle}>
            Centralize o cadastro de professores, disciplinas associadas
            e turmas sob responsabilidade de cada docente.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            variant="primary"
            size="md"
            leftIcon={<FaPlus />}
            onClick={handleCreateClick}
          >
            Novo Professor
          </Button>
        </div>
      </header>

      {/* ===== Filtros e busca ===== */}
      <section className={styles.filtersSection}>
        <Card className={styles.filtersCard}>
          <form
            className={styles.filtersForm}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className={styles.searchGroup}>
              <label htmlFor="search" className={styles.fieldLabel}>
                Buscar
              </label>
              <div className={styles.searchControl}>
                <FaSearch className={styles.searchIcon} />
                <input
                  id="search"
                  type="text"
                  value={search}
                  placeholder="Nome, e-mail ou disciplina..."
                  onChange={(e) => setSearch(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <div className={styles.subjectGroup}>
              <span className={styles.fieldLabel}>Filtrar por disciplina</span>
              <div className={styles.subjectChips}>
                <button
                  type="button"
                  className={
                    subjectFilter === 'all'
                      ? `${styles.chip} ${styles.chipActive}`
                      : styles.chip
                  }
                  onClick={() => setSubjectFilter('all')}
                >
                  Todas
                </button>

                {subjects.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    className={
                      subjectFilter.toLowerCase() === subject.toLowerCase()
                        ? `${styles.chip} ${styles.chipActive}`
                        : styles.chip
                    }
                    onClick={() => setSubjectFilter(subject)}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </Card>
      </section>

      {/* ===== Lista ===== */}
      <section className={styles.tableSection}>
        <Card className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Lista de professores</h2>
            <span className={styles.tableMeta}>
              {filteredTeachers.length} professor
              {filteredTeachers.length === 1 ? '' : 'es'} encontrado
              {filteredTeachers.length === teachers.length
                ? ''
                : ` (de ${teachers.length} no total)`}
            </span>
          </div>

          {filteredTeachers.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>
                Nenhum professor encontrado
              </p>
              <p className={styles.emptyText}>
                Ajuste os filtros ou cadastre um novo professor para começar.
              </p>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<FaPlus />}
                onClick={handleCreateClick}
              >
                Cadastrar professor
              </Button>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Disciplina</th>
                    <th>E-mail</th>
                    <th>Telefone</th>
                    <th style={{ width: 140 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher: Teacher) => (
                    <tr key={teacher.id}>
                      <td>#{teacher.id}</td>
                      <td>
                        <div className={styles.nameCell}>
                          <span className={styles.name}>{teacher.name}</span>
                          {teacher.specialization && (
                            <span className={styles.specialization}>
                              {teacher.specialization}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge variant="info">
                          {teacher.subject || '—'}
                        </Badge>
                      </td>
                      <td>{teacher.email}</td>
                      <td>{teacher.phone}</td>
                      <td>
                        <div className={styles.actionsCell}>
                          <button
                            type="button"
                            className={`${styles.iconBtn} ${styles.btnInfo}`}
                            aria-label={`Ver detalhes de ${teacher.name}`}
                            title="Ver detalhes"
                            onClick={() => handleDetails(teacher.id)}
                          >
                            <FaInfoCircle size={15} />
                          </button>

                          <button
                            type="button"
                            className={`${styles.iconBtn} ${styles.btnWarning}`}
                            aria-label={`Editar ${teacher.name}`}
                            title="Editar"
                            onClick={() => handleEdit(teacher.id)}
                          >
                            <FaEdit size={15} />
                          </button>

                          <button
                            type="button"
                            className={`${styles.iconBtn} ${styles.btnDanger}`}
                            aria-label={`Excluir ${teacher.name}`}
                            title="Excluir"
                            onClick={() => handleDelete(teacher.id)}
                          >
                            <FaTrash size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
