import { AppState } from '../types';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';

interface Props {
  state: AppState;
  goTo: (step: AppState['step']) => void;
}

export default function Landing({ goTo }: Props) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--paper)' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <span className="font-serif text-xl tracking-tight" style={{ color: 'var(--ink)' }}>
          fintonomy
        </span>
        <button
          onClick={() => goTo('onboarding')}
          className="text-sm font-medium px-4 py-2 rounded-full transition-all hover:opacity-70"
          style={{ color: 'var(--muted)' }}
        >
          Iniciar sesión
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-16 md:py-24">
        {/* Badge */}
        <div
          className="animate-fade-up inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-8"
          style={{ background: 'var(--cream)', color: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Para autónomos en España
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-up delay-100 font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight mb-6 max-w-4xl"
          style={{ color: 'var(--ink)' }}
        >
          Sabe exactamente{' '}
          <em className="not-italic" style={{ color: 'var(--gold)' }}>cuánto</em>
          {' '}puedes pagarte.
        </h1>

        {/* Subheadline */}
        <p
          className="animate-fade-up delay-200 text-lg md:text-xl max-w-xl leading-relaxed mb-10"
          style={{ color: 'var(--muted)' }}
        >
          Sube tu extracto bancario. En segundos descubres tu reserva fiscal exacta
          y el sueldo que puedes transferirte este mes sin sorpresas de Hacienda.
        </p>

        {/* CTA */}
        <div className="animate-fade-up delay-300 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => goTo('onboarding')}
            className="group flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm transition-all hover:opacity-90 hover:gap-3"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            Empieza gratis — 14 días
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            Sin tarjeta. Sin trucos.
          </span>
        </div>

        {/* Social proof */}
        <p className="animate-fade-up delay-400 mt-8 text-xs" style={{ color: 'var(--muted)' }}>
          Compatible con BBVA · CaixaBank · Santander · Bankinter · ING · Revolut · N26 · y más
        </p>
      </main>

      {/* Features strip */}
      <section
        className="animate-fade-up delay-500 border-t px-6 py-10 md:px-12"
        style={{ borderColor: 'var(--border)', background: 'var(--cream)' }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap size={18} />,
              title: 'Análisis instantáneo',
              desc: 'IA que lee cualquier extracto bancario español y categoriza tus movimientos automáticamente.',
            },
            {
              icon: <Shield size={18} />,
              title: 'Reserva fiscal precisa',
              desc: 'IVA, IRPF y Modelo 130 calculados con la normativa española vigente. Sin sorpresas en Hacienda.',
            },
            {
              icon: <TrendingUp size={18} />,
              title: 'Tu sueldo, estabilizado',
              desc: 'Descubre cuánto puedes pagarte de forma consistente cada mes, sin descapitalizarte.',
            },
          ].map((f, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--gold-light)', color: 'var(--ink)' }}
              >
                {f.icon}
              </div>
              <h3 className="font-medium text-sm" style={{ color: 'var(--ink)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-5 text-center" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          © 2024 Fintonomy · Hecho en España · No somos asesores fiscales
        </p>
      </footer>
    </div>
  );
}
