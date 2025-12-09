// src/app/(dashboard)/students/details/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaEnvelope,
  FaIdCard,
  FaPhone,
  FaUserGraduate,
} from 'react-icons/fa';

import styles from './DetailsPage.module.css';

import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import { useStudents } from '@/core/hooks/useStudents';
import type { Student } from '@/types/Student';
import { formatDate } from '@/core/utils/formatDate';

export default function StudentDetailsPage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params?.id);

  const { getStudentById } = useStudents();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    const found = getStudentById(id);

    if (!found) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    setStudent(found);
    setLoading(false);
  }, [id, getStudentById]);

  const handleBack = (): void => {
    router.push('/students');
  };

  const handleEdit = (): void => {
    if (!id || notFound) return;
    router.push(`/students/edit/${id}`);
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingSkeleton} />
        <p className={styles.loadingText}>Carregando aluno...</p>
      </div>
    );
  }

  if (notFound || !student) {
    return (
      <div className={styles.notFoundWrapper}>
        <Card className={styles.notFoundCard}>
          <h1 className={styles.notFoundTitle}>Aluno não encontrado</h1>
          <p className={styles.notFoundSubtitle}>
            Não encontramos nenhum aluno para o identificador informado.
            Verifique se o link está correto ou tente voltar para a listagem.
          </p>

          <div className={styles.notFoundActions}>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={handleBack}
            >
              <FaArrowLeft />
              Voltar para alunos
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const dateOfBirthFormatted = student.dateOfBirth
    ? formatDate(student.dateOfBirth)
    : '—';

  const createdAtFormatted = student.createdAt
    ? new Date(student.createdAt).toLocaleString('pt-BR')
    : '—';

  const updatedAtFormatted = student.updatedAt
    ? new Date(student.updatedAt).toLocaleString('pt-BR')
    : 'Nenhuma atualização registrada';

  return (
    <div className={styles.page}>
      {/* ===== Header (padronizado com create/edit) ===== */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>
              <span className={styles.titleIconWrapper}>
                <FaUserGraduate className={styles.titleIcon} />
              </span>
              {student.name}
            </h1>

            <div className={styles.badgesRow}>
              <Badge size="md" variant="success">
                Matrícula {student.enrollmentNumber || '—'}
              </Badge>
            </div>
          </div>

          <p className={styles.subtitle}>
            Dados completos do aluno para suporte à secretaria, coordenação
            e relatórios acadêmicos.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBack}
          >
            <FaArrowLeft />
            Voltar
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleEdit}
          >
            <FaUserGraduate />
            Editar aluno
          </Button>
        </div>
      </header>

      {/* ===== Main content ===== */}
      <section className={styles.grid}>
        {/* Coluna principal */}
        <Card className={styles.mainCard}>
          <h2 className={styles.sectionTitle}>Informações principais</h2>
          <p className={styles.sectionSubtitle}>
            Identidade acadêmica e dados de contato do aluno.
          </p>

          <div className={styles.infoGrid}>
            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Nome completo</h3>
              <p className={styles.infoValue}>{student.name}</p>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Matrícula</h3>
              <p className={styles.infoValue}>
                {student.enrollmentNumber || '—'}
              </p>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>E-mail</h3>
              <p className={styles.infoValueInline}>
                <FaEnvelope className={styles.infoIcon} />
                <span>{student.email || '—'}</span>
              </p>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Telefone</h3>
              <p className={styles.infoValueInline}>
                <FaPhone className={styles.infoIcon} />
                <span>{student.phone || '—'}</span>
              </p>
            </div>

            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Data de nascimento</h3>
              <p className={styles.infoValueInline}>
                <FaCalendarAlt className={styles.infoIcon} />
                <span>{dateOfBirthFormatted}</span>
              </p>
            </div>

            {/* 🆕 Criado em */}
            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Criado em</h3>
              <p className={styles.infoValueInline}>
                <FaCalendarAlt className={styles.infoIcon} />
                <span>{createdAtFormatted}</span>
              </p>
            </div>

            {/* Endereço em linha cheia */}
            <div className={styles.infoBlockFull}>
              <h3 className={styles.infoLabel}>Endereço</h3>
              <p className={styles.infoValue}>
                {student.address || 'Não informado'}
              </p>
            </div>

            {/* 🆕 Última atualização em linha cheia também */}
            <div className={styles.infoBlockFull}>
              <h3 className={styles.infoLabel}>Última atualização</h3>
              <p className={styles.infoValueInline}>
                <FaCalendarAlt className={styles.infoIcon} />
                <span>{updatedAtFormatted}</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Coluna lateral */}
        <div className={styles.sideColumn}>
          <Card className={styles.metaCard}>
            <h2 className={styles.sectionTitle}>Resumo acadêmico</h2>
            <p className={styles.sectionSubtitle}>
              Visão rápida dos dados essenciais do aluno no sistema.
            </p>

            <dl className={styles.metaList}>
              <div className={styles.metaRow}>
                <dt>ID interno</dt>
                <dd>
                  <span className={styles.metaValue}>
                    <FaIdCard className={styles.metaIcon} />
                    <span>#{student.id}</span>
                  </span>
                </dd>
              </div>

              <div className={styles.metaRow}>
                <dt>Identificador de matrícula</dt>
                <dd>
                  <span className={styles.metaValue}>
                    {student.enrollmentNumber || '—'}
                  </span>
                </dd>
              </div>

              <div className={styles.metaRow}>
                <dt>Contato principal</dt>
                <dd>
                  <span className={styles.metaValueStack}>
                    <span>{student.email || 'E-mail não informado'}</span>
                    <span className={styles.metaSub}>
                      {student.phone || 'Telefone não informado'}
                    </span>
                  </span>
                </dd>
              </div>
            </dl>

            <div className={styles.metaFooter}>
              <p className={styles.metaHint}>
                Esses dados são usados em telas de matrícula, emissão de
                relatórios e comunicação com responsáveis.
              </p>
            </div>
          </Card>

          <Card className={styles.auditCard}>
            <h2 className={styles.sectionTitle}>Status operacional</h2>
            <p className={styles.sectionSubtitle}>
              Informações para suporte na gestão diária da escola.
            </p>

            <ul className={styles.auditList}>
              <li className={styles.auditItem}>
                <span className={styles.auditLabel}>
                  Presença em matrículas
                </span>
                <span className={styles.auditValue}>
                  Relacionado às telas de matrículas e turmas
                </span>
              </li>

              <li className={styles.auditItem}>
                <span className={styles.auditLabel}>
                  Consistência de dados
                </span>
                <span className={styles.auditValue}>
                  Manter e-mail, telefone e endereço atualizados reduz
                  erros em comunicação e relatórios.
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
}
