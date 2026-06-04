import { useState } from 'react';
import { AppState } from '../types';
import { formatEUR } from '../utils/finance';
import { Check, ArrowRight } from 'lucide-react';

interface Props {
  state: AppState;
  goTo: (step: AppState['step']) => void;
  handleStartTrial: (email: string) => void;
}

const PRO_FEATURES = [
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
    if (!email.trim() || !email.includes('@')) return;
    setLoading(true);
    await handleStartTrial(email);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--paper)' }}>
      {/* Header */}
      <header className="px-6 py-5 md:px-12 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
        <span className="font-serif text-xl" style={{ color: 'var(--ink)' }}>fintonomy</span>
        <button onClick={() => goTo('results')} className="text-sm" style={{ color: 'var(--muted)' }}>
          ← Volver al análisis
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Headline */}
          <div className="text-center mb-10 animate-fade-up">
            {smoothing && (
              <div
                className="inline-block px-4 py-2 rounded-xl mb-4 text-sm font-medium"
                style={{ background: 'var(--green-light)', color: 'var(--green)' }}
              >
                Tu sueldo seguro: {formatEUR(smoothing.safeMonthlySalary)}/mes está listo
              </div>
            )}
            <h1 className="font-serif text-4xl mb-2" style={{ color: 'var(--ink)' }}>
              Empieza gratis hoy
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              14 días completos sin coste. Sin tarjeta ahora.
            </p>
          </div>

          {/* Plan toggle */}
          <div className="animate-fade-up delay-100 flex rounded-xl p-1 mb-6" style={{ background: 'var(--cream)', border: '1px solid var(--border)' }}>
            {(['monthly', 'yearly'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPlan(p)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all relative"
                style={{
                  background: plan === p ? 'var(--ink)' : 'transparent',
                  color: plan === p ? 'var(--paper)' : 'var(--muted)',
                }}
              >
                {p === 'monthly' ? '9€ / mes' : '79€ / año'}
                {p === 'yearly' && (
                  <span
                    className="absolute -top-2 -right-1 text-xs px-1.5 py-0.5 rounded-full font-medium"
                    style={{ background: 'var(--gold)', color: 'var(--ink)' }}
                  >
                    -27%
                  </span>
                )}
              </button>
            ))}
          </div>

          {plan === 'yearly' && (
            <p className="text-xs text-center mb-4" style={{ color: 'var(--green)' }}>
              ✓ Ahorras 29€ al año respecto al plan mensual
            </p>
          )}

          {/* Features */}
          <div className="animate-fade-up delay-200 rounded-2xl p-5 mb-6" style={{ background: 'var(--cream)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-medium mb-4" style={{ color: 'var(--muted)' }}>TODO incluido en PRO</p>
            <div className="space-y-2.5">
              {PRO_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--green-light)' }}>
                    <Check size={10} style={{ color: 'var(--green)' }} />
                  </div>
                  <span className="text-sm" style={{ color: 'var(--ink)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="animate-fade-up delay-300">
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--ink)' }}>
              Tu email para activar la prueba
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all mb-3"
              style={{
                background: 'var(--cream)',
                border: '1.5px solid var(--border)',
                color: 'var(--ink)',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            <button
              onClick={handleSubmit}
              disabled={!email.includes('@') || loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm transition-all disabled:opacity-40"
              style={{ background: 'var(--gold)', color: 'var(--ink)' }}
            >
              {loading ? 'Procesando...' : (
                <>Activar 14 días gratis <ArrowRight size={16} /></>
              )}
            </button>
            <p className="text-xs text-center mt-3" style={{ color: 'var(--muted)' }}>
              No se cobra nada hoy · Cancela en cualquier momento
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
