// src/app/components/ui/Badge.tsx

import type { ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeVariant =
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'soft';

export type BadgeSize = 'sm' | 'md';

export type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
};

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
}: BadgeProps): JSX.Element {
  const sizeClass =
    size === 'sm' ? styles.size_sm : styles.size_md;

  const variantClass =
    variant === 'success'
      ? styles.variant_success
      : variant === 'warning'
      ? styles.variant_warning
      : variant === 'danger'
      ? styles.variant_danger
      : variant === 'info'
      ? styles.variant_info
      : styles.variant_neutral; // 'neutral' e 'soft' caem aqui por padrão

  return (
    <span className={`${styles.badge} ${sizeClass} ${variantClass}`}>
      {children}
    </span>
  );
}
