'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/pme', label: 'Painel' },
  { href: '/pme/relatorios', label: 'Relatórios' },
  { href: '/pme/relatorios/novo', label: 'Submeter Relatório' },
];

export default function PmeNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/pme') return pathname === '/pme';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
        position: 'sticky',
        top: '73px',
        zIndex: 90,
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 3rem',
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
        }}
      >
        {LINKS.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '1rem 1.1rem',
                fontWeight: 600,
                fontSize: '0.92rem',
                color: active ? '#166534' : '#64748b',
                borderBottom: `3px solid ${active ? '#22a039' : 'transparent'}`,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}