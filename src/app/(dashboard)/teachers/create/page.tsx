// src/app/(dashboard)/teachers/create/page.tsx

'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaChalkboardTeacher, FaSave } from 'react-icons/fa';

import styles from './CreatePage.module.css';

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

export default function CreateTeacherPage(): JSX.Element {
  const router = useRouter();
  const { addTeacher } = useTeachers();
  const { subjects } = useSubjects(); // 🔹 pega disciplinas cadastradas

  const [form, setForm] = useState<TeacherFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = (): void => {
    router.push('/teachers');
  };

  function handleChange(field: keyof TeacherFormState, value: string): void {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));

    setErrors(prev => ({
      ...prev,
      [field]: '',
    }));
  }

  function validate(values: TeacherFormState): ValidationErrors {
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
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const validation = validate(form);
    const hasErrors = Object.keys(validation).length > 0;

    if (hasErrors) {
      setErrors(validation);
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: Omit<Teacher, 'id'> = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        // 🔹 subject agora vem do <select> com os Subjects cadastrados
        subject: form.subject.trim(),
        specialization: form.specialization.trim(),
        dateOfBirth: form.dateOfBirth,
        address: form.address.trim(),
      };

      await addTeacher(payload);
      router.push('/teachers');
    } catch (error) {
      console.error('Erro ao criar professor:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* ===== Header (layout padronizado com StudentsCreate) ===== */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <span className={styles.titleIconWrapper}>
              <FaChalkboardTeacher className={styles.titleIcon} />
            </span>
            Novo professor
          </h1>

          <p className={styles.subtitle}>
            Cadastre um novo professor com dados completos de contato,
            disciplina e especialização. Essas informações serão usadas na
            organização de turmas, horários e comunicação interna.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            <FaArrowLeft />
            Voltar para professores
          </Button>
        </div>
      </header>

      {/* ===== Form ===== */}
      <section className={styles.formSection}>
        <Card className={styles.formCard}>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formGrid}>
              {/* Coluna 1 */}
              <div className={styles.column}>
                {/* Nome */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Nome completo <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={styles.input}
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    placeholder="Ex.: Ana Souza"
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <span className={styles.error}>{errors.name}</span>
                  )}
                </div>

                {/* E-mail */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="email" className={styles.label}>
                    E-mail <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={styles.input}
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder="exemplo@escola.com"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <span className={styles.error}>{errors.email}</span>
                  )}
                </div>

                {/* Telefone */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    Telefone <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={styles.input}
                    value={form.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    placeholder="(11) 99999-0000"
                    disabled={isSubmitting}
                  />
                  {errors.phone && (
                    <span className={styles.error}>{errors.phone}</span>
                  )}
                </div>
              </div>

              {/* Coluna 2 */}
              <div className={styles.column}>
                {/* Disciplina principal (SELECT) */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="subject" className={styles.label}>
                    Disciplina principal{' '}
                    <span className={styles.required}>*</span>
                  </label>
                  <select
                    id="subject"
                    className={styles.input}
                    value={form.subject}
                    onChange={e => handleChange('subject', e.target.value)}
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

                {/* Especialização (opcional) */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="specialization" className={styles.label}>
                    Especialização (opcional)
                  </label>
                  <input
                    id="specialization"
                    type="text"
                    className={styles.input}
                    value={form.specialization}
                    onChange={e =>
                      handleChange('specialization', e.target.value)
                    }
                    placeholder="Ex.: Matemática para ENEM, Didática"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Data de nascimento */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="dateOfBirth" className={styles.label}>
                    Data de nascimento{' '}
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    className={styles.input}
                    value={form.dateOfBirth}
                    onChange={e =>
                      handleChange('dateOfBirth', e.target.value)
                    }
                    disabled={isSubmitting}
                  />
                  {errors.dateOfBirth && (
                    <span className={styles.error}>
                      {errors.dateOfBirth}
                    </span>
                  )}
                </div>

                {/* Endereço */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="address" className={styles.label}>
                    Endereço completo{' '}
                    <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="address"
                    className={`${styles.input} ${styles.textarea}`}
                    value={form.address}
                    onChange={e => handleChange('address', e.target.value)}
                    placeholder="Rua, número, bairro, cidade - UF"
                    rows={3}
                    disabled={isSubmitting}
                  />
                  {errors.address && (
                    <span className={styles.error}>{errors.address}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer igual StudentsCreate */}
            <div className={styles.footer}>
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

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
              >
                <FaSave />
                {isSubmitting ? 'Salvando...' : 'Salvar professor'}
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}
