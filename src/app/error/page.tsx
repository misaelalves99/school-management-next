// src/app/error/page.tsx

'use client';

import styles from './ErrorPage.module.css';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { ErrorData } from '../types/ErrorData';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') ?? undefined;
  const errorStack = searchParams.get('stack') ?? undefined;

  const error: ErrorData | undefined =
    errorMessage ? { message: errorMessage, stack: errorStack ?? undefined } : undefined;

  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.errorTitle}>Ops! Algo deu errado.</h1>

      <p className={styles.errorDescription}>
        Desculpe, ocorreu um erro inesperado enquanto processávamos sua requisição.
      </p>

      {error && (
        <div className={styles.errorDetails}>
          <h3>Detalhes do Erro:</h3>
          <p>
            <strong>Mensagem:</strong> {error.message}
          </p>
          {error.stack && <pre>{error.stack}</pre>}
        </div>
      )}

      <Link href="/" className={styles.btnReturn}>
        ⬅ Voltar para o Início
      </Link>
    </div>
  );
}
