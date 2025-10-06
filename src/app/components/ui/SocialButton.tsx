// app/components/ui/SocialButton.tsx
'use client';

import { IconType } from 'react-icons';
import styles from './SocialButton.module.css';

interface Props {
  icon: IconType;
  color: string;           // cor de fundo do botão
  onClick?: () => void;
  ariaLabel: string;       // acessibilidade
}

export default function SocialButton({ icon: Icon, color, onClick, ariaLabel }: Props) {
  return (
    <button
      type="button"
      className={styles.socialBtn}
      style={{ backgroundColor: color }}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <Icon className={styles.icon} />
    </button>
  );
}
