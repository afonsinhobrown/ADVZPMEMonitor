import React from 'react';

export default function PMEPortalView() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header específico para a PME, sem a sidebar da agência */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid var(--border)', paddingBottom: '1rem' }}>
        <div>
          <h2 className="text-2xl font-bold">Portal da PME</h2>
          <p className="text-secondary">Bem-vindo(a), Agro Lda</p>
        </div>
        <span className="badge badge-success" style={{ fontSize: '1rem' }}>Projecto: Sistema de Irrigação Benguela</span>
      </div>
      
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 className="text-lg font-semibold mb-4">Resumo do Projecto Financiado</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-secondary">Data de Início</p>
            <p className="font-semibold">01 Jan 2026</p>
          </div>
          <div>
            <p className="text-sm text-secondary">Orçamento Aprovado</p>
            <p className="font-semibold">5,000,000 MZN</p>
          </div>
          <div>
            <p className="text-sm text-secondary">Estado Atual</p>
            <p className="font-semibold text-warning">Em Execução</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <h3 className="text-xl font-semibold mb-6">Submeter Relatório de Execução (Exaustivo)</h3>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Período do Relatório</label>
              <select className="form-input" style={{ width: '100%' }}>
                <option>Q1 2026 (Jan - Mar)</option>
                <option>Q2 2026 (Abr - Jun)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Actividade Realizada</label>
              <input type="text" className="form-input" style={{ width: '100%' }} placeholder="Ex: Preparação do Terreno..." />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Descrição Detalhada do Progresso Físico</label>
            <textarea className="form-input" rows={4} style={{ width: '100%' }} placeholder="Descreva pormenorizadamente o que foi executado..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Fundos Utilizados neste período (MZN)</label>
              <input type="number" className="form-input" style={{ width: '100%' }} placeholder="Ex: 150000" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Desvios ou Desafios Encontrados?</label>
              <input type="text" className="form-input" style={{ width: '100%' }} placeholder="Atrasos, problemas climáticos, etc." />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Impacto Social e Ambiental (Salvaguardas)</label>
            <textarea className="form-input" rows={3} style={{ width: '100%' }} placeholder="Detalhe medidas tomadas para mitigar impactos..." />
          </div>

          <div style={{ background: '#f4f7f6', padding: '1.5rem', borderRadius: '8px', border: '1px dashed var(--border)' }}>
            <label className="text-sm font-semibold mb-1" style={{ display: 'block' }}>Anexar Evidências (Imagens, Recibos, Comprovativos)</label>
            <input type="file" multiple className="form-input" style={{ width: '100%', background: 'white' }} />
            <p className="text-xs text-secondary mt-2">Deve incluir fotos do local e digitalização das faturas.</p>
          </div>

          <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Gravar e Enviar Relatório
          </button>
        </form>
      </div>
    </div>
  );
}
