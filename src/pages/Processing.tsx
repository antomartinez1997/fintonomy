import { useEffect, useState } from 'react';
import { AppState } from '../types';

interface Props {
  state: AppState;
  goTo: (step: AppState['step']) => void;
}

const steps = [
  { label: 'Leyendo tu extracto bancario...', duration: 2000 },
  { label: 'Identificando ingresos y gastos...', duration: 2500 },
  { label: 'Aplicando normativa fiscal española...', duration: 2000 },
  { label: 'Calculando tu reserva de impuestos...', duration: 1500 },
  { label: 'Estimando tu sueldo seguro...', duration: 1500 },
];

export default function Processing({ }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let elapsed = 0;
    const total = steps.reduce((s, st) => s + st.duration, 0);
    
    steps.forEach((step, i) => {
      setTimeout(() => {
        setCurrentStep(i);
        setProgress(Math.round(((elapsed + step.duration) / total) * 100));
      }, elapsed);
      elapsed += step.duration;
    });
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'var(--paper)' }}
    >
      <div className="w-full max-w-sm text-center">
        {/* Logo */}
        <p className="font-serif text-2xl mb-16" style={{ color: 'var(--ink)' }}>fintonomy</p>

        {/* Animated ring */}
        <div className="relative w-24 h-24 mx-auto mb-10">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
            <circle
              cx="48" cy="48" r="40"
              fill="none"
              stroke="var(--cream)"
              strokeWidth="6"
            />
            <circle
              cx="48" cy="48" r="40"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-medium" style={{ color: 'var(--ink)' }}>{progress}%</span>
          </div>
        </div>

        {/* Current step */}
        <p className="font-medium text-sm mb-2" style={{ color: 'var(--ink)' }}>
          {steps[currentStep]?.label}
        </p>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === currentStep ? 20 : 6,
                height: 6,
                background: i <= currentStep ? 'var(--gold)' : 'var(--border)',
              }}
            />
          ))}
        </div>

        {/* Reassurance */}
        <p className="text-xs mt-10" style={{ color: 'var(--muted)' }}>
          Suele tardar entre 10 y 30 segundos según el extracto
        </p>
      </div>
    </div>
  );
}
