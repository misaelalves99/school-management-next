// src/core/utils/formatDate.ts
/**
 * Formata uma data (string, Date ou undefined) no padrão brasileiro dd/MM/yyyy.
 * Retorna '–' se a data não for válida.
 */
export function formatDate(value?: string | Date | null): string {
  if (!value) return '–';

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '–';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
