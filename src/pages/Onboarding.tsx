import { useState } from 'react';
import { AppState, OnboardingData } from '../types';
import { ArrowRight, ChevronLeft } from 'lucide-react';

interface Props {
  state: AppState;
  goTo: (step: AppState['step']) => void;
  handleOnboardingComplete: (data: OnboardingData) => void;
}

const sectors = [
  'Diseño & Creatividad', 'Desarrollo Software', 'Marketing & Comunicación',
  'Consultoría & Estrategia', 'Fotografía & Vídeo', 'Arquitectura & Ingeniería',
  'Salud & Bienestar', 'Educación & Formación', 'Legal & Finanzas', 'Otro',
];

export default function Onboarding({ goTo, handleOnboardingComplete }: Props) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({
    irpfRetentionRate: 0.15,
    isNewFreelancer: false,
  });

  const next = () => setStep(s => s + 1);
  const back = () => step > 1 ? setStep(s => s - 1) : goTo('landing');

  const complete = () => {
    handleOnboardingComplete(data as OnboardingData);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--paper)' }}>
      {/* Nav */}
      <nav className="flex items-center gap-4 px-6 py-5 md:px-12">
        <button onClick={back} className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-60" style={{ color: 'var(--muted)' }}>
          <ChevronLeft size={16} />
          Atrás
        </button>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>{step} / 3</span>
      </nav>

      {/* Progress */}
      <div className="px-6 md:px-12 mb-10">
        <div className="h-1 rounded-full overflow-hidden max-w-md mx-auto" style={{ background: 'var(--cream)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%`, background: 'var(--gold)' }}
          />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">

          {/* Step 1: Name */}
          {step === 1 && (
            <div className="animate-fade-up">
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--gold)' }}>Paso 1</p>
              <h2 className="font-serif text-4xl mb-2" style={{ color: 'var(--ink)' }}>Hola. ¿Cómo te llamas?</h2>
              <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>Para personalizar tu análisis.</p>
              <input
                type="text"
                placeholder="Tu nombre completo"
                value={data.fullname || ''}
                onChange={e => setData(d => ({ ...d, fullname: e.target.value }))}
                className="w-full px-4 py-3.5 rounded-xl text-base outline-none transition-all"
                style={{
                  background: 'var(--cream)',
                  border: '1.5px solid var(--border)',
                  color: 'var(--ink)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                autoFocus
              />
              <button
                onClick={next}
                disabled={!data.fullname?.trim()}
                className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm transition-all disabled:opacity-40"
                style={{ background: 'var(--ink)', color: 'var(--paper)' }}
              >
                Continuar <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Step 2: Sector */}
          {step === 2 && (
            <div className="animate-fade-up">
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--gold)' }}>Paso 2</p>
              <h2 className="font-serif text-4xl mb-2" style={{ color: 'var(--ink)' }}>¿A qué te dedicas?</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Ayuda a categorizar mejor tus gastos deducibles.</p>
              <div className="grid grid-cols-2 gap-2">
                {sectors.map(s => (
                  <button
                    key={s}
                    onClick={() => setData(d => ({ ...d, businessSector: s }))}
                    className="px-3 py-3 rounded-xl text-sm text-left transition-all"
                    style={{
                      background: data.businessSector === s ? 'var(--ink)' : 'var(--cream)',
                      color: data.businessSector === s ? 'var(--paper)' : 'var(--ink)',
                      border: `1.5px solid ${data.businessSector === s ? 'var(--ink)' : 'var(--border)'}`,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={next}
                disabled={!data.businessSector}
                className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm transition-all disabled:opacity-40"
                style={{ background: 'var(--ink)', color: 'var(--paper)' }}
              >
                Continuar <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Step 3: IRPF */}
          {step === 3 && (
            <div className="animate-fade-up">
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--gold)' }}>Paso 3</p>
              <h2 className="font-serif text-4xl mb-2" style={{ color: 'var(--ink)' }}>¿Cuánto tiempo llevas de autónomo?</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Afecta al tipo de retención de IRPF aplicable.</p>

              {[
                { label: 'Menos de 2 años', sub: 'Retención reducida del 7%', value: true, rate: 0.07 },
                { label: 'Más de 2 años', sub: 'Retención general del 15%', value: false, rate: 0.15 },
              ].map(opt => (
                <button
                  key={String(opt.value)}
                  onClick={() => setData(d => ({ ...d, isNewFreelancer: opt.value, irpfRetentionRate: opt.rate }))}
                  className="w-full flex items-center justify-between px-4 py-4 rounded-xl mb-3 text-left transition-all"
                  style={{
                    background: data.isNewFreelancer === opt.value ? 'var(--ink)' : 'var(--cream)',
                    color: data.isNewFreelancer === opt.value ? 'var(--paper)' : 'var(--ink)',
                    border: `1.5px solid ${data.isNewFreelancer === opt.value ? 'var(--ink)' : 'var(--border)'}`,
                  }}
                >
                  <div>
                    <p className="font-medium text-sm">{opt.label}</p>
                    <p className="text-xs mt-0.5 opacity-70">{opt.sub}</p>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: data.isNewFreelancer === opt.value ? 'var(--paper)' : 'var(--border)' }}
                  >
                    {data.isNewFreelancer === opt.value && (
                      <div className="w-2 h-2 rounded-full" style={{ background: 'var(--paper)' }} />
                    )}
                  </div>
                </button>
              ))}

              <button
                onClick={complete}
                disabled={data.isNewFreelancer === undefined}
                className="mt-2 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm transition-all disabled:opacity-40"
                style={{ background: 'var(--gold)', color: 'var(--ink)' }}
              >
                Ver mi análisis <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
