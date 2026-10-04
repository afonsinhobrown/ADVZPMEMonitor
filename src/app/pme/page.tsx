import React from 'react';

export default function PMEDashboard() {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      
      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ 
          background: 'linear-gradient(145deg, #ffffff, #f8fafc)', 
          padding: '2rem', 
          borderRadius: '16px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', background: 'rgba(34, 160, 57, 0.05)', borderRadius: '50%' }}></div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Projecto Financiado</p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', lineHeight: 1.2 }}>Sistema de Irrigação Tete</h2>
          <span style={{ background: '#dcfce7', color: '#166534', padding: '0.4rem 0.8rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>Em Execução</span>
        </div>

        <div style={{ 
          background: 'linear-gradient(145deg, #ffffff, #f8fafc)', 
          padding: '2rem', 
          borderRadius: '16px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Orçamento Aprovado</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>5,000,000 <span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>MZN</span></h2>
          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: '35%', height: '100%', background: '#3b82f6', borderRadius: '10px' }}></div>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 500 }}>35% dos fundos utilizados (1,750,000 MZN)</p>
        </div>

        <div style={{ 
          background: 'linear-gradient(145deg, #ffffff, #f8fafc)', 
          padding: '2rem', 
          borderRadius: '16px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Prazo de Execução</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>18 <span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>Meses</span></h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Término previsto: <strong style={{ color: '#0f172a' }}>Julho de 2027</strong></p>
        </div>
      </div>

      {/* Report Form Section */}
      <div style={{ 
        background: '#ffffff', 
        borderRadius: '20px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.06)', 
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <div style={{ background: '#f8fafc', padding: '2rem 3rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Submeter Relatório de Execução</h3>
          <p style={{ color: '#64748b', margin: '0.5rem 0 0 0', fontWeight: 500 }}>Preencha exaustivamente os dados relativos ao trimestre atual. O fornecimento de evidências é obrigatório.</p>
        </div>
        
        <form style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Período do Relatório</label>
              <select style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none', background: '#f8fafc', fontSize: '1rem', color: '#0f172a', fontWeight: 500, transition: 'all 0.2s' }}>
                <option>Q1 2026 (Jan - Mar)</option>
                <option>Q2 2026 (Abr - Jun)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Actividade Principal Realizada</label>
              <input type="text" placeholder="Ex: Preparação do Terreno..." style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none', fontSize: '1rem', color: '#0f172a', fontWeight: 500, transition: 'all 0.2s' }} />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Descrição Detalhada do Progresso Físico</label>
            <textarea rows={5} placeholder="Descreva pormenorizadamente o que foi executado, os marcos atingidos e as metodologias aplicadas..." style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none', fontSize: '1rem', color: '#0f172a', fontWeight: 500, resize: 'vertical' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Fundos Utilizados (MZN)</label>
              <input type="number" placeholder="0.00" style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none', fontSize: '1rem', color: '#0f172a', fontWeight: 500 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Desvios ou Desafios Encontrados?</label>
              <input type="text" placeholder="Atrasos, problemas climáticos, rupturas de stock..." style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none', fontSize: '1rem', color: '#0f172a', fontWeight: 500 }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Impacto Social e Ambiental (Salvaguardas)</label>
            <textarea rows={3} placeholder="Detalhe medidas tomadas para mitigar impactos ambientais, contratação de mão-de-obra local, etc." style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none', fontSize: '1rem', color: '#0f172a', fontWeight: 500, resize: 'vertical' }} />
          </div>

          <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '2px dashed #cbd5e1', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📁</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>Anexar Evidências Físicas e Financeiras</h4>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 1.5rem 0' }}>Arraste os ficheiros para aqui ou clique para selecionar (JPG, PNG, PDF)</p>
            <input type="file" multiple style={{ display: 'none' }} id="file-upload" />
            <label htmlFor="file-upload" style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600, color: '#334155', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
              Selecionar Ficheiros
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" style={{ padding: '1rem 2rem', borderRadius: '10px', border: '2px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Guardar Rascunho</button>
            <button type="button" style={{ padding: '1rem 2.5rem', borderRadius: '10px', border: 'none', background: '#22a039', color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(34, 160, 57, 0.2)' }}>
              Submeter Relatório Oficial
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input:focus, select:focus, textarea:focus {
          border-color: #22a039 !important;
          box-shadow: 0 0 0 4px rgba(34, 160, 57, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
