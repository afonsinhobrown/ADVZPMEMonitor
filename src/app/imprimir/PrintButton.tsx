'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{ marginTop: '1rem', padding: '0.5rem 1rem', border: '1px solid #333', borderRadius: 4, background: '#fff', cursor: 'pointer' }}
    >
      Imprimir / Guardar PDF
    </button>
  );
}
