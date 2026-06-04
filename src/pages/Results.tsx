import { useState } from 'react';
import { AppState } from '../types';
import { formatEUR } from '../utils/finance';
import { TrendingUp, Shield, AlertTriangle, ChevronDown, ChevronUp, Lock } from 'lucide-react';

interface Props {
  state: AppState;
  goTo: (step: AppState['step']) => void;
}

export default function Results({ state, goTo }: Props) {
  const [showTransactions, setShowTransactions] = useState(false);
  const { statement, taxEstimate, smoothing, onboarding } = state;

  if (!statement || !taxEstimate || !smoothing) return null;

  const name = onboarding?.fullname?.split(' ')[0] ?? 'Autónomo';
  const riskColors = {
    bajo: { bg: 'var(--green-light)', text: 'var(--green)', label: 'Riesgo bajo' },
    medio: { bg: '#fff3cd', text: '#856404', label: 'Riesgo medio' },
    alto: { bg: 'var(--red-light)', text: 'var(--red)', label: 'Riesgo alto' },
  };
  const risk = riskColors[smoothing.riskLevel];

  // Show only first 5 transactions, rest blurred
  const visibleTx = statement.transactions.slice(0, 5);
  const lockedTx = statement.transactions.slice(5);

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      {/* Header */}
      <header className="px-6 py-5 md:px-12 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
        <span className="font-serif text-xl" style={{ color: 'var(--ink)' }}>fintonomy</span>
        <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--cream)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
          {statement.bankDetected} · {statement.periodStart} → {statement.periodEnd}
        </span>
      </header>

      <main className="px-6 py-10 md:px-12 max-w-2xl mx-auto">
        {/* Greeting */}
        <div className="animate-fade-up mb-10">
          <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>Tu análisis fiscal, {name}</p>
          <h1 className="font-serif text-4xl md:text-5xl" style={{ color: 'var(--ink)' }}>
            Aquí están tus números reales.
          </h1>
        </div>

        {/* Hero card — safe salary */}
        <div
          className="animate-fade-up delay-100 rounded-2xl p-7 mb-4"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs opacity-60 mb-1">Puedes pagarte este mes</p>
              <p className="font-serif text-5xl md:text-6xl">{formatEUR(smoothing.safeMonthlySalary)}</p>
            </div>
            <div
              className="px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: risk.bg, color: risk.text }}
            >
              {risk.label}
            </div>
          </div>
          <p className="text-xs opacity-50">
            Basado en {statement.transactions.length} movimientos · {statement.periodStart} a {statement.periodEnd}
          </p>
        </div>

        {/* Tax reserve + stability */}
        <div className="animate-fade-up delay-200 grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-2xl p-5" style={{ background: 'var(--cream)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} style={{ color: 'var(--gold)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Reserva fiscal/mes</span>
            </div>
            <p className="font-serif text-3xl" style={{ color: 'var(--ink)' }}>{formatEUR(smoothing.taxReserveNeeded)}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>IVA + IRPF estimado</p>
          </div>
          <div className="rounded-2xl p-5" style={{ background: 'var(--cream)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} style={{ color: 'var(--green)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Fondo de seguridad</span>
            </div>
            <p className="font-serif text-3xl" style={{ color: 'var(--ink)' }}>{formatEUR(smoothing.stabilityBufferNeeded)}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Recomendado acumular</p>
          </div>
        </div>

        {/* Quarterly tax alert */}
        <div
          className="animate-fade-up delay-300 flex items-start gap-3 rounded-2xl p-4 mb-8"
          style={{ background: 'var(--red-light)', border: '1px solid #ffc0c3' }}
        >
          <AlertTriangle size={16} style={{ color: 'var(--red)', marginTop: 2, flexShrink: 0 }} />
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--red)' }}>
              Próximo pago a Hacienda: {formatEUR(smoothing.nextQuarterlyTaxAmount)}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--red)', opacity: 0.8 }}>
              Fecha estimada: {smoothing.nextQuarterlyTaxDate} · ¿Tienes reservado este importe?
            </p>
          </div>
        </div>

        {/* Transactions preview */}
        <div className="animate-fade-up delay-400 mb-8">
          <button
            className="flex items-center justify-between w-full mb-4"
            onClick={() => setShowTransactions(s => !s)}
          >
            <span className="font-medium text-sm" style={{ color: 'var(--ink)' }}>
              Movimientos analizados ({statement.transactions.length})
            </span>
            {showTransactions ? <ChevronUp size={16} style={{ color: 'var(--muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--muted)' }} />}
          </button>

          {showTransactions && (
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {visibleTx.map((tx, i) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    borderBottom: i < visibleTx.length - 1 ? '1px solid var(--border)' : 'none',
                    background: 'var(--cream)',
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--ink)' }}>{tx.description}</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{tx.date} · {tx.category}</p>
                  </div>
                  <p
                    className="text-sm font-medium ml-4 flex-shrink-0"
                    style={{ color: tx.type === 'ingreso' ? 'var(--green)' : 'var(--red)' }}
                  >
                    {tx.type === 'ingreso' ? '+' : '-'}{formatEUR(tx.amount)}
                  </p>
                </div>
              ))}

              {/* Locked transactions */}
              {lockedTx.length > 0 && (
                <div className="relative">
                  {lockedTx.slice(0, 3).map((tx, i) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between px-4 py-3 blur-sm select-none"
                      style={{
                        borderTop: '1px solid var(--border)',
                        background: 'var(--cream)',
                      }}
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{tx.description}</p>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>{tx.date}</p>
                      </div>
                      <p className="text-sm font-medium" style={{ color: tx.type === 'ingreso' ? 'var(--green)' : 'var(--red)' }}>
                        {tx.type === 'ingreso' ? '+' : '-'}{formatEUR(tx.amount)}
                      </p>
                    </div>
                  ))}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                    style={{ background: 'rgba(250,248,244,0.85)', backdropFilter: 'blur(2px)' }}
                  >
                    <Lock size={16} style={{ color: 'var(--gold)' }} />
                    <p className="text-xs font-medium" style={{ color: 'var(--ink)' }}>
                      +{lockedTx.length} movimientos más — activa tu prueba para verlos
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA Paywall */}
        <div
          className="animate-fade-up delay-500 rounded-2xl p-7 text-center"
          style={{ background: 'var(--cream)', border: '2px solid var(--gold-light)' }}
        >
          <p className="font-serif text-2xl mb-2" style={{ color: 'var(--ink)' }}>
            Guarda tu análisis y accede a todo
          </p>
          <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
            14 días gratis, sin tarjeta. Luego 9€/mes o 79€/año (ahorras 29€).
          </p>
          <button
            onClick={() => goTo('paywall')}
            className="w-full py-3.5 rounded-xl font-medium text-sm transition-all hover:opacity-90"
            style={{ background: 'var(--gold)', color: 'var(--ink)' }}
          >
            Activar prueba gratuita — 14 días
          </button>
          <p className="text-xs mt-3" style={{ color: 'var(--muted)' }}>Sin tarjeta · Cancela cuando quieras</p>
        </div>
      </main>
    </div>
  );
}
