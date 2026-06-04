import { useState } from 'react';
import { AppState } from '../types';
import { formatEUR } from '../utils/finance';

interface Props {
  state: AppState;
  goTo: (step: AppState['step']) => void;
  handleStartTrial: (email: string) => void;
}

const FEATURES = [
  'Análisis ilimitado de extractos bancarios',
  'Historial de todos tus movimientos',
  'Simulador de escenarios fiscales',
  'Exportar a PDF para tu gestor',
  'Alertas de pagos a Hacienda',
  'Soporte por email',
];

export default function Paywall({ state, goTo, handleStartTrial }: Props) {
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);
  const { smoothing } = state;

  const handleSubmit = async () => {
    if (!email.includes('@')) return;
    setLoading(true);
    await handleStartTrial(email);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid var(--border)' }}>
        <span className="serif" style={{ fontSize: 20, color: 'var(--ink)' }}>fintonomy</span>
        <button onClick={() => goTo('results')} style={{ fontSize: 13, color: 'var(--muted)' }}>← Volver al análisis</button>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 32 }}>
            {smoothing && (
              <div style={{ display: 'inline-block', padding: '8px 16px', borderRadius: 12, background: 'var(--green-light)', color: 'var(--green)', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
                Tu sueldo seguro: {formatEUR(smoothing.safeMonthlySalary)}/mes está listo
              </div>
            )}
            <h1 className="serif" style={{ fontSize: 40, color: 'var(--ink)', marginBottom: 8 }}>Empieza gratis hoy</h1>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>14 días completos sin coste. Sin tarjeta ahora.</p>
          </div>

          {/* Plan toggle */}
          <div className="fade-up-1" style={{ display: 'flex', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 12, padding: 4, marginBottom: 16 }}>
            {(['monthly', 'yearly'] as const).map(p => (
              <button key={p} onClick={() => setPlan(p)} style={{ flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 500, background: plan === p ? 'var(--ink)' : 'transparent', color: plan === p ? 'var(--paper)' : 'var(--muted)', position: 'relative' }}>
                {p === 'monthly' ? '4,99€ / mes' : '59,88€ / año'}
                {p === 'yearly' && <span style={{ position: 'absolute', top: -8, right: -4, fontSize: 10, padding: '2px 6px', borderRadius: 99, background: 'var(--gold)', color: 'var(--ink)', fontWeight: 600 }}>-27%</span>}
              </button>
            ))}
          </div>

          {/* Features */}
          <div className="fade-up-2" style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px', marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', marginBottom: 16 }}>TODO incluido en PRO</p>
            {FEATURES.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0 }}>✓</div>
                <span style={{ fontSize: 13, color: 'var(--ink)' }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Email */}
          <div className="fade-up-3">
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink)', marginBottom: 8 }}>Tu email para activar la prueba</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid var(--border)', background: 'var(--cream)', fontSize: 14, color: 'var(--ink)', outline: 'none', marginBottom: 10 }}
            />
            <button
              onClick={handleSubmit}
              disabled={!email.includes('@') || loading}
              style={{ width: '100%', padding: '14px', borderRadius: 12, background: email.includes('@') ? 'var(--gold)' : 'var(--border)', color: email.includes('@') ? 'var(--ink)' : 'var(--muted)', fontSize: 14, fontWeight: 500 }}
            >
              {loading ? 'Procesando...' : 'Activar 14 días gratis →'}
            </button>
            <p style={{ fontSize: 11, textAlign: 'center', color: 'var(--muted)', marginTop: 10 }}>No se cobra nada hoy · Cancela en cualquier momento</p>
          </div>
        </div>
      </main>
    </div>
  );
}
