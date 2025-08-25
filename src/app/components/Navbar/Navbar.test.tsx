// app/components/Navbar/Navbar.test.tsx

import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';
import * as nextNavigation from 'next/navigation';
import '@testing-library/jest-dom';

describe('Navbar', () => {
  const usePathnameSpy = jest.spyOn(nextNavigation, 'usePathname');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar todos os links', () => {
    usePathnameSpy.mockReturnValue('/');

    render(<Navbar />);

    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Alunos')).toBeInTheDocument();
    expect(screen.getByText('Professores')).toBeInTheDocument();
    expect(screen.getByText('Disciplinas')).toBeInTheDocument();
    expect(screen.getByText('Salas')).toBeInTheDocument();
    expect(screen.getByText('Matrículas')).toBeInTheDocument();
  });

  it('deve aplicar a classe active ao link correto', () => {
    usePathnameSpy.mockReturnValue('/students');

    render(<Navbar />);

    const studentsLink = screen.getByText('Alunos');
    const homeLink = screen.getByText('Início');

    expect(studentsLink).toHaveClass(expect.stringContaining('active'));
    expect(homeLink).not.toHaveClass(expect.stringContaining('active'));
  });
});
