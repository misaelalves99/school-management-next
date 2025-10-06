// app/auth/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useAuth } from '@/app/hooks/useAuth';
import SocialButton from '@/app/components/ui/SocialButton';
import styles from '../AuthForm.module.css';

export default function RegisterPage() {
  const { register, loginWithGoogle, loginWithFacebook } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(formData.name, formData.email, formData.password);
    setLoading(false);
    if (success) router.push('/');
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const success = await loginWithGoogle();
    setLoading(false);
    if (success) router.push('/');
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    const success = await loginWithFacebook();
    setLoading(false);
    if (success) router.push('/');
  };

  return (
    <div className={styles.container}>
      {/* Lado esquerdo: imagem e mensagem */}
      <div className={styles.imageSide}>
        <div className={styles.overlay}>
          <h2 className={styles.welcomeTitle}>Excelência em cada detalhe</h2>
          <p className={styles.welcomeText}>
            Promovendo qualidade e confiabilidade em tudo o que fazemos.
          </p>
        </div>
        <img src="/assets/auth-banner.png" alt="Registro" />
      </div>

      {/* Lado direito: formulário */}
      <div className={styles.formSide}>
        <h1 className={styles.title}>Criar Conta</h1>
        <p className={styles.subtitle}>
          Cadastre-se para acessar o sistema de gerenciamento de funcionários.
        </p>

        <form onSubmit={handleRegister} className={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Nome completo"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <div className={styles.divider}>ou</div>

        <div className={styles.socialButtons}>
          <SocialButton
            icon={FaGoogle}
            color="#DB4437"
            ariaLabel="Entrar com Google"
            onClick={handleGoogleLogin}
          />
          <SocialButton
            icon={FaFacebookF}
            color="#1877F2"
            ariaLabel="Entrar com Facebook"
            onClick={handleFacebookLogin}
          />
        </div>

        <p className={styles.text}>
          Já possui uma conta?{' '}
          <Link href="/auth/login" className={styles.link}>
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
