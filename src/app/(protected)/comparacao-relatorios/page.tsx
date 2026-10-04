import React from 'react';

export default function ComparacaoRelatoriosAdmin() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2 className="text-xl font-bold mb-2">Avaliação e Comparação de Relatórios (Admin)</h2>
      <p className="text-secondary mb-6">Compare o relatório submetido pela PME com o relatório de avaliação preenchido pelo Técnico da Agência.</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <select className="form-input" style={{ width: '300px' }}>
          <option>Seleccione o Projecto...</option>
          <option>Sistema de Irrigação Tete (Agro Lda)</option>
        </select>
        <select className="form-input" style={{ width: '200px' }}>
          <option>Q1 2026</option>
        </select>
        <button className="btn btn-primary">Carregar Relatórios</button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        
        {/* Coluna 1: Relatório da PME */}
        <div className="card" style={{ borderTop: '4px solid #22a039', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className="text-lg font-bold">Relatório da PME (Agro Lda)</h3>
            <span className="badge badge-success">Submetido a 10 Mar</span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 className="text-sm text-secondary font-semibold">Progresso Físico Declarado</h4>
            <p className="mt-1">Foram limpos 5 hectares de terreno e instalados 200 metros de tubagem principal. Os testes de pressão foram bem sucedidos.</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 className="text-sm text-secondary font-semibold">Fundos Utilizados</h4>
            <p className="mt-1 text-lg font-bold">150,000 MZN</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 className="text-sm text-secondary font-semibold">Desafios/Desvios</h4>
            <p className="mt-1">Atraso na entrega das válvulas secundárias pelo fornecedor (2 dias).</p>
          </div>

          <div>
            <h4 className="text-sm text-secondary font-semibold mb-2">Anexos/Evidências</h4>
            <div className="flex gap-2">
              <span style={{ padding: '0.5rem', background: '#f4f7f6', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid var(--border)' }}>📸 foto_tubagem.jpg</span>
              <span style={{ padding: '0.5rem', background: '#f4f7f6', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid var(--border)' }}>📄 fatura_material.pdf</span>
            </div>
          </div>
        </div>

        {/* Coluna 2: Relatório do Técnico */}
        <div className="card" style={{ borderTop: '4px solid #0076d6', padding: '1.5rem', background: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className="text-lg font-bold" style={{ color: '#0076d6' }}>Relatório do Técnico (Agência)</h3>
            <span className="badge badge-success">Avaliado a 15 Mar</span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 className="text-sm text-secondary font-semibold">Avaliação do Progresso</h4>
            <p className="mt-1">Visita de campo confirmou a instalação da tubagem. O trabalho está com boa qualidade e dentro do cronograma.</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 className="text-sm text-secondary font-semibold">Validação Financeira</h4>
            <p className="mt-1 text-lg font-bold" style={{ color: '#22a039' }}>150,000 MZN (Validado ✅)</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 className="text-sm text-secondary font-semibold">Observações / Desvios</h4>
            <p className="mt-1">O atraso reportado pela PME foi mitigado. Nenhuma preocupação adicional de salvaguardas.</p>
          </div>

          <div>
            <h4 className="text-sm text-secondary font-semibold mb-2">Conclusão do Técnico</h4>
            <span className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>Relatório Consistente / Aprovado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
