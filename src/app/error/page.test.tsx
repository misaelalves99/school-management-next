// src/app/error/page.test.tsx

import { render, screen } from '@testing-library/react';
import ErrorPage from './page';
import { useSearchParams } from 'next/navigation';

// Mock do useSearchParams
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

describe('ErrorPage', () => {
  it('renderiza conteúdo padrão sem parâmetros', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: () => null,
    });

    render(<ErrorPage />);

    expect(screen.getByText('Ops! Algo deu errado.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Desculpe, ocorreu um erro inesperado enquanto processávamos sua requisição.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('⬅ Voltar para o Início')).toBeInTheDocument();
  });

  it('renderiza detalhes do erro quando query params são fornecidos', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) =>
        key === 'message'
          ? 'Mensagem de erro de teste'
          : key === 'stack'
          ? 'Stack trace de teste'
          : null,
    });

    render(<ErrorPage />);

    expect(screen.getByText('Detalhes do Erro:')).toBeInTheDocument();
    expect(screen.getByText(/Mensagem de erro de teste/)).toBeInTheDocument();
    expect(screen.getByText(/Stack trace de teste/)).toBeInTheDocument();
  });

  it('renderiza somente mensagem do erro se stack não estiver presente', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => (key === 'message' ? 'Erro sem stack' : null),
    });

    render(<ErrorPage />);

    expect(screen.getByText(/Erro sem stack/)).toBeInTheDocument();
    expect(screen.queryByText(/<pre>/)).not.toBeInTheDocument();
  });
});
