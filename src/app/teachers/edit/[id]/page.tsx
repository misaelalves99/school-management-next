// src/app/teachers/edit/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './EditPage.module.css';
import type { TeacherFormData } from '../../../types/Teacher';
import { useTeachers } from '../../../hooks/useTeachers';

export default function TeacherEdit() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const { getTeacherById, updateTeacher } = useTeachers();

  const [formData, setFormData] = useState<TeacherFormData>({
    name: '',
    email: '',
    dateOfBirth: '',
    subject: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TeacherFormData, string>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const teacher = getTeacherById(id);
    if (!teacher) {
      alert('Professor não encontrado');
      router.push('/teachers');
      return;
    }
    setFormData({
      name: teacher.name,
      email: teacher.email,
      dateOfBirth: teacher.dateOfBirth,
      subject: teacher.subject,
      phone: teacher.phone,
      address: teacher.address,
    });
    setLoading(false);
  }, [id, router, getTeacherById]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TeacherFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório.';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido.';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Data de nascimento é obrigatória.';
    if (!formData.subject.trim()) newErrors.subject = 'Disciplina é obrigatória.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) return;

    updateTeacher(id, formData);
    alert('Professor atualizado com sucesso!');
    router.push('/teachers');
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.createTitle}>Editar Professor</h1>

      <form onSubmit={handleSubmit} className={styles.createForm}>
        {Object.entries(formData).map(([key, value]) => {
          let label = '';
          let placeholder = '';

          switch (key) {
            case 'name':
              label = 'Nome';
              placeholder = 'Digite o nome do professor';
              break;
            case 'email':
              label = 'Email';
              placeholder = 'Digite o email';
              break;
            case 'dateOfBirth':
              label = 'Data de Nascimento';
              placeholder = '';
              break;
            case 'subject':
              label = 'Disciplina';
              placeholder = 'Digite a disciplina';
              break;
            case 'phone':
              label = 'Telefone';
              placeholder = 'Digite o telefone';
              break;
            case 'address':
              label = 'Endereço';
              placeholder = 'Digite o endereço';
              break;
            default:
              label = key;
              placeholder = '';
          }

          return (
            <div key={key} className={styles.formGroup}>
              <label htmlFor={key} className={styles.formLabel}>{label}</label>
              <input
                id={key}
                name={key}
                type={key === 'dateOfBirth' ? 'date' : 'text'}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={styles.formInput}
              />
              {errors[key as keyof TeacherFormData] && (
                <span className={styles.formError}>
                  {errors[key as keyof TeacherFormData]}
                </span>
              )}
            </div>
          );
        })}

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>Salvar Alterações</button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => router.push('/teachers')}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
