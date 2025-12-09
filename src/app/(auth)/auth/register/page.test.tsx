// src/app/(auth)/auth/register/page.test.tsx
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import RegisterPage from './page';

const pushMock = jest.fn();
const createUserWithEmailAndPasswordMock = jest.fn();
const signInWithPopupMock = jest.fn();
const updateProfileMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: (...args: any[]) =>
    createUserWithEmailAndPasswordMock(...args),
  signInWithPopup: (...args: any[]) => signInWithPopupMock(...args),
  updateProfile: (...args: any[]) => updateProfileMock(...args),
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

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    createUserWithEmailAndPasswordMock.mockResolvedValue({
      user: { uid: '123' },
    });
    signInWithPopupMock.mockResolvedValue({ user: { uid: '456' } });
    updateProfileMock.mockResolvedValue(undefined);
  });

  it('renderiza campos principais e botão de criação', () => {
    render(<RegisterPage />);

    expect(
      screen.getByRole('heading', { name: /Criar conta administrativa/i }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/Nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail institucional/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Criar conta/i }),
    ).toBeInTheDocument();
  });

  it('exibe erro ao tentar enviar com campos vazios', async () => {
    render(<RegisterPage />);

    fireEvent.click(screen.getByRole('button', { name: /Criar conta/i }));

    expect(
      await screen.findByText(/Preencha nome, e-mail e senha para continuar/i),
    ).toBeInTheDocument();

    expect(createUserWithEmailAndPasswordMock).not.toHaveBeenCalled();
  });

  it('cria usuário com e-mail/senha e redireciona', async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/Nome completo/i), {
      target: { value: 'Coordenador Pedagógico' },
    });

    fireEvent.change(screen.getByLabelText(/E-mail institucional/i), {
      target: { value: 'coord@escola.com' },
    });

    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Criar conta/i }));

    await waitFor(() => {
      expect(createUserWithEmailAndPasswordMock).toHaveBeenCalledWith(
        expect.any(Object),
        'coord@escola.com',
        '123456',
      );
      expect(updateProfileMock).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith('/');
    });
  });

  it('tenta cadastro com Google ao clicar no botão correspondente', async () => {
    render(<RegisterPage />);

    fireEvent.click(screen.getByText(/Google/i));

    await waitFor(() => {
      expect(signInWithPopupMock).toHaveBeenCalled();
    });
  });

  it('tenta cadastro com Facebook ao clicar no botão correspondente', async () => {
    render(<RegisterPage />);

    fireEvent.click(screen.getByText(/Facebook/i));

    await waitFor(() => {
      expect(signInWithPopupMock).toHaveBeenCalled();
    });
  });

  it('navega de volta para login quando solicitado', () => {
    render(<RegisterPage />);

    fireEvent.click(
      screen.getByRole('button', { name: /Voltar para login/i }),
    );

    expect(pushMock).toHaveBeenCalledWith('/auth/login');
  });
});
