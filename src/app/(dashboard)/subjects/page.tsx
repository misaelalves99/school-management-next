// src/app/(dashboard)/subjects/page.tsx

'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaBookOpen,
  FaPlus,
  FaSearch,
  FaInfoCircle,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';

import styles from './SubjectsPage.module.css';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import DataTable, {
  type DataTableColumn,
} from '@/app/components/ui/DataTable';
import { useSubjects } from '@/core/hooks/useSubjects';
import type { Subject } from '@/types/Subject';

type WorkloadFilter = 'all' | 'low' | 'medium' | 'high';

function getWorkloadLevel(hours?: number) {
  if (!hours || hours <= 0) return 'none';
  if (hours <= 30) return 'low';
  if (hours <= 60) return 'medium';
  return 'high';
}

export default function SubjectsPage(): JSX.Element {
  const router = useRouter();
  const { subjects } = useSubjects();

  const [searchTerm, setSearchTerm] = useState('');
  const [workloadFilter, setWorkloadFilter] =
    useState<WorkloadFilter>('all');

  const totalSubjects = subjects.length;

  const filteredSubjects = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return subjects.filter((subject: Subject) => {
      const name = subject.name.toLowerCase();
      const description = (subject.description || '').toLowerCase();

      const matchesSearch =
        !term || name.includes(term) || description.includes(term);

      const level = getWorkloadLevel(subject.workloadHours);

      const matchesWorkload =
        workloadFilter === 'all'
          ? true
          : workloadFilter === 'low'
          ? level === 'low'
          : workloadFilter === 'medium'
          ? level === 'medium'
          : level === 'high';

      return matchesSearch && matchesWorkload;
    });
  }, [subjects, searchTerm, workloadFilter]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const columns: DataTableColumn<Subject>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (subject: Subject) => `#${subject.id}`,
    },
    {
      key: 'name',
      header: 'Disciplina',
      render: (subject: Subject) => (
        <div className={styles.subjectCell}>
          <span className={styles.subjectName}>{subject.name}</span>
        </div>
      ),
    },
    {
      key: 'workloadHours',
      header: 'Carga horária',
      render: (subject: Subject) => {
        const level = getWorkloadLevel(subject.workloadHours);
        const value = subject.workloadHours ?? 0;

        if (level === 'none') {
          return (
            <Badge variant="neutral" size="sm">
              Não definida
            </Badge>
          );
        }

        const label = `${value}h`;

        if (level === 'low') {
          return (
            <Badge variant="info" size="sm">
              {label}
            </Badge>
          );
        }

        if (level === 'medium') {
          return (
            <Badge variant="warning" size="sm">
              {label}
            </Badge>
          );
        }

        return (
          <Badge variant="danger" size="sm">
            {label}
          </Badge>
        );
      },
    },
    {
      key: 'description',
      header: 'Descrição',
      render: (subject: Subject) => (
        <span className={styles.subjectDescription}>
          {subject.description || 'Sem descrição cadastrada.'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (subject: Subject) => (
        <div className={styles.actionsCell}>
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.btnInfo}`}
            onClick={() => router.push(`/subjects/details/${subject.id}`)}
            aria-label={`Ver detalhes da disciplina ${subject.name}`}
            title="Ver detalhes"
          >
            <FaInfoCircle size={15} />
          </button>

          <button
            type="button"
            className={`${styles.iconBtn} ${styles.btnWarning}`}
            onClick={() => router.push(`/subjects/edit/${subject.id}`)}
            aria-label={`Editar disciplina ${subject.name}`}
            title="Editar"
          >
            <FaEdit size={15} />
          </button>

          <button
            type="button"
            className={`${styles.iconBtn} ${styles.btnDanger}`}
            onClick={() => router.push(`/subjects/delete/${subject.id}`)}
            aria-label={`Excluir disciplina ${subject.name}`}
            title="Excluir"
          >
            <FaTrash size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      {/* ===== Cabeçalho principal ===== */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <FaBookOpen className={styles.titleIcon} />
            Disciplinas
          </h1>
          <p className={styles.subtitle}>
            Cadastre e organize as disciplinas oferecidas pela escola, com visão
            clara de descrição e carga horária — ideal para secretaria e
            coordenação pedagógica.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/teachers')}
          >
            Ver professores
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push('/subjects/create')}
          >
            <FaPlus />
            Nova disciplina
          </Button>
        </div>
      </header>

      {/* ===== Grid de conteúdo: Filtros + Tabela ===== */}
      <div className={styles.contentGrid}>
        {/* Painel lateral de filtros */}
        <Card>
          <section className={styles.filterSection}>
            <h2 className={styles.sectionTitle}>Buscar disciplinas</h2>
            <p className={styles.sectionSubtitle}>
              Filtre por nome, descrição e carga horária para localizar
              rapidamente a disciplina desejada.
            </p>

            <form
              onSubmit={handleSearchSubmit}
              className={styles.searchForm}
            >
              <div className={styles.searchField}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Digite nome ou descrição..."
                  className={styles.searchInput}
                />
              </div>
            </form>

            {/* Filtros de carga horária */}
            <div className={styles.filterChips}>
              <button
                type="button"
                className={`${styles.chip} ${
                  workloadFilter === 'all' ? styles.chipActive : ''
                }`}
                onClick={() => setWorkloadFilter('all')}
              >
                Todas
              </button>
              <button
                type="button"
                className={`${styles.chip} ${
                  workloadFilter === 'low' ? styles.chipActive : ''
                }`}
                onClick={() => setWorkloadFilter('low')}
              >
                Até 30h
              </button>
              <button
                type="button"
                className={`${styles.chip} ${
                  workloadFilter === 'medium' ? styles.chipActive : ''
                }`}
                onClick={() => setWorkloadFilter('medium')}
              >
                31h - 60h
              </button>
              <button
                type="button"
                className={`${styles.chip} ${
                  workloadFilter === 'high' ? styles.chipActive : ''
                }`}
                onClick={() => setWorkloadFilter('high')}
              >
                Acima de 60h
              </button>
            </div>

            <div className={styles.divider} />

            <div className={styles.actionBlock}>
              <p className={styles.actionText}>
                Precisa cadastrar uma nova disciplina na grade?
              </p>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => router.push('/subjects/create')}
              >
                <FaPlus />
                Nova disciplina
              </Button>
            </div>
          </section>
        </Card>

        {/* Tabela principal */}
        <Card>
          <section className={styles.tableSection}>
            <div className={styles.tableHeaderRow}>
              <div>
                <h2 className={styles.sectionTitle}>Lista de disciplinas</h2>
                <p className={styles.sectionSubtitle}>
                  Visualize e gerencie todas as disciplinas do sistema, com
                  acesso rápido a detalhes, edição e exclusão.
                </p>
              </div>

              {/* Meta igual ao Teachers: quantidade cadastrada dentro do header da tabela */}
              <div className={styles.tableMeta}>
                {totalSubjects === 1
                  ? '1 disciplina cadastrada'
                  : `${totalSubjects} disciplinas cadastradas`}
              </div>
            </div>

            {filteredSubjects.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>
                  Nenhuma disciplina encontrada
                </p>
                <p className={styles.emptySubtitle}>
                  Ajuste os filtros de busca ou cadastre uma nova disciplina
                  para começar.
                </p>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <DataTable<Subject>
                  columns={columns}
                  data={filteredSubjects}
                  emptyMessage="Nenhuma disciplina encontrada com os filtros atuais."
                  getRowKey={(row) => row.id}
                />
              </div>
            )}
          </section>
        </Card>
      </div>
    </div>
  );
}
