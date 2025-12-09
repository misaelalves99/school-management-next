// src/app/(dashboard)/privacy-policy/page.test.tsx

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import PrivacyPolicyPage from './page.jsx';

jest.mock('@/app/components/ui/Card', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <section data-testid="card" {...props}>
      {children}
    </section>
  ),
}));

jest.mock('@/app/components/ui/Badge', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <span data-testid="badge" {...props}>
      {children}
    </span>
  ),
}));

describe('PrivacyPolicyPage (dashboard)', () => {
  it('renderiza título principal e subtítulo', () => {
    render(<PrivacyPolicyPage />);

    expect(
      screen.getByRole('heading', {
        name: /Política de Privacidade/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Como o painel de gestão escolar trata/i),
    ).toBeInTheDocument();
  });

  it('exibe badges de contexto de ambiente', () => {
    render(<PrivacyPolicyPage />);

    expect(
      screen.getByText(/Ambiente de demonstração/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Somente dados fictícios/i),
    ).toBeInTheDocument();
  });

  it('renderiza seções principais da política', () => {
    render(<PrivacyPolicyPage />);

    expect(
      screen.getByText(/Visão geral/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Dados trabalhados no painel/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Autenticação e acesso/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Boas práticas recomendadas/i),
    ).toBeInTheDocument();
  });

  it('renderiza múltiplos cards com conteúdo', () => {
    render(<PrivacyPolicyPage />);

    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });
});
