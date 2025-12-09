// src/app/(dashboard)/enrollments/edit/[id]/page.tsx

'use client';

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ChangeEvent,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaGraduationCap, FaArrowLeft, FaSave } from 'react-icons/fa';

import styles from './EditPage.module.css';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import { useEnrollments } from '@/core/hooks/useEnrollments';
import { useStudents } from '@/core/hooks/useStudents';
import { useClassRooms } from '@/core/hooks/useClassRooms';
import type { Student } from '@/types/Student';
import type { ClassRoom } from '@/types/ClassRoom';
import type { EnrollmentStatus } from '@/types/Enrollment';

interface FormState {
  studentId: string;
  classRoomId: string;
  enrollmentDate: string;
  status: EnrollmentStatus;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function EditEnrollmentPage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = useMemo(() => {
    const raw = params?.id;
    const num = Number(raw);
    return Number.isNaN(num) ? undefined : num;
  }, [params]);

  const { getEnrollmentById, updateEnrollment } = useEnrollments();
  const { students } = useStudents();
  const { classRooms } = useClassRooms();

  const [form, setForm] = useState<FormState>({
    studentId: '',
    classRoomId: '',
    enrollmentDate: '',
    status: 'ACTIVE',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id === undefined) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const enrollment = getEnrollmentById(id);

    if (!enrollment) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setForm({
      studentId: String(enrollment.studentId),
      classRoomId: String(enrollment.classRoomId),
      enrollmentDate: enrollment.enrollmentDate.substring(0, 10),
      status: (enrollment.status as EnrollmentStatus) ?? 'ACTIVE',
    });

    setLoading(false);
  }, [id, getEnrollmentById]);

  const canSubmit = useMemo(
    () => !!form.studentId && !!form.classRoomId && !!form.enrollmentDate,
    [form],
  );

  function handleBack(): void {
    router.push('/enrollments');
  }

  function handleChange<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ): void {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!form.studentId) {
      newErrors.studentId = 'Selecione um aluno.';
    }

    if (!form.classRoomId) {
      newErrors.classRoomId = 'Selecione uma turma.';
    }

    if (!form.enrollmentDate) {
      newErrors.enrollmentDate = 'Informe uma data de matrícula.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (id === undefined || notFound) return;
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const success = await updateEnrollment(id, {
        studentId: Number(form.studentId),
        classRoomId: Number(form.classRoomId),
        enrollmentDate: form.enrollmentDate,
        status: form.status,
      });

      if (!success) {
        alert('Erro ao atualizar matrícula');
        return;
      }

      alert('Matrícula atualizada com sucesso!');
      router.push('/enrollments');
    } catch (error) {
      console.error('Erro ao atualizar matrícula', error);
      alert('Erro ao atualizar matrícula');
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentStudentName =
    students.find(
      (s: Student) => String(s.id) === form.studentId,
    )?.name ?? '—';

  const currentClassRoomName =
    classRooms.find(
      (c: ClassRoom) => String(c.id) === form.classRoomId,
    )?.name ?? '—';

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingSkeleton} />
        <p className={styles.loadingText}>Carregando matrícula...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className={styles.notFoundWrapper}>
        <Card className={styles.notFoundCard}>
          <h1 className={styles.notFoundTitle}>Matrícula não encontrada</h1>
          <p className={styles.notFoundSubtitle}>
            Não encontramos nenhuma matrícula para o identificador informado.
            Ela pode ter sido removida ou o link está incorreto.
          </p>
          <div className={styles.notFoundActions}>
            <Button
              type="button"
              variant="ghost"
              size="md"
              iconLeft={<FaArrowLeft />}
              onClick={handleBack}
            >
              Voltar para matrículas
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ===== Header (padronizado com edit/students) ===== */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <span className={styles.titleIconWrapper}>
              <FaGraduationCap className={styles.titleIcon} />
            </span>
            Editar matrícula
          </h1>

          <p className={styles.subtitle}>
            Ajuste aluno, turma, status e data desta matrícula. Alterações aqui
            impactam diretamente as telas de turmas, relatórios e histórico
            acadêmico.
          </p>

          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Aluno atual:</span>
            <span className={styles.metaValue}>{currentStudentName}</span>

            <span className={styles.metaSeparator}>•</span>

            <span className={styles.metaLabel}>Turma atual:</span>
            <span className={styles.metaValue}>{currentClassRoomName}</span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <Badge variant="warning">Edição em produção</Badge>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconLeft={<FaArrowLeft />}
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Voltar
          </Button>
        </div>
      </header>

      {/* ===== Form ===== */}
      <section className={styles.formSection}>
        <Card className={styles.formCard}>
          <form
            className={styles.form}
            onSubmit={handleSubmit}
            noValidate
          >
            <div className={styles.formGrid}>
              {/* Coluna 1 - Aluno & Turma */}
              <div className={styles.column}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Aluno & Turma</h2>
                  <p className={styles.sectionSubtitle}>
                    Você pode reatribuir esta matrícula para outro aluno ou
                    turma, em caso de correções ou mudanças de turma.
                  </p>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="studentId" className={styles.label}>
                    Aluno <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="studentId"
                    className={`${styles.input} ${
                      errors.studentId ? styles.fieldError : ''
                    }`}
                    value={form.studentId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      handleChange('studentId', e.target.value)
                    }
                    disabled={isSubmitting}
                  >
                    <option value="">Selecione um aluno</option>
                    {students.map((student: Student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                  {errors.studentId && (
                    <span className={styles.error}>
                      {errors.studentId}
                    </span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="classRoomId" className={styles.label}>
                    Turma <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="classRoomId"
                    className={`${styles.input} ${
                      errors.classRoomId ? styles.fieldError : ''
                    }`}
                    value={form.classRoomId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      handleChange('classRoomId', e.target.value)
                    }
                    disabled={isSubmitting}
                  >
                    <option value="">Selecione uma turma</option>
                    {classRooms.map((classRoom: ClassRoom) => (
                      <option key={classRoom.id} value={classRoom.id}>
                        {classRoom.name}
                      </option>
                    ))}
                  </select>
                  {errors.classRoomId && (
                    <span className={styles.error}>
                      {errors.classRoomId}
                    </span>
                  )}
                </div>
              </div>

              {/* Coluna 2 - Status & Datas */}
              <div className={styles.column}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Status & Datas</h2>
                  <p className={styles.sectionSubtitle}>
                    Controle o ciclo de vida desta matrícula de forma alinhada à
                    operação da escola.
                  </p>
                </div>

                <div className={styles.fieldGroup}>
                  <label
                    htmlFor="enrollmentDate"
                    className={styles.label}
                  >
                    Data de matrícula{' '}
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="enrollmentDate"
                    type="date"
                    className={`${styles.input} ${
                      errors.enrollmentDate ? styles.fieldError : ''
                    }`}
                    value={form.enrollmentDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange('enrollmentDate', e.target.value)
                    }
                    disabled={isSubmitting}
                  />
                  {errors.enrollmentDate && (
                    <span className={styles.error}>
                      {errors.enrollmentDate}
                    </span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="status" className={styles.label}>
                    Status da matrícula
                  </label>
                  <select
                    id="status"
                    className={styles.input}
                    value={form.status}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      handleChange(
                        'status',
                        e.target.value as EnrollmentStatus,
                      )
                    }
                    disabled={isSubmitting}
                  >
                    <option value="ACTIVE">Ativa</option>
                    <option value="PENDING">Pendente</option>
                    <option value="CANCELLED">Cancelada</option>
                  </select>
                  <p className={styles.helperText}>
                    <strong>Ativa:</strong> vínculo vigente.{' '}
                    <strong>Pendente:</strong> em análise/documentação.{' '}
                    <strong>Cancelada:</strong> vínculo encerrado ou migrado.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer (padronizado com edit/students) */}
            <div className={styles.footer}>
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={handleBack}
                iconLeft={<FaArrowLeft />}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                iconLeft={<FaSave />}
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? 'Salvando alterações...' : 'Salvar alterações'}
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}
