// src/app/(auth)/layout.tsx
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Layout das rotas de autenticação:
 * - Não exibe sidebar/topbar
 * - Fundo neutro com foco no card de login/registro
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background:
          'radial-gradient(circle at top, #020617 0%, #020617 40%, #020617 40%, #020617 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1120px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
          gap: '2.5rem',
          alignItems: 'center',
        }}
      >
        {/* Bloco hero simples à esquerda (pode ser evoluído depois) */}
        <div
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: '1rem',
            color: '#e5e7eb',
          }}
        >
          <h1
            style={{
              fontSize: '1.9rem',
              lineHeight: 1.2,
              fontWeight: 700,
              letterSpacing: '-0.03em',
            }}
          >
            School Management
          </h1>
          <p
            style={{
              fontSize: '0.95rem',
              color: '#9ca3af',
              maxWidth: '420px',
            }}
          >
            Acesse o painel administrativo para gerenciar alunos, professores,
            matrículas e toda a operação acadêmica em um só lugar.
          </p>
        </div>

        {/* Card de autenticação (conteúdo da página) */}
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
