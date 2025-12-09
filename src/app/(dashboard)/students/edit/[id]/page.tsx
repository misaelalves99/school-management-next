// src/app/(dashboard)/students/edit/[id]/page.tsx

'use client';

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaSave, FaUserGraduate } from 'react-icons/fa';

import styles from './EditPage.module.css';

// ✅ importa TS/TSX (sem extensão)
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { useStudents } from '@/core/hooks/useStudents';
import type { Student } from '@/types/Student';

type StudentFormData = Omit<Student, 'id'>;

const initialFormState: StudentFormData = {
  name: '',
  email: '',
  dateOfBirth: '',
  enrollmentNumber: '',
  phone: '',
  address: '',
};

export default function StudentEditPage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params?.id);

  const { getStudentById, updateStudent } = useStudents();

  const [form, setForm] = useState<StudentFormData>(initialFormState);
  const [errors, setErrors] = useState<
    Partial<Record<keyof StudentFormData, string>>
  >({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    const student = getStudentById(id);
    if (!student) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    setForm({
      name: student.name,
      email: student.email,
      dateOfBirth: student.dateOfBirth,
      enrollmentNumber: student.enrollmentNumber,
      phone: student.phone,
      address: student.address,
    });
    setLoading(false);
  }, [id, getStudentById]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof StudentFormData, string>> = {};

    if (!form.name.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!form.email.trim()) newErrors.email = 'E-mail é obrigatório.';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = 'E-mail inválido.';
    if (!form.dateOfBirth)
      newErrors.dateOfBirth = 'Data de nascimento é obrigatória.';
    if (!form.enrollmentNumber.trim())
      newErrors.enrollmentNumber = 'Matrícula é obrigatória.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = (): void => {
    router.push('/students');
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (!validate() || !id || notFound) return;

    const result = updateStudent(id, form);

    if (result === false) {
      alert('Erro ao atualizar aluno');
      return;
    }

    alert('Aluno atualizado com sucesso!');
    router.push('/students');
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingSkeleton} />
        <p className={styles.loadingText}>Carregando aluno...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className={styles.notFoundWrapper}>
        <Card className={styles.notFoundCard}>
          <h1 className={styles.notFoundTitle}>Aluno não encontrado</h1>
          <p className={styles.notFoundSubtitle}>
            Não encontramos nenhum aluno para o identificador informado. Ele
            pode ter sido removido ou nunca ter existido.
          </p>
          <div className={styles.notFoundActions}>
            <Button
              type="button"
              variant="ghost"
              size="md"
              iconLeft={<FaArrowLeft />}
              onClick={handleCancel}
            >
              Voltar para alunos
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ===== Header (padronizado com create/students) ===== */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <span className={styles.titleIconWrapper}>
              <FaUserGraduate className={styles.titleIcon} />
            </span>
            Editar aluno
          </h1>

          <p className={styles.subtitle}>
            Atualize os dados do aluno. Alterações de matrícula, contato e
            endereço impactam relatórios acadêmicos e telas de matrículas.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconLeft={<FaArrowLeft />}
            onClick={handleCancel}
          >
            Voltar para alunos
          </Button>
        </div>
      </header>

      {/* ===== Form ===== */}
      <section className={styles.formSection}>
        <Card className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              {/* Coluna 1 */}
              <div className={styles.column}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Nome completo <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={styles.input}
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ex.: Ana Paula Silva"
                  />
                  {errors.name && (
                    <span className={styles.error}>{errors.name}</span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="email" className={styles.label}>
                    E-mail <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={styles.input}
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Ex.: ana@escola.com"
                  />
                  {errors.email && (
                    <span className={styles.error}>{errors.email}</span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="dateOfBirth" className={styles.label}>
                    Data de nascimento{' '}
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    className={styles.input}
                    value={form.dateOfBirth}
                    onChange={handleChange}
                  />
                  {errors.dateOfBirth && (
                    <span className={styles.error}>
                      {errors.dateOfBirth}
                    </span>
                  )}
                </div>
              </div>

              {/* Coluna 2 */}
              <div className={styles.column}>
                <div className={styles.fieldGroup}>
                  <label
                    htmlFor="enrollmentNumber"
                    className={styles.label}
                  >
                    Matrícula <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="enrollmentNumber"
                    name="enrollmentNumber"
                    type="text"
                    className={styles.input}
                    value={form.enrollmentNumber}
                    onChange={handleChange}
                    placeholder="Ex.: ALU-0001"
                  />
                  {errors.enrollmentNumber && (
                    <span className={styles.error}>
                      {errors.enrollmentNumber}
                    </span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    Telefone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={styles.input}
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Ex.: (11) 90000-0000"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="address" className={styles.label}>
                    Endereço
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    className={`${styles.input} ${styles.textarea}`}
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Rua, número, bairro, cidade"
                  />
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={handleCancel}
                iconLeft={<FaArrowLeft />}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                iconLeft={<FaSave />}
              >
                Salvar alterações
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}
