// src/app/components/ui/DataTable.tsx

'use client';

import type { ReactNode } from 'react';
import styles from './DataTable.module.css';

export type DataTableAlign = 'left' | 'center' | 'right';

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  /** Largura fixa opcional (ex.: "200px" ou "20%") */
  width?: string;
  /** Largura mínima opcional (ex.: "160px") */
  minWidth?: string;
  align?: DataTableAlign;
  /** Renderização customizada da célula; se não for passada, usa row[key] */
  render?: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T, index: number) => string | number;
  emptyMessage?: string;
  dense?: boolean;
}

export default function DataTable<T>({
  columns,
  data,
  getRowKey,
  emptyMessage = 'Nenhum registro encontrado.',
  dense = false,
}: DataTableProps<T>): JSX.Element {
  const tableClassName = [
    styles.table,
    dense ? styles.tableDense : '',
  ]
    .filter(Boolean)
    .join(' ');

  const getAlignClass = (align?: DataTableAlign): string => {
    if (align === 'right') return styles.alignRight;
    if (align === 'center') return styles.alignCenter;
    return styles.alignLeft;
  };

  return (
    <div className={styles.wrapper}>
      <table className={tableClassName}>
        <thead>
          <tr>
            {columns.map((col) => {
              const columnKey = String(col.key);

              return (
                <th
                  key={columnKey}
                  className={getAlignClass(col.align)}
                  style={{
                    width: col.width,
                    minWidth: col.minWidth,
                  }}
                >
                  {col.header}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className={styles.emptyCell}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={getRowKey(row, rowIndex)}>
                {columns.map((col) => {
                  const cellKey = `${String(col.key)}-${rowIndex}`;

                  return (
                    <td
                      key={cellKey}
                      className={getAlignClass(col.align)}
                    >
                      {col.render
                        ? col.render(row)
                        : String(
                            (row as any)[
                              col.key as keyof typeof row
                            ] ?? '',
                          )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
