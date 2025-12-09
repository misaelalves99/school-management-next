// src/core/contexts/AuthProvider.tsx
'use client';

import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from 'react';
import type { User } from 'firebase/auth';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from 'firebase/auth';
import {
  getFirebaseAuth,
  getGoogleProvider,
  getFacebookProvider,
} from '@/core/firebase/client';

type AuthUser = User | null;

interface AuthContextValue {
  user: AuthUser;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Observa o estado de autenticação
  useEffect(() => {
    let isMounted = true;

    try {
      const auth = getFirebaseAuth();

      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (!isMounted) return;
        setUser(currentUser);
        setLoading(false);
      });

      return () => {
        isMounted = false;
        unsubscribe();
      };
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  const handleError = (err: unknown) => {
    console.error(err);
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('Ocorreu um erro inesperado ao autenticar.');
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const auth = getFirebaseAuth();
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = getFirebaseAuth();
      const provider = getGoogleProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithFacebook = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = getFirebaseAuth();
      const provider = getFacebookProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = getFirebaseAuth();
      await signOut(auth);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  const value: AuthContextValue = {
    user,
    loading,
    error,
    login,
    register,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
