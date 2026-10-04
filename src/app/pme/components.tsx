import React from 'react';
import type { ReportStatus } from '@prisma/client';
import { REPORT_STATUS, formatMZN, percentage } from '@/lib/format';

export function StatusBadge({ status }: { status: ReportStatus }) {
  const meta = REPORT_STATUS[status];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.3rem 0.8rem',
        borderRadius: '999px',
        background: meta.bg,
        color: meta.fg,
        fontSize: '0.72rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
        whiteSpace: 'nowrap',
      }}
    >
      {meta.label}
    </span>
  );
}

export function ProjectStatusBadge({ status }: { status: string }) {
  const meta: Record<string, { label: string; bg: string; fg: string }> = {
    EM_CURSO: { label: 'Em Execução', bg: '#dcfce7', fg: '#166534' },
    ATRASADO: { label: 'Atrasado', bg: '#fee2e2', fg: '#b91c1c' },
    CONCLUIDO: { label: 'Concluído', bg: '#e0e7ff', fg: '#3730a3' },
  };
  const chosen = meta[status] ?? { label: status, bg: '#f1f5f9', fg: '#475569' };

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.3rem 0.8rem',
        borderRadius: '999px',
        background: chosen.bg,
        color: chosen.fg,
        fontSize: '0.72rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
      }}
    >
      {chosen.label}
    </span>
  );
}

export function ProgressBar({
  value,
  total,
  color = '#22a039',
  height = 8,
}: {
  value: number;
  total: number;
  color?: string;
  height?: number;
}) {
  const pct = percentage(value, total);

  return (
    <div
      style={{
        width: '100%',
        height,
        background: '#e2e8f0',
        borderRadius: 999,
        overflow: 'hidden',
      }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: color,
          borderRadius: 999,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  padded = true,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  padded?: boolean;
}) {
  return (
    <section
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 30px rgba(15,23,42,0.04)',
        overflow: 'hidden',
        marginBottom: '2rem',
      }}
    >
      {(title || action) && (
        <header
          style={{
            background: '#f8fafc',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            {title && (
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                {title}
              </h2>
            )}
            {description && (
              <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.88rem' }}>
                {description}
              </p>
            )}
          </div>
          {action}
        </header>
      )}
      <div style={padded ? { padding: '1.75rem' } : undefined}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  unit,
  hint,
  accent = '#0f172a',
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: React.ReactNode;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 30px rgba(15,23,42,0.04)',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-18px',
          right: '-18px',
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: `${accent}0f`,
        }}
      />
      <p
        style={{
          margin: 0,
          color: '#64748b',
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
        }}
      >
        {label}
      </p>
      <p style={{ margin: '0.6rem 0 0 0', fontSize: '1.6rem', fontWeight: 800, color: accent }}>
        {value}
        {unit && (
          <span style={{ fontSize: '0.95rem', color: '#94a3b8', marginLeft: '0.35rem' }}>{unit}</span>
        )}
      </p>
      {hint && (
        <div style={{ marginTop: '0.75rem', color: '#64748b', fontSize: '0.82rem' }}>{hint}</div>
      )}
    </div>
  );
}

export function Notice({
  tone,
  title,
  children,
}: {
  tone: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  children?: React.ReactNode;
}) {
  const tones = {
    success: { bg: '#f0fdf4', border: '#bbf7d0', fg: '#15803d' },
    warning: { bg: '#fffbeb', border: '#fde68a', fg: '#b45309' },
    danger: { bg: '#fef2f2', border: '#fecaca', fg: '#b91c1c' },
    info: { bg: '#eff6ff', border: '#bfdbfe', fg: '#1d4ed8' },
  } as const;
  const chosen = tones[tone];

  return (
    <div
      role="status"
      style={{
        background: chosen.bg,
        border: `1px solid ${chosen.border}`,
        color: chosen.fg,
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
      }}
    >
      <strong style={{ display: 'block', fontSize: '0.95rem' }}>{title}</strong>
      {children && <div style={{ marginTop: '0.35rem', fontSize: '0.88rem' }}>{children}</div>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📄</div>
      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{title}</h3>
      <p
        style={{
          margin: '0.5rem auto 1.5rem auto',
          maxWidth: '460px',
          color: '#64748b',
          fontSize: '0.92rem',
        }}
      >
        {description}
      </p>
      {action}
    </div>
  );
}

export function DataTable({
  head,
  children,
}: {
  head: string[];
  children: React.ReactNode;
}) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
        <thead>
          <tr>
            {head.map((column) => (
              <th
                key={column}
                style={{
                  textAlign: 'left',
                  color: '#64748b',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  padding: '0 1rem 0.75rem 0',
                  borderBottom: '1px solid #e2e8f0',
                  whiteSpace: 'nowrap',
                }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Money({ value }: { value: number | null | undefined }) {
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatMZN(value ?? 0)}</span>;
}