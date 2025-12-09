// src/app/(dashboard)/students/create/page.tsx

'use client';

import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  FaArrowLeft,
  FaSave,
  FaUserGraduate,
} from 'react-icons/fa';

import styles from './CreatePage.module.css';

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

export default function StudentCreatePage(): JSX.Element {
  const router = useRouter();
  const { createStudent } = useStudents();

  const [form, setForm] = useState<StudentFormData>(initialFormState);
  const [errors, setErrors] = useState<
    Partial<Record<keyof StudentFormData, string>>
  >({});

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!validate()) return;

    createStudent(form);
    alert('Aluno cadastrado com sucesso!');
    router.push('/students');
  };

  const handleCancel = (): void => {
    router.push('/students');
  };

  return (
    <div className={styles.page}>
      {/* ===== Header (layout padronizado) ===== */}
      <header className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            <span className={styles.titleIconWrapper}>
              <FaUserGraduate className={styles.titleIcon} />
            </span>
            Novo aluno
          </h1>

          <p className={styles.subtitle}>
            Cadastre um novo aluno informando dados pessoais, contato e número
            de matrícula. Esses dados serão usados em matrículas, presenças e
            relatórios acadêmicos.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
          >
            <FaArrowLeft />
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
                  <label htmlFor="enrollmentNumber" className={styles.label}>
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
              >
                <FaArrowLeft />
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
              >
                <FaSave />
                Salvar aluno
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}
