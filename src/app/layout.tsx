// app/layout.tsx

'use client';

import { ReactNode } from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import './globals.css';

// Providers
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
        <TeachersProvider>
          <StudentsProvider>
            <ClassRoomsProvider>
              <SubjectsProvider>
                <EnrollmentsProvider>
                  <Navbar />
                  <main>{children}</main>
                  <Footer />
                </EnrollmentsProvider>
              </SubjectsProvider>
            </ClassRoomsProvider>
          </StudentsProvider>
        </TeachersProvider>
      </body>
    </html>
  );
}
