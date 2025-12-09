'use client';

import type { ReactNode, ElementType } from 'react';
import styles from './Card.module.css';

type CardVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

export interface CardProps {
  /** Título do card (opcional para casos de "container" como form, aside etc.) */
  title?: string;
  /** Valor principal (usado nos cards de métrica do dashboard) */
  value?: string | number;
  /** Texto auxiliar / legenda abaixo do título */
  helperText?: string;
  /** Ícone alinhado à direita do header */
  icon?: ReactNode;
  /** Variação de cor do card */
  variant?: CardVariant;
  /** Alinhamento do conteúdo principal */
  align?: 'left' | 'center';
  /** Clique no card inteiro (vira um botão estilizado) */
  onClick?: () => void;
  /** Conteúdo extra (formulários, listas, textos, etc.) */
  children?: ReactNode;
  /** Classe extra para customizações locais (ex.: formCard, hintCard...) */
  className?: string;
}

export default function Card({
  title,
  value,
  helperText,
  icon,
  variant = 'neutral',
  align = 'left',
  onClick,
  children,
  className,
}: CardProps): JSX.Element {
  const Wrapper: ElementType = onClick ? 'button' : 'div';

  const rootClassName = [
    styles.card,
    styles[`card_${variant}`] ?? '',
    align === 'center' ? styles.alignCenter : '',
    onClick ? styles.clickable : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const hasHeaderContent = Boolean(title || helperText || icon);

  return (
    <Wrapper
      className={rootClassName}
      // `type` só é relevante quando é button, mas não quebra quando Wrapper = 'div'
      {...(onClick ? { type: 'button', onClick } : {})}
    >
      {hasHeaderContent && (
        <div className={styles.header}>
          <div className={styles.headerMain}>
            {title && <span className={styles.title}>{title}</span>}
            {helperText && <span className={styles.helper}>{helperText}</span>}
          </div>
          {icon && <div className={styles.iconWrapper}>{icon}</div>}
        </div>
      )}

      {value !== undefined && (
        <div className={styles.valueWrapper}>
          <span className={styles.value}>{value}</span>
        </div>
      )}

      {children && <div className={styles.body}>{children}</div>}
    </Wrapper>
  );
}
