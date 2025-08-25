// app/page.test.tsx

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from './page';

// Mock do next/link com tipagem correta e displayName
jest.mock('next/link', () => {
  const Link = ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>;
  Link.displayName = 'Link';
  return Link;
});

describe('HomePage', () => {
  it('renderiza título principal e descrição', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { name: /bem-vindo ao sistema de gestão escolar/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Gerencie facilmente alunos, professores, disciplinas/i)
    ).toBeInTheDocument();
  });

  it('renderiza todos os links de navegação principais', () => {
    render(<HomePage />);

    expect(screen.getByRole('link', { name: /Gerenciar Alunos/i })).toHaveAttribute(
      'href',
      '/students'
    );

    expect(screen.getByRole('link', { name: /Gerenciar Professores/i })).toHaveAttribute(
      'href',
      '/teachers'
    );

    expect(screen.getByRole('link', { name: /Gerenciar Disciplinas/i })).toHaveAttribute(
      'href',
      '/subjects'
    );

    expect(screen.getByRole('link', { name: /Gerenciar Salas/i })).toHaveAttribute(
      'href',
      '/classrooms'
    );

    expect(screen.getByRole('link', { name: /Gerenciar Matrículas/i })).toHaveAttribute(
      'href',
      '/enrollments'
    );
  });
});
