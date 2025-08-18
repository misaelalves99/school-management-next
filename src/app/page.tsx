// app/page.tsx

import Link from 'next/link';
import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bem-vindo ao Sistema de Gestão Escolar</h1>
      <p className={styles.lead}>
        Gerencie facilmente alunos, professores, disciplinas, matrículas,
        presenças e notas em um único lugar.
      </p>

      <ul className={styles.features}>
        <li className={styles['feature-card']}>
          <Link href="/students">Gerenciar Alunos</Link>
        </li>
        <li className={styles['feature-card']}>
          <Link href="/teachers">Gerenciar Professores</Link>
        </li>
        <li className={styles['feature-card']}>
          <Link href="/subjects">Gerenciar Disciplinas</Link>
        </li>
        <li className={styles['feature-card']}>
          <Link href="/classrooms">Gerenciar Salas</Link>
        </li>
        <li className={styles['feature-card']}>
          <Link href="/enrollments">Gerenciar Matrículas</Link>
        </li>
      </ul>
    </div>
  );
}
