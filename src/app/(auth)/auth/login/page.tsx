// src/app/(auth)/auth/login/page.tsx
'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { FaGoogle, FaFacebook, FaSchool } from 'react-icons/fa';

import styles from './LoginPage.module.css';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import {
  getFirebaseAuth,
  getGoogleProvider,
  getFacebookProvider,
} from '@/core/firebase/client';

type AuthError = string | null;

// Como este arquivo é "use client", podemos obter as instâncias aqui:
const auth = getFirebaseAuth();
const googleProvider = getGoogleProvider();
const facebookProvider = getFacebookProvider();

// Rotas tipadas para compatibilizar com RouteImpl do Next
const DASHBOARD_ROUTE = '/' as Route;
const REGISTER_ROUTE = '/auth/register' as Route;

function getFirebaseErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code?: unknown }).code === 'string'
  ) {
    const code = (error as { code: string }).code;

    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
      return 'E-mail ou senha inválidos.';
    }
    if (code === 'auth/user-not-found') {
      return 'Usuário não encontrado. Verifique o e-mail ou cadastre-se.';
    }
  }

  return 'Não foi possível entrar. Tente novamente.';
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<AuthError>(null);

  const hasFormError = !email.trim() || !password.trim();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAuthError(null);

    if (hasFormError) {
      setAuthError('Informe e-mail e senha para continuar.');
      return;
    }

    try {
      setIsSubmitting(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);

      // rota raiz usa o layout do dashboard
      router.push(DASHBOARD_ROUTE);
    } catch (error) {
      setAuthError(getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleProviderLogin(provider: 'google' | 'facebook') {
    setAuthError(null);

    try {
      setIsSubmitting(true);
      const selectedProvider =
        provider === 'google' ? googleProvider : facebookProvider;

      await signInWithPopup(auth, selectedProvider);
      router.push(DASHBOARD_ROUTE);
    } catch {
      setAuthError('Não foi possível autenticar com o provedor escolhido.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className={styles.card}>
      <header className={styles.header}>
        <div className={styles.logoCircle}>
          <FaSchool className={styles.logoIcon} />
        </div>

        <div>
          <h1 className={styles.title}>Entrar no painel escolar</h1>
          <p className={styles.subtitle}>
            Acesse o dashboard administrativo para gerenciar alunos,
            professores, disciplinas, salas e matrículas.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            E-mail institucional
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={styles.input}
            placeholder="seunome@escola.com"
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
            autoComplete="current-password"
            className={styles.input}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {authError && <p className={styles.error}>{authError}</p>}

        <div className={styles.actions}>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </div>
      </form>

      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>ou continue com</span>
        <span className={styles.dividerLine} />
      </div>

      <div className={styles.providers}>
        <button
          type="button"
          className={styles.providerButton}
          onClick={() => handleProviderLogin('google')}
          disabled={isSubmitting}
        >
          <FaGoogle className={styles.providerIcon} />
          <span>Google</span>
        </button>

        <button
          type="button"
          className={styles.providerButton}
          onClick={() => handleProviderLogin('facebook')}
          disabled={isSubmitting}
        >
          <FaFacebook className={styles.providerIcon} />
          <span>Facebook</span>
        </button>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerText}>Ainda não tem acesso?</span>
        <button
          type="button"
          className={styles.footerLink}
          onClick={() => router.push(REGISTER_ROUTE)}
        >
          Criar conta administrativa
        </button>
      </footer>
    </Card>
  );
}
