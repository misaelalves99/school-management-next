// src/app/error/page.tsx

'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FaExclamationTriangle,
  FaArrowLeft,
  FaHome,
  FaRedo,
} from 'react-icons/fa';

import Card from '@/app/components/ui/Card.jsx';
import Button from '@/app/components/ui/Button.jsx';

import styles from './ErrorPage.module.css';

export default function ErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { title, message, code } = useMemo(() => {
    const rawTitle = searchParams.get('title');
    const rawMessage = searchParams.get('message');
    const rawCode = searchParams.get('code');

    return {
      title: rawTitle ?? 'Algo deu errado',
      message:
        rawMessage ??
        'Ocorreu um erro ao processar a sua ação. Isso pode ter sido causado por uma rota inválida, um problema de autenticação ou um erro temporário no sistema.',
      code: rawCode ?? 'Erro',
    };
  }, [searchParams]);

  const handleBack = () => {
    // Tenta voltar para a página anterior
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleRetry = () => {
    // Recarrega a página atual
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <div className={styles.iconWrapper} aria-hidden="true">
          <FaExclamationTriangle />
        </div>

        <div className={styles.header}>
          <span className={styles.code}>{code}</span>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{message}</p>
        </div>

        <div className={styles.hintBox}>
          <p className={styles.hintTitle}>O que você pode fazer agora?</p>
          <ul className={styles.hintList}>
            <li>Verificar se o endereço da URL está correto.</li>
            <li>
              Garantir que você está autenticado antes de acessar áreas
              restritas do painel.
            </li>
            <li>
              Tentar novamente a ação que estava realizando ou voltar para a
              página inicial.
            </li>
          </ul>
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleRetry}
            leftIcon={<FaRedo />}
          >
            Tentar novamente
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleBack}
            leftIcon={<FaArrowLeft />}
          >
            Voltar
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleGoHome}
            leftIcon={<FaHome />}
          >
            Ir para a home
          </Button>
        </div>
      </Card>
    </div>
  );
}
