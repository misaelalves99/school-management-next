// src/app/components/layout/DashboardShell.tsx
import type { ReactNode } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardShellProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * Wrapper padrão para todas as páginas internas do painel.
 * - Título + descrição
 * - Breadcrumb opcional
 * - Área para botões de ação
 * - Conteúdo em grid vertical
 */
export default function DashboardShell({
  title,
  subtitle,
  breadcrumbs,
  actions,
  children,
}: DashboardShellProps) {
  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1 text-xs text-slate-400"
            >
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.label} className="flex items-center gap-1">
                  {index > 0 && <span className="text-slate-600">/</span>}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="hover:text-sky-400 transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-slate-300">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          <div>
            <h1 className="h1-gradient">{title}</h1>
            {subtitle && <p className="muted mt-1">{subtitle}</p>}
          </div>
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        )}
      </header>

      {/* Conteúdo da página (cards, tabelas, etc.) */}
      <section className="grid gap-6">{children}</section>
    </div>
  );
}
