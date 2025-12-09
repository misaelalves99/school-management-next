// src/app/(dashboard)/subjects/edit/[id]/page.tsx

'use client';

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaBookOpen, FaSave } from 'react-icons/fa';

import styles from './EditPage.module.css';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { useSubjects } from '@/core/hooks/useSubjects';

type EditFormState = {
  name: string;
  description: string;
  workloadHours: string;
};

type FormErrors = {
  name?: string;
};

const INITIAL_FORM_STATE: EditFormState = {
  name: '',
  description: '',
  workloadHours: '',
};

export default function SubjectEditPage(): JSX.Element {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { getSubjectById, updateSubject } = useSubjects();

  const id = useMemo(() => {
    const raw = params?.id;
    const num = Number(raw);
    return Number.isNaN(num) ? undefined : num;
  }, [params]);

  const [form, setForm] = useState<EditFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id === undefined) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const subject = getSubjectById(id);
    if (!subject) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setForm({
      name: subject.name ?? '',
      description: subject.description ?? '',
      workloadHours:
        subject.workloadHours !== undefined
          ? String(subject.workloadHours)
          : '',
    });

    setLoading(false);
  }, [id, getSubjectById]);

  const handleBack = (): void => {
    router.push('/subjects');
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'O nome da disciplina é obrigatório.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));

    setErrors(prev => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (id === undefined || notFound) return;

    if (!validate()) return;

    setIsSubmitting(true);

    const workloadNumber = form.workloadHours
      ? Number(form.workloadHours.replace(',', '.'))
      : undefined;

    updateSubject(id, {
      name: form.name.trim(),
      description: form.description.trim(),
      workloadHours:
        workloadNumber !== undefined && !Number.isNaN(workloadNumber)
          ? workloadNumber
          : undefined,
    });

    setIsSubmitting(false);

    window.alert('Disciplina atualizada com sucesso!');
    router.push('/subjects');
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingSkeleton} />
        <p className={styles.loadingText}>Carregando disciplina...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className={styles.notFoundWrapper}>
        <Card className={styles.notFoundCard}>
          <h1 className={styles.notFoundTitle}>Disciplina não encontrada</h1>
          <p className={styles.notFoundSubtitle}>
            Não foi possível localizar a disciplina informada. Verifique se o
            link está correto ou retorne para a lista.
          </p>

          <div className={styles.notFoundActions}>
            <Button
              type="button"
              variant="ghost"
              size="md"
              iconLeft={<FaArrowLeft />}
              onClick={handleBack}
            >
              Voltar para disciplinas
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
              <FaBookOpen className={styles.titleIcon} />
            </span>
            Editar disciplina
          </h1>

          <p className={styles.subtitle}>
            Atualize os dados da disciplina utilizada em turmas e matrículas.
            Ajuste o nome, descrição e carga horária de forma centralizada.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconLeft={<FaArrowLeft />}
            onClick={handleBack}
          >
            Voltar para disciplinas
          </Button>
        </div>
      </header>

      {/* ===== Form (layout igual ao edit de students) ===== */}
      <section className={styles.formSection}>
        <Card className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.formGrid}>
              {/* Coluna 1: nome + carga horária */}
              <div className={styles.column}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Nome da disciplina <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Ex.: Matemática Aplicada"
                  />
                  {errors.name && (
                    <span className={styles.error}>{errors.name}</span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label
                    htmlFor="workloadHours"
                    className={styles.label}
                  >
                    Carga horária (horas)
                  </label>
                  <input
                    id="workloadHours"
                    name="workloadHours"
                    type="number"
                    min={0}
                    value={form.workloadHours}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Ex.: 60"
                  />
                  <p className={styles.helperText}>
                    Deixe vazio se ainda não desejar informar.
                  </p>
                </div>
              </div>

              {/* Coluna 2: descrição */}
              <div className={styles.column}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="description" className={styles.label}>
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className={`${styles.input} ${styles.textarea}`}
                    rows={4}
                    placeholder="Descreva objetivos, conteúdos principais e observações da disciplina."
                  />
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <Button
                type="button"
                variant="ghost"
                size="md"
                iconLeft={<FaArrowLeft />}
                onClick={handleBack}
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
