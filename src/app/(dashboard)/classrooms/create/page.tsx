// src/app/(dashboard)/classrooms/create/page.tsx
'use client';

import {
  useState,
  type FormEvent,
  type ChangeEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  FaArrowLeft,
  FaChalkboardTeacher,
  FaPlus,
  FaUsers,
} from 'react-icons/fa';

import styles from './CreatePage.module.css';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import { useClassRooms } from '@/core/hooks/useClassRooms';

type ClassRoomForm = {
  name: string;
  schedule: string;
  capacity: string;
};

type ClassRoomErrors = Partial<Record<keyof ClassRoomForm, string>>;

export default function ClassRoomCreatePage(): JSX.Element {
  const router = useRouter();
  const { createClassRoom, classRooms } = useClassRooms();

  const [form, setForm] = useState<ClassRoomForm>({
    name: '',
    schedule: '',
    capacity: '',
  });

  const [errors, setErrors] = useState<ClassRoomErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: ClassRoomErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Nome da turma é obrigatório.';
    }

    if (!form.schedule.trim()) {
      newErrors.schedule = 'Horário/turno é obrigatório.';
    }

    if (!form.capacity.trim()) {
      newErrors.capacity = 'Capacidade é obrigatória.';
    } else {
      const capacityNumber = Number(form.capacity);
      if (Number.isNaN(capacityNumber) || capacityNumber <= 0) {
        newErrors.capacity =
          'Informe um número de alunos maior que zero.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const capacityNumber = Number(form.capacity);

      createClassRoom({
        name: form.name.trim(),
        schedule: form.schedule.trim(),
        capacity: capacityNumber,
      });

      alert('Turma criada com sucesso!');
      router.push('/classrooms');
    } catch (error) {
      console.error('Erro ao criar turma:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    router.push('/classrooms');
  };

  return (
    <div className={styles.page}>
      {/* ===== Header (layout padronizado com StudentsCreate) ===== */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <span className={styles.titleIconWrapper}>
              <FaChalkboardTeacher className={styles.titleIcon} />
            </span>
            Nova turma / sala
          </h1>

          <p className={styles.subtitle}>
            Defina nome, horário e capacidade da turma. Depois você poderá
            associar alunos, professores e disciplinas a essa sala para
            organizar a rotina acadêmica.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Badge variant="soft">
            <FaUsers />
            {classRooms.length} turmas cadastradas
          </Badge>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <FaArrowLeft />
            Voltar para turmas
          </Button>
        </div>
      </header>

      {/* ===== Form ===== */}
      <section className={styles.formSection}>
        <Card className={styles.formCard}>
          <form
            onSubmit={handleSubmit}
            className={styles.form}
            noValidate
          >
            <div className={styles.formGrid}>
              {/* Coluna 1 */}
              <div className={styles.column}>
                {/* Nome da turma */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Nome da turma
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={`${styles.input} ${
                      errors.name ? styles.inputError : ''
                    }`}
                    placeholder="Ex.: 1º Ano A, 8º Ano B, 3º Médio C..."
                    value={form.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <span className={styles.error}>{errors.name}</span>
                  )}
                </div>

                {/* Horário / turno */}
                <div className={styles.fieldGroup}>
                  <label
                    htmlFor="schedule"
                    className={styles.label}
                  >
                    Horário / turno
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="schedule"
                    name="schedule"
                    type="text"
                    className={`${styles.input} ${
                      errors.schedule ? styles.inputError : ''
                    }`}
                    placeholder="Ex.: Manhã (07:00 - 11:30) | Tarde (13:00 - 17:30)"
                    value={form.schedule}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.schedule && (
                    <span className={styles.error}>
                      {errors.schedule}
                    </span>
                  )}
                </div>
              </div>

              {/* Coluna 2 */}
              <div className={styles.column}>
                {/* Capacidade */}
                <div className={styles.fieldGroup}>
                  <label
                    htmlFor="capacity"
                    className={styles.label}
                  >
                    Capacidade máxima de alunos
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min={1}
                    className={`${styles.input} ${
                      errors.capacity ? styles.inputError : ''
                    }`}
                    placeholder="Ex.: 30"
                    value={form.capacity}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.capacity && (
                    <span className={styles.error}>
                      {errors.capacity}
                    </span>
                  )}
                  <p className={styles.helperText}>
                    Mantenha a capacidade próxima à realidade física da
                    sala para evitar superlotação.
                  </p>
                </div>

                {/* Dicas (antigo HintCard, agora dentro do form) */}
                <div className={styles.hintBox}>
                  <h2 className={styles.hintTitle}>
                    Boas práticas para turmas
                  </h2>
                  <ul className={styles.hintList}>
                    <li>
                      Use um padrão consistente no nome, como{' '}
                      <strong>“1º Ano A”</strong> ou{' '}
                      <strong>“3º Médio B”</strong>.
                    </li>
                    <li>
                      Defina a capacidade de acordo com o tamanho
                      real da sala.
                    </li>
                    <li>
                      No horário, informe turno e faixa horária para
                      facilitar o planejamento de agenda.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer / Ações (padronizado com StudentsCreate) */}
            <div className={styles.footer}>
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={handleCancel}
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
                <FaPlus />
                {isSubmitting ? 'Salvando...' : 'Salvar turma'}
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}
