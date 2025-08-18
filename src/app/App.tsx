// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useCallback } from 'react';

import Navbar from './components/Navbar/Navbar';

import HomePage from './pages/Home/HomePage';

import StudentsPage from './pages/Students/index';
import StudentCreatePage from './pages/Students/Create/CreatePage';
import StudentEditPage from './pages/Students/Edit/EditPage';
import StudentDetailsPage from './pages/Students/Details/DetailsPage';
import StudentDeletePage from './pages/Students/Delete/DeletePage';

import TeachersPage from './pages/Teachers/index';
import TeacherDetailsPage from './pages/Teachers/Details/DetailsPage';
import TeacherCreatePage from './pages/Teachers/Create/CreatePage';
import TeacherEditPage from './pages/Teachers/Edit/EditPage';
import TeacherDeletePage from './pages/Teachers/Delete/DeletePage';

import SubjectsPage from './pages/Subjects/index';
import SubjectDetailsPage from './pages/Subjects/Details/DetailsPage';
import SubjectEditPage from './pages/Subjects/Edit/EditPage';
import SubjectDeletePage from './pages/Subjects/Delete/DeletePage';

import ClassroomsPage from './pages/ClassRooms/index';
import ClassroomCreatePage from './pages/ClassRooms/Create/CreatePage';

import {
  ClassRoomDeletePageWrapper,
  ClassRoomDetailsPageWrapper,
  ClassRoomEditPageWrapper,
} from './pages/ClassRooms/wrappers';

import EnrollmentIndexPage from './pages/Enrollments/Index'; // Corrected Import
import CreateEnrollment from './pages/Enrollments/Create/CreatePage'; // Corrected Import
import { EnrollmentForm } from './pages/Enrollments/Create/CreatePage'; // Import the type
import { Enrollment } from './mocks/enrollments'; // Import the Enrollment type

import {
  EnrollmentDetailsWrapper,
  EnrollmentEditWrapper,
  EnrollmentDeleteWrapper,
} from './pages/Enrollments/wrappers';

// Import mock data
import { mockStudents } from './mocks/students';
import mockClassRooms from './mocks/classRooms';
import mockEnrollments from './mocks/enrollments';

export default function App() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);

  const handleCreate = useCallback((newEnrollment: EnrollmentForm) => {
    // Check if studentId and classRoomId are numbers
    if (typeof newEnrollment.studentId !== 'number' || typeof newEnrollment.classRoomId !== 'number') {
      return Promise.reject(new Error('Student ID and Classroom ID must be numbers.'));
    }

    const enrollmentToAdd: Enrollment = {
      id: enrollments.length + 1, // Simple ID generation
      studentId: newEnrollment.studentId,
      classRoomId: newEnrollment.classRoomId,
      status: 'Ativo', // Default status for new enrollments
      enrollmentDate: newEnrollment.enrollmentDate, // Use the date from the form
    };
    setEnrollments((prev) => [...prev, enrollmentToAdd]);
    return Promise.resolve();
  }, [enrollments]);

  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Alunos */}
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/students/create" element={<StudentCreatePage />} />
          <Route path="/students/details/:id" element={<StudentDetailsPage />} />
          <Route path="/students/edit/:id" element={<StudentEditPage />} />
          <Route path="/students/delete/:id" element={<StudentDeletePage />} />

          {/* Professores */}
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/teachers/create" element={<TeacherCreatePage />} />
          <Route path="/teachers/details/:id" element={<TeacherDetailsPage />} />
          <Route path="/teachers/edit/:id" element={<TeacherEditPage />} />
          <Route path="/teachers/delete/:id" element={<TeacherDeletePage />} />

          {/* Disciplinas */}
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/details/:id" element={<SubjectDetailsPage />} />
          <Route path="/subjects/edit/:id" element={<SubjectEditPage />} />
          <Route path="/subjects/delete/:id" element={<SubjectDeletePage />} />

          {/* Salas */}
          <Route path="/classrooms" element={<ClassroomsPage />} />
          <Route path="/classrooms/create" element={<ClassroomCreatePage />} />
          <Route path="/classrooms/details/:id" element={<ClassRoomDetailsPageWrapper />} />
          <Route path="/classrooms/edit/:id" element={<ClassRoomEditPageWrapper />} />
          <Route path="/classrooms/delete/:id" element={<ClassRoomDeletePageWrapper />} />

          {/* Matrículas */}
          <Route path="/enrollments" element={<EnrollmentIndexPage />} />
          <Route 
            path="/enrollments/create" 
            element={
              <CreateEnrollment 
                students={mockStudents} 
                classRooms={mockClassRooms} 
                onCreate={handleCreate} 
              />
            } 
          />
          <Route path="/enrollments/details/:id" element={<EnrollmentDetailsWrapper />} />
          <Route path="/enrollments/edit/:id" element={<EnrollmentEditWrapper />} />
          <Route path="/enrollments/delete/:id" element={<EnrollmentDeleteWrapper />} />

          {/* Redirecionamento para / caso rota não encontrada */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
