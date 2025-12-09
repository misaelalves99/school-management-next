// src/app/(dashboard)/classrooms/edit/[id]/page.tsx

'use client';

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FaArrowLeft,
  FaChalkboardTeacher,
  FaSave,
  FaUsers,
} from 'react-icons/fa';

import styles from './EditPage.module.css';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';
import { useClassRooms } from '@/core/hooks/useClassRooms';

type ClassRoomForm = {
  name: string;
  schedule: string;
  capacity: string;
};

export default function ClassRoomEditPage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { findById, updateClassRoom } = useClassRooms();

  const [form, setForm] = useState<ClassRoomForm>({
    name: '',
    schedule: '',
    capacity: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ClassRoomForm, string>>
  >({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const idParam = params?.id;
  const numericId = Number(idParam);

  useEffect(() => {
    if (Number.isNaN(numericId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const classRoom = findById(numericId);

    if (!classRoom) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setForm({
      name: classRoom.name ?? '',
      schedule: classRoom.schedule ?? '',
      capacity:
        typeof classRoom.capacity === 'number'
          ? String(classRoom.capacity)
          : '',
    });
    setLoading(false);
  }, [numericId, findById]);

  const handleBack = (): void => {
    router.push('/classrooms');
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({
      ...prev,
      [name as keyof ClassRoomForm]: '',
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ClassRoomForm, string>> = {};

    if (!form.name.trim()) newErrors.name = 'Nome da turma é obrigatório.';
    if (!form.schedule.trim())
      newErrors.schedule = 'Horário/turno é obrigatório.';

    if (!form.capacity.trim()) {
      newErrors.capacity = 'Capacidade é obrigatória.';
    } else {
      const capacityNumber = Number(form.capacity);
      if (Number.isNaN(capacityNumber) || capacityNumber <= 0) {
        newErrors.capacity = 'Informe um número de alunos maior que zero.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (Number.isNaN(numericId) || notFound) return;

    if (!validate()) return;

    const capacityNumber = Number(form.capacity);

    setIsSubmitting(true);

    updateClassRoom(numericId, {
      name: form.name.trim(),
      schedule: form.schedule.trim(),
      capacity: capacityNumber,
    });

    setIsSubmitting(false);

    alert('Turma atualizada com sucesso!');
    router.push('/classrooms');
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingSkeleton} />
        <p className={styles.loadingText}>Carregando turma...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className={styles.notFoundWrapper}>
        <Card className={styles.notFoundCard}>
          <h1 className={styles.notFoundTitle}>Turma não encontrada</h1>
          <p className={styles.notFoundSubtitle}>
            Não foi possível localizar a turma solicitada. Ela pode ter sido
            removida ou o link está incorreto.
          </p>
          <div className={styles.notFoundActions}>
            <Button
              type="button"
              variant="ghost"
              size="md"
              iconLeft={<FaArrowLeft />}
              onClick={handleBack}
            >
              Voltar para turmas
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
              <FaChalkboardTeacher className={styles.titleIcon} />
            </span>
            Editar turma / sala
          </h1>
          <p className={styles.subtitle}>
            Atualize informações de identificação, horário e capacidade da
            turma. Essas mudanças impactam a organização de matrículas, agenda
            da escola e lotação de sala.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Badge variant="neutral" size="md">
            <FaUsers />
            ID #{numericId}
          </Badge>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconLeft={<FaArrowLeft />}
            onClick={handleBack}
          >
            Voltar para turmas
          </Button>
        </div>
      </header>

      {/* ===== Form ===== */}
      <section className={styles.formSection}>
        <Card className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.formGrid}>
              {/* Coluna 1: nome + horário */}
              <div className={styles.column}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Nome da turma <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={styles.input}
                    placeholder="Ex.: 1º Ano A, 8º Ano B..."
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <span className={styles.error}>{errors.name}</span>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="schedule" className={styles.label}>
                    Horário / turno <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="schedule"
                    name="schedule"
                    type="text"
                    className={styles.input}
                    placeholder="Ex.: Manhã (07:00 - 11:30) | Tarde (13:00 - 17:30)"
                    value={form.schedule}
                    onChange={handleChange}
                  />
                  {errors.schedule && (
                    <span className={styles.error}>{errors.schedule}</span>
                  )}
                </div>
              </div>

              {/* Coluna 2: capacidade */}
              <div className={styles.column}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="capacity" className={styles.label}>
                    Capacidade máxima de alunos{' '}
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min={1}
                    className={styles.input}
                    placeholder="Ex.: 30"
                    value={form.capacity}
                    onChange={handleChange}
                  />
                  {errors.capacity && (
                    <span className={styles.error}>{errors.capacity}</span>
                  )}
                  <p className={styles.helperText}>
                    A capacidade influencia diretamente na lotação de alunos por
                    turma e no planejamento de matrículas.
                  </p>
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

        {/* Card de contexto (similar ao "impacto" que você tinha) */}
        <Card className={styles.hintCard}>
          <h2 className={styles.hintTitle}>Impacto das alterações</h2>
          <ul className={styles.hintList}>
            <li>
              Alterar o <strong>nome</strong> ajuda a manter o padrão de
              identificação das turmas no diário e nos relatórios.
            </li>
            <li>
              Ajustar o <strong>horário/turno</strong> garante alinhamento com a
              agenda da escola e evita conflitos de uso da sala.
            </li>
            <li>
              A <strong>capacidade</strong> influencia na lotação de alunos por
              turma e no planejamento de matrículas.
            </li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
