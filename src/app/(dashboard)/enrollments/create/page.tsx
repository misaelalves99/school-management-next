// src/app/(dashboard)/enrollments/create/page.tsx
'use client';

import {
  useMemo,
  useState,
  type FormEvent,
  type ChangeEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  FaGraduationCap,
  FaArrowLeft,
  FaSave,
} from 'react-icons/fa';

import styles from './CreatePage.module.css';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import { useEnrollments } from '@/core/hooks/useEnrollments';
import { useStudents } from '@/core/hooks/useStudents';
import { useClassRooms } from '@/core/hooks/useClassRooms';
import type { Student } from '@/types/Student';
import type { ClassRoom } from '@/types/ClassRoom';

type EnrollmentStatus = 'ACTIVE' | 'PENDING' | 'CANCELLED';

interface FormState {
  studentId: string;
  classRoomId: string;
  enrollmentDate: string;
  status: EnrollmentStatus;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function CreateEnrollmentPage(): JSX.Element {
  const router = useRouter();

  const { createEnrollment } = useEnrollments();
  const { students } = useStudents();
  const { classRooms } = useClassRooms();

  const [form, setForm] = useState<FormState>({
    studentId: '',
    classRoomId: '',
    enrollmentDate: new Date().toISOString().substring(0, 10),
    status: 'ACTIVE',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      await createEnrollment({
        studentId: Number(form.studentId),
        classRoomId: Number(form.classRoomId),
        enrollmentDate: form.enrollmentDate,
        status: form.status,
      });

      router.push('/enrollments');
    } catch (error) {
      console.error('Erro ao criar matrícula', error);
      // ponto para evoluir com toast/alerta global
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* ===== Header (padronizado com Create de Students) ===== */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <span className={styles.titleIconWrapper}>
              <FaGraduationCap className={styles.titleIcon} />
            </span>
            Nova matrícula
          </h1>

          <p className={styles.subtitle}>
            Registre um novo vínculo entre aluno e turma, definindo status e
            data de ingresso. Esse fluxo foi pensado para a rotina diária da
            secretaria acadêmica.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Badge variant="info">Fluxo administrativo</Badge>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            <FaArrowLeft />
            Voltar para matrículas
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
              {/* Coluna 1 – Aluno & Turma */}
              <div className={styles.column}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="studentId" className={styles.label}>
                    Aluno <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="studentId"
                    className={`${styles.select} ${
                      errors.studentId ? styles.inputError : ''
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
                    <p className={styles.error}>{errors.studentId}</p>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="classRoomId" className={styles.label}>
                    Turma <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="classRoomId"
                    className={`${styles.select} ${
                      errors.classRoomId ? styles.inputError : ''
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
                    <p className={styles.error}>{errors.classRoomId}</p>
                  )}
                </div>
              </div>

              {/* Coluna 2 – Status & Datas */}
              <div className={styles.column}>
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
                      errors.enrollmentDate ? styles.inputError : ''
                    }`}
                    value={form.enrollmentDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange('enrollmentDate', e.target.value)
                    }
                    disabled={isSubmitting}
                  />
                  {errors.enrollmentDate && (
                    <p className={styles.error}>
                      {errors.enrollmentDate}
                    </p>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="status" className={styles.label}>
                    Status da matrícula
                  </label>
                  <select
                    id="status"
                    className={styles.select}
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
                    <strong>Ativa:</strong> aluno já vinculado à turma.{' '}
                    <strong>Pendente:</strong> pré-matrícula em análise.{' '}
                    <strong>Cancelada:</strong> vínculo encerrado.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer / Ações (padronizado com StudentsCreate) */}
             <div className={styles.footer}>
                <span className={styles.footerHint}>
                  Campos marcados com{' '}
                <span className={styles.required}>*</span> 
                  são obrigatórios.
              </span>

              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                <FaArrowLeft />
                Cancelar
              </Button>

              <div className={styles.footerRight}>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!canSubmit || isSubmitting}
                >
                  <FaSave />
                  {isSubmitting
                    ? 'Salvando...'
                    : 'Salvar matrícula'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}
