// src/app/(auth)/auth/login/page.test.tsx
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import LoginPage from './page';

const pushMock = jest.fn();
const signInWithEmailAndPasswordMock = jest.fn();
const signInWithPopupMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: (...args: any[]) =>
    signInWithEmailAndPasswordMock(...args),
  signInWithPopup: (...args: any[]) => signInWithPopupMock(...args),
}));

jest.mock('@/core/firebase/client', () => ({
  auth: {},
  googleProvider: {},
  facebookProvider: {},
}));

jest.mock('@/app/components/ui/Card', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <section data-testid="card" {...props}>
      {children}
    </section>
  ),
}));

jest.mock('@/app/components/ui/Button', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    signInWithEmailAndPasswordMock.mockResolvedValue({ user: {} });
    signInWithPopupMock.mockResolvedValue({ user: {} });
  });

  it('renderiza título, campos de e-mail e senha e botão de envio', () => {
    render(<LoginPage />);

    expect(
      screen.getByRole('heading', { name: /Entrar no painel escolar/i }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/E-mail institucional/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Entrar/i }),
    ).toBeInTheDocument();
  });

  it('exibe erro quando e-mail ou senha não são preenchidos', async () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    expect(
      await screen.findByText(/Informe e-mail e senha para continuar/i),
    ).toBeInTheDocument();
    expect(signInWithEmailAndPasswordMock).not.toHaveBeenCalled();
  });

  it('chama signInWithEmailAndPassword e redireciona no login bem-sucedido', async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/E-mail institucional/i), {
      target: { value: 'admin@escola.com' },
    });

    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
      expect(signInWithEmailAndPasswordMock).toHaveBeenCalledWith(
        expect.any(Object),
        'admin@escola.com',
        '123456',
      );
      expect(pushMock).toHaveBeenCalledWith('/');
    });
  });

  it('tenta login com Google ao clicar no botão correspondente', async () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByText(/Google/i));

    await waitFor(() => {
      expect(signInWithPopupMock).toHaveBeenCalled();
    });
  });

  it('tenta login com Facebook ao clicar no botão correspondente', async () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByText(/Facebook/i));

    await waitFor(() => {
      expect(signInWithPopupMock).toHaveBeenCalled();
    });
  });

  it('navega para tela de registro ao clicar em "Criar conta administrativa"', () => {
    render(<LoginPage />);

    fireEvent.click(
      screen.getByRole('button', { name: /Criar conta administrativa/i }),
    );

    expect(pushMock).toHaveBeenCalledWith('/auth/register');
  });
});
