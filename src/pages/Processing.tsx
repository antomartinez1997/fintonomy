import { useEffect, useState } from 'react';

const steps = [
  'Leyendo tu extracto bancario...',
  'Identificando ingresos y gastos...',
  'Aplicando normativa fiscal española...',
  'Calculando tu reserva de impuestos...',
  'Estimando tu sueldo seguro...',
];

export default function Processing() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const durations = [2000, 2500, 2000, 1500, 1500];
    let elapsed = 0;
    const total = durations.reduce((a, b) => a + b, 0);
    durations.forEach((dur, i) => {
      setTimeout(() => { setCurrentStep(i); setProgress(Math.round(((elapsed + dur) / total) * 100)); }, elapsed);
      elapsed += dur;
    });
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)', padding: '40px 24px' }}>
      <p className="serif" style={{ fontSize: 24, color: 'var(--ink)', marginBottom: 60 }}>fintonomy</p>

      <div style={{ position: 'relative', width: 96, height: 96, marginBottom: 40 }}>
        <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="48" cy="48" r="40" fill="none" stroke="var(--cream)" strokeWidth="6" />
          <circle cx="48" cy="48" r="40" fill="none" stroke="var(--gold)" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 18, fontWeight: 500, color: 'var(--ink)' }}>{progress}%</span>
        </div>
      </div>

      <p style={{ fontWeight: 500, fontSize: 14, color: 'var(--ink)', marginBottom: 24 }}>{steps[currentStep]}</p>

      <div style={{ display: 'flex', gap: 6 }}>
        {steps.map((_, i) => (
          <div key={i} style={{ height: 6, borderRadius: 99, background: i <= currentStep ? 'var(--gold)' : 'var(--border)', width: i === currentStep ? 20 : 6, transition: 'all 0.3s' }} />
        ))}
      </div>

      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 40 }}>Suele tardar entre 10 y 30 segundos</p>
    </div>
  );
}
