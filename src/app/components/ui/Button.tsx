// src/app/components/ui/Button.tsx

'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'outline'
  | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Nome oficial */
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** Alias usado nas páginas (retrocompatível) */
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  iconLeft,
  iconRight,
  isLoading = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps): JSX.Element {
  const classes = [
    styles.button,
    styles[`variant_${variant}`],
    styles[`size_${size}`],
    fullWidth ? styles.fullWidth : '',
    isLoading ? styles.loading : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const isDisabled = disabled || isLoading;

  // Prioriza leftIcon/rightIcon, mas aceita iconLeft/iconRight
  const finalLeftIcon = leftIcon ?? iconLeft;
  const finalRightIcon = rightIcon ?? iconRight;

  return (
    <button
      className={classes}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading && (
        <span className={styles.spinner} aria-hidden="true" />
      )}

      {finalLeftIcon && !isLoading && (
        <span className={styles.iconLeft}>{finalLeftIcon}</span>
      )}

      <span className={styles.label}>{children}</span>

      {finalRightIcon && (
        <span className={styles.iconRight}>{finalRightIcon}</span>
      )}
    </button>
  );
}
