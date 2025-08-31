// src/app/students/edit/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./EditPage.module.css";
import type { Student } from "../../../types/Student";
import { useStudents } from "../../../hooks/useStudents";

export default function StudentEditPage() {
  const params = useParams();
  const router = useRouter();
  const { students, updateStudent } = useStudents();

  const id = params?.id ? Number(params.id) : null;

  const [formData, setFormData] = useState<Omit<Student, "id">>({
    name: "",
    email: "",
    dateOfBirth: "",
    enrollmentNumber: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof Omit<Student, "id">, string>>
  >({});

  // Carrega os dados do aluno
  useEffect(() => {
    if (!id) return;
    const student = students.find((s) => s.id === id);
    if (!student) {
      alert("Aluno não encontrado");
      router.push("/students");
      return;
    }
    setFormData({
      name: student.name,
      email: student.email,
      dateOfBirth: student.dateOfBirth,
      enrollmentNumber: student.enrollmentNumber,
      phone: student.phone,
      address: student.address,
    });
  }, [id, students, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório.";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email inválido.";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Data de nascimento é obrigatória.";
    if (!formData.enrollmentNumber.trim())
      newErrors.enrollmentNumber = "Matrícula é obrigatória.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) return;

    const updated = updateStudent(id, formData);
    if (!updated) {
      alert("Erro ao atualizar aluno");
      return;
    }

    alert("Aluno atualizado com sucesso!");
    router.push("/students");
  };

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.createTitle}>Editar Aluno</h1>
      <form onSubmit={handleSubmit} className={styles.createForm}>
        {Object.entries(formData).map(([key, value]) => {
          let label = "";
          let placeholder = "";

          switch (key) {
            case "name":
              label = "Nome";
              placeholder = "Digite o nome do aluno";
              break;
            case "email":
              label = "Email";
              placeholder = "Digite o email";
              break;
            case "dateOfBirth":
              label = "Data de Nascimento";
              placeholder = "";
              break;
            case "enrollmentNumber":
              label = "Matrícula";
              placeholder = "Número de matrícula";
              break;
            case "phone":
              label = "Telefone";
              placeholder = "Digite o telefone";
              break;
            case "address":
              label = "Endereço";
              placeholder = "Digite o endereço";
              break;
            default:
              label = key;
              placeholder = "";
          }

          return (
            <div key={key} className={styles.formGroup}>
              <label htmlFor={key} className={styles.formLabel}>
                {label}:
              </label>
              <input
                id={key}
                name={key}
                type={key === "dateOfBirth" ? "date" : "text"}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={styles.formInput}
              />
              {errors[key as keyof typeof formData] && (
                <span className={styles.formError}>
                  {errors[key as keyof typeof formData]}
                </span>
              )}
            </div>
          );
        })}

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>
            Salvar Alterações
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => router.push("/students")}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
