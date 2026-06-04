import { useState } from 'react';
import { AppState } from '../types';
import { formatEUR } from '../utils/finance';

interface Props {
  state: AppState;
  goTo: (step: AppState['step']) => void;
}

export default function Results({ state, goTo }: Props) {
  const [showTx, setShowTx] = useState(false);
  const { statement, taxEstimate, smoothing, onboarding } = state;
  if (!statement || !taxEstimate || !smoothing) return null;

  const name = onboarding?.fullname?.split(' ')[0] ?? 'Autónomo';
  const riskColor = { bajo: { bg: 'var(--green-light)', text: 'var(--green)', label: 'Riesgo bajo' }, medio: { bg: '#fff3cd', text: '#856404', label: 'Riesgo medio' }, alto: { bg: 'var(--red-light)', text: 'var(--red)', label: 'Riesgo alto' } }[smoothing.riskLevel];
  const visibleTx = statement.transactions.slice(0, 5);
  const lockedTx = statement.transactions.slice(5);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid var(--border)' }}>
        <span className="serif" style={{ fontSize: 20, color: 'var(--ink)' }}>fintonomy</span>
        <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 99, background: 'var(--cream)', color: 'var(--muted)', border: '1px solid var(--border)' }}>{statement.bankDetected} · {statement.periodStart} → {statement.periodEnd}</span>
      </header>

      <main style={{ padding: '40px 48px', maxWidth: 640, margin: '0 auto' }}>
        <div className="fade-up" style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>Tu análisis fiscal, {name}</p>
          <h1 className="serif" style={{ fontSize: 44, color: 'var(--ink)', lineHeight: 1.1 }}>Aquí están tus números reales.</h1>
        </div>

        {/* Hero card */}
        <div className="fade-up-1" style={{ background: 'var(--ink)', borderRadius: 20, padding: '28px', marginBottom: 12, color: 'var(--paper)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>Puedes pagarte este mes</p>
              <p className="serif" style={{ fontSize: 56, lineHeight: 1 }}>{formatEUR(smoothing.safeMonthlySalary)}</p>
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, padding: '4px 12px', borderRadius: 99, background: riskColor.bg, color: riskColor.text }}>{riskColor.label}</span>
          </div>
          <p style={{ fontSize: 11, opacity: 0.4 }}>Basado en {statement.transactions.length} movimientos · {statement.periodStart} a {statement.periodEnd}</p>
        </div>

        {/* Grid */}
        <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          {[
            { icon: '🛡️', label: 'Reserva fiscal/mes', value: formatEUR(smoothing.taxReserveNeeded), sub: 'IVA + IRPF estimado' },
            { icon: '📈', label: 'Fondo de seguridad', value: formatEUR(smoothing.stabilityBufferNeeded), sub: 'Recomendado acumular' },
          ].map(c => (
            <div key={c.label} style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px' }}>
              <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>{c.icon} {c.label}</p>
              <p className="serif" style={{ fontSize: 30, color: 'var(--ink)' }}>{c.value}</p>
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Alert */}
        <div className="fade-up-3" style={{ background: 'var(--red-light)', borderRadius: 16, padding: '16px', display: 'flex', gap: 12, marginBottom: 32 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--red)' }}>Próximo pago a Hacienda: {formatEUR(smoothing.nextQuarterlyTaxAmount)}</p>
            <p style={{ fontSize: 11, color: 'var(--red)', opacity: 0.8, marginTop: 2 }}>Fecha estimada: {smoothing.nextQuarterlyTaxDate} · ¿Tienes reservado este importe?</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="fade-up-4" style={{ marginBottom: 32 }}>
          <button onClick={() => setShowTx(s => !s)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 12 }}>
            <span style={{ fontWeight: 500, fontSize: 14, color: 'var(--ink)' }}>Movimientos analizados ({statement.transactions.length})</span>
            <span style={{ color: 'var(--muted)', fontSize: 12 }}>{showTx ? '▲' : '▼'}</span>
          </button>

          {showTx && (
            <div style={{ border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
              {visibleTx.map((tx, i) => (
                <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--cream)', borderBottom: i < visibleTx.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</p>
                    <p style={{ fontSize: 11, color: 'var(--muted)' }}>{tx.date} · {tx.category}</p>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 500, marginLeft: 16, flexShrink: 0, color: tx.type === 'ingreso' ? 'var(--green)' : 'var(--red)' }}>
                    {tx.type === 'ingreso' ? '+' : '-'}{formatEUR(tx.amount)}
                  </p>
                </div>
              ))}
              {lockedTx.length > 0 && (
                <div style={{ position: 'relative' }}>
                  {lockedTx.slice(0, 3).map((tx, i) => (
                    <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--cream)', borderTop: '1px solid var(--border)', filter: 'blur(4px)', userSelect: 'none' }}>
                      <div><p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{tx.description}</p><p style={{ fontSize: 11, color: 'var(--muted)' }}>{tx.date}</p></div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: tx.type === 'ingreso' ? 'var(--green)' : 'var(--red)' }}>{tx.type === 'ingreso' ? '+' : '-'}{formatEUR(tx.amount)}</p>
                    </div>
                  ))}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(250,248,244,0.9)', fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>
                    🔒 +{lockedTx.length} movimientos más — activa tu prueba
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{ background: 'var(--cream)', border: '2px solid var(--gold-light)', borderRadius: 20, padding: '28px', textAlign: 'center' }}>
          <h3 className="serif" style={{ fontSize: 24, color: 'var(--ink)', marginBottom: 8 }}>Guarda tu análisis y accede a todo</h3>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>14 días gratis, sin tarjeta. Luego 4,99€/mes o 59,88€/año.</p>
          <button onClick={() => goTo('paywall')} style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'var(--gold)', color: 'var(--ink)', fontSize: 14, fontWeight: 500 }}>
            Activar prueba gratuita — 14 días
          </button>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>Sin tarjeta · Cancela cuando quieras</p>
        </div>
      </main>
    </div>
  );
}
