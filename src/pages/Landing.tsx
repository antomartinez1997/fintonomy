import { AppState } from '../types';

interface Props {
  state: AppState;
  goTo: (step: AppState['step']) => void;
}

export default function Landing({ goTo }: Props) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid var(--border)' }}>
        <span className="serif" style={{ fontSize: 22, color: 'var(--ink)', letterSpacing: '-0.5px' }}>fintonomy</span>
        <button onClick={() => goTo('onboarding')} style={{ fontSize: 13, color: 'var(--muted)', padding: '8px 16px', borderRadius: 99, border: '1px solid var(--border)' }}>
          Iniciar sesión
        </button>
      </nav>

      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
        <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 99, marginBottom: 32, background: 'var(--cream)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          Para autónomos en España
        </div>

        <h1 className="serif fade-up-1" style={{ fontSize: 'clamp(40px, 8vw, 80px)', lineHeight: 1.05, letterSpacing: '-1px', marginBottom: 24, maxWidth: 800, color: 'var(--ink)' }}>
          Sabe exactamente <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>cuánto</em> puedes pagarte.
        </h1>

        <p className="fade-up-2" style={{ fontSize: 18, color: 'var(--muted)', maxWidth: 500, lineHeight: 1.7, marginBottom: 40 }}>
          Sube tu extracto bancario. En segundos descubres tu reserva fiscal exacta y el sueldo que puedes transferirte este mes sin sorpresas de Hacienda.
        </p>

        <div className="fade-up-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => goTo('onboarding')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 99, fontSize: 14, fontWeight: 500, background: 'var(--ink)', color: 'var(--paper)' }}
          >
            Empieza gratis — 14 días →
          </button>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Sin tarjeta. Sin trucos.</span>
        </div>

        <p className="fade-up-4" style={{ marginTop: 32, fontSize: 12, color: 'var(--muted)' }}>
          Compatible con BBVA · CaixaBank · Santander · Bankinter · ING · Revolut · N26 · y más
        </p>
      </main>

      {/* Features */}
      <section style={{ borderTop: '1px solid var(--border)', background: 'var(--cream)', padding: '48px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40 }}>
          {[
            { icon: '⚡', title: 'Análisis instantáneo', desc: 'IA que lee cualquier extracto bancario español y categoriza tus movimientos automáticamente.' },
            { icon: '🛡️', title: 'Reserva fiscal precisa', desc: 'IVA, IRPF y Modelo 130 calculados con la normativa española vigente. Sin sorpresas en Hacienda.' },
            { icon: '📈', title: 'Tu sueldo, estabilizado', desc: 'Descubre cuánto puedes pagarte de forma consistente cada mes, sin descapitalizarte.' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ padding: '20px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>© 2024 Fintonomy · Hecho en España · No somos asesores fiscales</p>
      </footer>
    </div>
  );
}
