// src/app/(dashboard)/teachers/edit/[id]/page.tsx

'use client';

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaChalkboardTeacher, FaSave } from 'react-icons/fa';

import styles from './EditPage.module.css';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { useTeachers } from '@/core/hooks/useTeachers';
import { useSubjects } from '@/core/hooks/useSubjects';
import type { Teacher } from '@/types/Teacher';

interface TeacherFormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  specialization: string;
  dateOfBirth: string;
  address: string;
}

type ValidationErrors = Partial<Record<keyof TeacherFormState, string>>;

const INITIAL_FORM_STATE: TeacherFormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  specialization: '',
  dateOfBirth: '',
  address: '',
};

export default function EditTeacherPage(): JSX.Element {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  const { getTeacherById, updateTeacher } = useTeachers();
  const { subjects } = useSubjects(); // 🔹 disciplinas vindas do módulo Subjects

  const [form, setForm] = useState<TeacherFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    const teacher = getTeacherById(id);

    if (!teacher) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    setForm({
      name: teacher.name ?? '',
      email: teacher.email ?? '',
      phone: teacher.phone ?? '',
      subject: teacher.subject ?? '',
      specialization: teacher.specialization ?? '',
      dateOfBirth: teacher.dateOfBirth ?? '',
      address: teacher.address ?? '',
    });

    setLoading(false);
  }, [id, getTeacherById]);

  const validate = (values: TeacherFormState): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!values.name.trim()) {
      newErrors.name = 'Nome é obrigatório.';
    }

    if (!values.email.trim()) {
      newErrors.email = 'E-mail é obrigatório.';
    }

    if (!values.subject.trim()) {
      newErrors.subject = 'Disciplina é obrigatória.';
    }

    if (!values.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório.';
    }

    if (!values.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Data de nascimento é obrigatória.';
    }

    if (!values.address.trim()) {
      newErrors.address = 'Endereço é obrigatório.';
    }

    return newErrors;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));

    setErrors(prev => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleCancel = (): void => {
    router.push('/teachers');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!id || notFound) return;

    const validation = validate(form);
    const hasErrors = Object.keys(validation).length > 0;

    if (hasErrors) {
      setErrors(validation);
      return;
    }

    setIsSubmitting(true);

    const payload: Omit<Teacher, 'id'> = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subject: form.subject.trim(),
      specialization: form.specialization.trim(),
      dateOfBirth: form.dateOfBirth,
      address: form.address.trim(),
    };

    const result = updateTeacher(id, payload);

    setIsSubmitting(false);

    if (result === false) {
      alert('Erro ao atualizar professor.');
      return;
    }

    alert('Professor atualizado com sucesso!');
    router.push('/teachers');
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingSkeleton} />
        <p className={styles.loadingText}>Carregando professor...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className={styles.notFoundWrapper}>
        <Card className={styles.notFoundCard}>
          <h1 className={styles.notFoundTitle}>Professor não encontrado</h1>
          <p className={styles.notFoundSubtitle}>
            Não encontramos nenhum professor para o identificador informado. Ele
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
              Voltar para professores
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ===== Header (layout igual ao edit de students) ===== */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <span className={styles.titleIconWrapper}>
              <FaChalkboardTeacher className={styles.titleIcon} />
            </span>
            Editar professor
          </h1>

          <p className={styles.subtitle}>
            Atualize as informações de contato, disciplina e especialização do
            professor. As alterações impactam diretamente turmas e matrículas
            associadas.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconLeft={<FaArrowLeft />}
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Voltar para professores
          </Button>
        </div>
      </header>

      {/* ===== Form (grid/estilo igual ao edit de students) ===== */}
      <section className={styles.formSection}>
        <Card className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
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
                    placeholder="Ex.: Ana Souza"
                    disabled={isSubmitting}
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
                    placeholder="exemplo@escola.com"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                  <label htmlFor="subject" className={styles.label}>
                    Disciplina principal{' '}
                    <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className={styles.input}
                    value={form.subject}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value="">
                      Selecione uma disciplina
                    </option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.name}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <span className={styles.error}>{errors.subject}</span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    Telefone <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={styles.input}
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Ex.: (11) 99999-0000"
                    disabled={isSubmitting}
                  />
                  {errors.phone && (
                    <span className={styles.error}>{errors.phone}</span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="specialization" className={styles.label}>
                    Especialização (opcional)
                  </label>
                  <input
                    id="specialization"
                    name="specialization"
                    type="text"
                    className={styles.input}
                    value={form.specialization}
                    onChange={handleChange}
                    placeholder="Ex.: Matemática para ENEM, Didática"
                    disabled={isSubmitting}
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
                    placeholder="Rua, número, bairro, cidade - UF"
                    disabled={isSubmitting}
                  />
                  {errors.address && (
                    <span className={styles.error}>{errors.address}</span>
                  )}
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
                disabled={isSubmitting}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                iconLeft={<FaSave />}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}
