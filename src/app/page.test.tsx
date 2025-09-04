// app/page.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from './page';

// Mock do next/link com tipagem correta
jest.mock('next/link', () => {
  const Link = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  );
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
      screen.getByText(
        /Gerencie facilmente alunos, professores, disciplinas, matrículas, presenças e notas/i
      )
    ).toBeInTheDocument();
  });

  it('renderiza todos os links de navegação principais', () => {
    render(<HomePage />);

    const links = [
      { name: /Gerenciar Alunos/i, href: '/students' },
      { name: /Gerenciar Professores/i, href: '/teachers' },
      { name: /Gerenciar Disciplinas/i, href: '/subjects' },
      { name: /Gerenciar Salas/i, href: '/classrooms' },
      { name: /Gerenciar Matrículas/i, href: '/enrollments' },
    ];

    links.forEach(({ name, href }) => {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href);
    });
  });
});
