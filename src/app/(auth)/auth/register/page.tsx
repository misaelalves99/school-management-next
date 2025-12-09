// src/app/(auth)/auth/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { FaUserPlus, FaGoogle, FaFacebook } from 'react-icons/fa';

import styles from './RegisterPage.module.css';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import {
  getFirebaseAuth,
  getGoogleProvider,
  getFacebookProvider,
} from '@/core/firebase/client';

type RegisterError = string | null;

// Como o arquivo é "use client", podemos obter as instâncias aqui:
const auth = getFirebaseAuth();
const googleProvider = getGoogleProvider();
const facebookProvider = getFacebookProvider();

// Rotas tipadas para satisfazer o tipo RouteImpl do Next 15
const DASHBOARD_ROUTE = '/' as Route;
const LOGIN_ROUTE = '/auth/login' as Route;

export default function RegisterPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<RegisterError>(null);

  const hasFormError = !displayName.trim() || !email.trim() || !password.trim();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (hasFormError) {
      setError('Preencha nome, e-mail e senha para continuar.');
      return;
    }

    try {
      setIsSubmitting(true);

      const { user } = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      if (user && displayName.trim()) {
        await updateProfile(user, { displayName: displayName.trim() });
      }

      // ✅ rota tipada
      router.push(DASHBOARD_ROUTE);
    } catch (err: any) {
      const code = err?.code ?? 'auth/unknown';
      let message = 'Não foi possível criar a conta. Tente novamente.';

      if (code === 'auth/email-already-in-use') {
        message = 'Este e-mail já está em uso.';
      } else if (code === 'auth/weak-password') {
        message = 'A senha deve ter pelo menos 6 caracteres.';
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleProviderRegister(provider: 'google' | 'facebook') {
    setError(null);

    try {
      setIsSubmitting(true);
      const selectedProvider =
        provider === 'google' ? googleProvider : facebookProvider;

      await signInWithPopup(auth, selectedProvider);

      // ✅ rota tipada
      router.push(DASHBOARD_ROUTE);
    } catch {
      setError('Não foi possível autenticar com o provedor selecionado.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className={styles.card}>
      <header className={styles.header}>
        <div className={styles.iconCircle}>
          <FaUserPlus className={styles.icon} />
        </div>

        <div>
          <h1 className={styles.title}>Criar conta administrativa</h1>
          <p className={styles.subtitle}>
            Cadastre um usuário para acessar o painel de gestão escolar.
            Ideal para secretaria, coordenação ou direção.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Nome completo
          </label>
          <input
            id="name"
            type="text"
            className={styles.input}
            placeholder="Nome e sobrenome"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            E-mail institucional
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            placeholder="seunome@escola.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Senha
          </label>
          <input
            id="password"
            type="password"
            className={styles.input}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </div>
      </form>

      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>ou cadastre com</span>
        <span className={styles.dividerLine} />
      </div>

      <div className={styles.providers}>
        <button
          type="button"
          className={styles.providerButton}
          onClick={() => handleProviderRegister('google')}
          disabled={isSubmitting}
        >
          <FaGoogle className={styles.providerIcon} />
          <span>Google</span>
        </button>

        <button
          type="button"
          className={styles.providerButton}
          onClick={() => handleProviderRegister('facebook')}
          disabled={isSubmitting}
        >
          <FaFacebook className={styles.providerIcon} />
          <span>Facebook</span>
        </button>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerText}>Já possui acesso?</span>
        <button
          type="button"
          className={styles.footerLink}
          onClick={() => router.push(LOGIN_ROUTE)} // ✅ rota tipada
        >
          Voltar para login
        </button>
      </footer>
    </Card>
  );
}
