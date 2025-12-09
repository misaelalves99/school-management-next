// src/app/(dashboard)/subjects/create/page.tsx

'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaBookOpen, FaSave } from 'react-icons/fa';

import styles from './CreatePage.module.css';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { useSubjects } from '@/core/hooks/useSubjects';
import type { Subject } from '@/types/Subject';

interface SubjectFormState {
  name: string;
  workloadHours: string; // string no form, convertemos ao salvar
  description: string;
}

type ValidationErrors = Partial<Record<keyof SubjectFormState, string>>;

const INITIAL_FORM_STATE: SubjectFormState = {
  name: '',
  workloadHours: '',
  description: '',
};

export default function SubjectCreatePage(): JSX.Element {
  const router = useRouter();
  const { addSubject } = useSubjects();

  const [form, setForm] = useState<SubjectFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = (): void => {
    router.push('/subjects');
  };

  function handleChange(field: keyof SubjectFormState, value: string): void {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [field]: '',
    }));
  }

  function validate(values: SubjectFormState): ValidationErrors {
    const newErrors: ValidationErrors = {};

    if (!values.name.trim()) {
      newErrors.name = 'Nome da disciplina é obrigatório.';
    }

    if (values.workloadHours.trim()) {
      const parsed = Number(values.workloadHours.replace(',', '.'));
      if (Number.isNaN(parsed)) {
        newErrors.workloadHours = 'Carga horária deve ser um número.';
      } else if (parsed < 0) {
        newErrors.workloadHours =
          'Carga horária não pode ser negativa.';
      }
    }

    return newErrors;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const validation = validate(form);
    const hasErrors = Object.keys(validation).length > 0;

    if (hasErrors) {
      setErrors(validation);
      return;
    }

    try {
      setIsSubmitting(true);

      const workload =
        form.workloadHours.trim() === ''
          ? undefined
          : Number(form.workloadHours.replace(',', '.'));

      const payload: Omit<Subject, 'id'> = {
        name: form.name.trim(),
        // 🔧 sempre string, sem undefined → corrige o erro de tipo
        description: form.description.trim(),
        workloadHours:
          typeof workload === 'number' && !Number.isNaN(workload)
            ? workload
            : undefined,
      };

      await addSubject(payload);
      // opcional: alert/ toast
      // alert('Disciplina cadastrada com sucesso!');
      router.push('/subjects');
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
              <FaBookOpen className={styles.titleIcon} />
            </span>
            Nova disciplina
          </h1>

          <p className={styles.subtitle}>
            Cadastre uma disciplina com nome, carga horária e descrição.
            Isso ajuda a manter a grade curricular organizada para
            secretaria e coordenação pedagógica.
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
            Voltar para disciplinas
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
                {/* Nome da disciplina */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Nome da disciplina
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={styles.input}
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    placeholder="Ex.: Matemática, História, Biologia"
                  />
                  {errors.name && (
                    <span className={styles.error}>{errors.name}</span>
                  )}
                </div>

                {/* Carga horária (opcional) */}
                <div className={styles.fieldGroup}>
                  <label
                    htmlFor="workloadHours"
                    className={styles.label}
                  >
                    Carga horária (em horas)
                  </label>
                  <input
                    id="workloadHours"
                    type="number"
                    min={0}
                    className={styles.input}
                    value={form.workloadHours}
                    onChange={e =>
                      handleChange('workloadHours', e.target.value)
                    }
                    placeholder="Ex.: 40"
                  />
                  {errors.workloadHours && (
                    <span className={styles.error}>
                      {errors.workloadHours}
                    </span>
                  )}
                  <p className={styles.helperText}>
                    Deixe vazio se ainda não desejar informar.
                  </p>
                </div>
              </div>

              {/* Coluna 2 */}
              <div className={styles.column}>
                {/* Descrição */}
                <div className={styles.fieldGroup}>
                  <label
                    htmlFor="description"
                    className={styles.label}
                  >
                    Descrição da disciplina
                  </label>
                  <textarea
                    id="description"
                    className={`${styles.input} ${styles.textarea}`}
                    value={form.description}
                    onChange={e =>
                      handleChange('description', e.target.value)
                    }
                    placeholder="Descreva brevemente os conteúdos abordados, objetivos e público-alvo."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Ações (footer padronizado) */}
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
                iconLeft={<FaSave />}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar disciplina'}
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}
