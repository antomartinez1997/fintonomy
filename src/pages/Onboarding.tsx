import { useState } from 'react';
import { AppState, OnboardingData } from '../types';

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
  const [data, setData] = useState<Partial<OnboardingData>>({ irpfRetentionRate: 0.15, isNewFreelancer: false });

  const next = () => setStep(s => s + 1);
  const back = () => step > 1 ? setStep(s => s - 1) : goTo('landing');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 48px', borderBottom: '1px solid var(--border)' }}>
        <button onClick={back} style={{ fontSize: 13, color: 'var(--muted)' }}>← Atrás</button>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>{step} / 3</span>
      </nav>

      <div style={{ padding: '8px 48px 0' }}>
        <div style={{ height: 3, background: 'var(--cream)', borderRadius: 99, maxWidth: 480, margin: '0 auto', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--gold)', borderRadius: 99, width: `${(step / 3) * 100}%`, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 480 }} className="fade-up">

          {step === 1 && (
            <>
              <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--gold)', marginBottom: 8 }}>Paso 1</p>
              <h2 className="serif" style={{ fontSize: 40, color: 'var(--ink)', marginBottom: 8 }}>Hola. ¿Cómo te llamas?</h2>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>Para personalizar tu análisis.</p>
              <input
                type="text"
                placeholder="Tu nombre completo"
                value={data.fullname || ''}
                onChange={e => setData(d => ({ ...d, fullname: e.target.value }))}
                autoFocus
                style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid var(--border)', background: 'var(--cream)', fontSize: 15, color: 'var(--ink)', outline: 'none', marginBottom: 12 }}
              />
              <button
                onClick={next}
                disabled={!data.fullname?.trim()}
                style={{ width: '100%', padding: '14px', borderRadius: 12, background: data.fullname?.trim() ? 'var(--ink)' : 'var(--border)', color: data.fullname?.trim() ? 'var(--paper)' : 'var(--muted)', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                Continuar →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--gold)', marginBottom: 8 }}>Paso 2</p>
              <h2 className="serif" style={{ fontSize: 40, color: 'var(--ink)', marginBottom: 8 }}>¿A qué te dedicas?</h2>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>Ayuda a categorizar mejor tus gastos deducibles.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                {sectors.map(s => (
                  <button
                    key={s}
                    onClick={() => setData(d => ({ ...d, businessSector: s }))}
                    style={{ padding: '12px', borderRadius: 12, fontSize: 13, textAlign: 'left', border: `1.5px solid ${data.businessSector === s ? 'var(--ink)' : 'var(--border)'}`, background: data.businessSector === s ? 'var(--ink)' : 'var(--cream)', color: data.businessSector === s ? 'var(--paper)' : 'var(--ink)' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={next}
                disabled={!data.businessSector}
                style={{ width: '100%', padding: '14px', borderRadius: 12, background: data.businessSector ? 'var(--ink)' : 'var(--border)', color: data.businessSector ? 'var(--paper)' : 'var(--muted)', fontSize: 14, fontWeight: 500 }}
              >
                Continuar →
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--gold)', marginBottom: 8 }}>Paso 3</p>
              <h2 className="serif" style={{ fontSize: 36, color: 'var(--ink)', marginBottom: 8 }}>¿Cuánto tiempo llevas de autónomo?</h2>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>Afecta al tipo de retención de IRPF aplicable.</p>
              {[
                { label: 'Menos de 2 años', sub: 'Retención reducida del 7%', value: true, rate: 0.07 },
                { label: 'Más de 2 años', sub: 'Retención general del 15%', value: false, rate: 0.15 },
              ].map(opt => (
                <button
                  key={String(opt.value)}
                  onClick={() => setData(d => ({ ...d, isNewFreelancer: opt.value, irpfRetentionRate: opt.rate }))}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: 12, marginBottom: 10, textAlign: 'left', border: `1.5px solid ${data.isNewFreelancer === opt.value ? 'var(--ink)' : 'var(--border)'}`, background: data.isNewFreelancer === opt.value ? 'var(--ink)' : 'var(--cream)', color: data.isNewFreelancer === opt.value ? 'var(--paper)' : 'var(--ink)' }}
                >
                  <div>
                    <p style={{ fontWeight: 500, fontSize: 14 }}>{opt.label}</p>
                    <p style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{opt.sub}</p>
                  </div>
                </button>
              ))}
              <button
                onClick={() => handleOnboardingComplete(data as OnboardingData)}
                disabled={data.isNewFreelancer === undefined}
                style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'var(--gold)', color: 'var(--ink)', fontSize: 14, fontWeight: 500, marginTop: 8 }}
              >
                Ver mi análisis →
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
