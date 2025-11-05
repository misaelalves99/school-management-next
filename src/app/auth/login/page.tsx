// app/auth/login/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useAuth } from '@/app/hooks/useAuth';
import SocialButton from '@/app/components/ui/SocialButton';
import styles from '../AuthForm.module.css';

export default function LoginPage() {
  const { login, loginWithGoogle, loginWithFacebook, mapAuthError } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mapError = useMemo(
    () =>
      mapAuthError ??
      ((code?: string) => {
        switch (code) {
          case 'auth/invalid-email': return 'E-mail inválido.';
          case 'auth/user-not-found': return 'Usuário não encontrado.';
          case 'auth/wrong-password':
          case 'auth/invalid-credential': return 'E-mail ou senha incorretos.';
          case 'auth/too-many-requests': return 'Muitas tentativas. Tente novamente mais tarde.';
          case 'auth/unauthorized-domain': return 'Domínio não autorizado nas configurações do Firebase.';
          default: return 'Falha na autenticação. Tente novamente.';
        }
      }),
    [mapAuthError]
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Preencha e-mail e senha.');
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const ok = await login(email.trim(), password.trim());
      if (ok) router.push('/');
      else setErrorMsg(mapError());
    } catch (err: any) {
      setErrorMsg(mapError(err?.code));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    if (submitting) return;
    setSubmitting(true); setErrorMsg(null);
    try {
      const ok = await loginWithGoogle();
      if (ok) router.push('/');
      else setErrorMsg(mapError());
    } catch (err: any) {
      setErrorMsg(mapError(err?.code));
    } finally { setSubmitting(false); }
  };

  const handleFacebook = async () => {
    if (submitting) return;
    setSubmitting(true); setErrorMsg(null);
    try {
      const ok = await loginWithFacebook();
      if (ok) router.push('/');
      else setErrorMsg(mapError());
    } catch (err: any) {
      setErrorMsg(mapError(err?.code));
    } finally { setSubmitting(false); }
  };

  const isDisabled = submitting || !email.trim() || !password.trim();

  return (
    <div className={styles.container}>
      <div className={styles.imageSide}>
        <div className={styles.overlay}>
          <h2 className={styles.welcomeTitle}>Excelência em cada detalhe</h2>
          <p className={styles.welcomeText}>Promovendo qualidade e confiabilidade em tudo o que fazemos.</p>
        </div>
        <img src="/assets/auth-banner.png" alt="School Management" />
      </div>

      <div className={styles.formSide}>
        <h1 className={styles.title}>Entrar</h1>
        <p className={styles.subtitle}>Acesse sua conta para continuar.</p>

        {errorMsg && <div className={styles.error}>{errorMsg}</div>}

        <form onSubmit={handleLogin} className={styles.form} noValidate>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
            autoComplete="email"
            inputMode="email"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
            autoComplete="current-password"
          />
          <button type="submit" className={styles.btnPrimary} disabled={isDisabled}>
            {submitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div className={styles.divider}>ou</div>

        <div className={styles.socialButtons}>
          <SocialButton icon={FaGoogle} color="#DB4437" ariaLabel="Entrar com Google" onClick={handleGoogle} disabled={submitting} />
          <SocialButton icon={FaFacebookF} color="#1877F2" ariaLabel="Entrar com Facebook" onClick={handleFacebook} disabled={submitting} />
        </div>

        <p className={styles.text}>
          Não possui conta? <Link href="/auth/register" className={styles.link}>Registre-se</Link>
        </p>
      </div>
    </div>
  );
}
