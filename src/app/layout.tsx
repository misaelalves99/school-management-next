// app/layout.tsx
'use client';

import { ReactNode } from 'react';
import './globals.css';

// Providers
import { AuthProvider } from './contexts/AuthProvider';
import ProtectedApp from './ProtectedApp';
import { TeachersProvider } from './contexts/TeachersProvider';
import { StudentsProvider } from './contexts/StudentsProvider';
import { ClassRoomsProvider } from './contexts/ClassRoomsProvider';
import { EnrollmentsProvider } from './contexts/EnrollmentsProvider';
import { SubjectsProvider } from './contexts/SubjectsProvider';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <ProtectedApp>
            <TeachersProvider>
              <StudentsProvider>
                <ClassRoomsProvider>
                  <SubjectsProvider>
                    <EnrollmentsProvider>
                      {children}
                    </EnrollmentsProvider>
                  </SubjectsProvider>
                </ClassRoomsProvider>
              </StudentsProvider>
            </TeachersProvider>
          </ProtectedApp>
        </AuthProvider>
      </body>
    </html>
  );
}
