// app/ProtectedApp.tsx
'use client';

import { useAuth } from './hooks/useAuth';
import { usePathname, redirect } from 'next/navigation';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

export default function ProtectedApp({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  const publicRoutes = ['/auth/login', '/auth/register'];

  if (!user && !publicRoutes.includes(pathname)) {
    redirect('/auth/login');
  }

  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <>
      {!isPublicRoute && <Navbar />}
      <main>{children}</main>
      {!isPublicRoute && <Footer />}
    </>
  );
}
