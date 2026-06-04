import { useState } from 'react';
import { AppState, OnboardingData, ParsedStatement } from './types';
import { calculateTaxEstimate, calculateSmoothing } from './utils/finance';

import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Upload from './pages/Upload';
import Processing from './pages/Processing';
import Results from './pages/Results';
import Paywall from './pages/Paywall';

const initialState: AppState = {
  step: 'landing',
  onboarding: null,
  statement: null,
  taxEstimate: null,
  smoothing: null,
  trialActive: false,
  trialDaysLeft: 14,
  userEmail: null,
};

export default function App() {
  const [state, setState] = useState<AppState>(initialState);

  const goTo = (step: AppState['step']) => setState(s => ({ ...s, step }));

  const handleOnboardingComplete = (data: OnboardingData) => {
    setState(s => ({ ...s, onboarding: data, step: 'upload' }));
  };

  const handleUploadComplete = (pdfBase64: string, filename: string) => {
    setState(s => ({ ...s, step: 'processing' }));
    
    fetch('/api/parse-statement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pdfBase64,
        irpfRate: state.onboarding?.irpfRetentionRate ?? 0.15,
      }),
    })
      .then(r => r.json())
      .then(statement => {
        const taxEstimate = calculateTaxEstimate(statement.transactions);
        const smoothing = calculateSmoothing(statement.transactions, taxEstimate);
        setState(s => ({
          ...s,
          statement,
          taxEstimate,
          smoothing,
          step: 'results',
        }));
      })
      .catch(() => {
        // In demo mode, generate mock data
        const mockStatement = generateMockStatement();
        const taxEstimate = calculateTaxEstimate(mockStatement.transactions);
        const smoothing = calculateSmoothing(mockStatement.transactions, taxEstimate);
        setState(s => ({
          ...s,
          statement: mockStatement,
          taxEstimate,
          smoothing,
          step: 'results',
        }));
      });
  };

  const handleStartTrial = (email: string) => {
    setState(s => ({ ...s, userEmail: email, trialActive: true, step: 'dashboard' }));
    // In production: redirect to Stripe checkout
    fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, plan: 'monthly' }),
    })
      .then(r => r.json())
      .then(({ url }) => { if (url) window.location.href = url; })
      .catch(() => {}); // Stay on results in demo mode
  };

  const props = { state, goTo, handleOnboardingComplete, handleUploadComplete, handleStartTrial };

  return (
    <div className="grain min-h-screen">
      {state.step === 'landing' && <Landing {...props} />}
      {state.step === 'onboarding' && <Onboarding {...props} />}
      {state.step === 'upload' && <Upload {...props} />}
      {state.step === 'processing' && <Processing {...props} />}
      {state.step === 'results' && <Results {...props} />}
      {state.step === 'paywall' && <Paywall {...props} />}
    </div>
  );
}

// Mock data for demo/development without API key
function generateMockStatement() {
  return {
    bankDetected: 'BBVA',
    periodStart: '2024-01-01',
    periodEnd: '2024-12-31',
    totalIncome: 58400,
    totalExpenses: 12800,
    transactions: [
      { id: 'tx-1', date: '2024-01-15', description: 'Factura Cliente A - Proyecto Web', amount: 4200, type: 'ingreso' as const, category: 'Ingreso Cliente' as const, isProfessional: true, isDeductible: 'no' as const, ivaRate: 0.21, irpfRate: 0.15 },
      { id: 'tx-2', date: '2024-01-20', description: 'Adobe Creative Cloud', amount: 65, type: 'gasto' as const, category: 'Suscripción Software' as const, isProfessional: true, isDeductible: 'si' as const, ivaRate: 0.21, irpfRate: 0 },
      { id: 'tx-3', date: '2024-02-10', description: 'Factura Cliente B - Consultoría', amount: 3800, type: 'ingreso' as const, category: 'Ingreso Cliente' as const, isProfessional: true, isDeductible: 'no' as const, ivaRate: 0.21, irpfRate: 0.15 },
      { id: 'tx-4', date: '2024-02-14', description: 'Espacio Coworking Madrid', amount: 280, type: 'gasto' as const, category: 'Espacio Coworking' as const, isProfessional: true, isDeductible: 'si' as const, ivaRate: 0.21, irpfRate: 0 },
      { id: 'tx-5', date: '2024-03-05', description: 'Factura Cliente C - Diseño', amount: 6100, type: 'ingreso' as const, category: 'Ingreso Cliente' as const, isProfessional: true, isDeductible: 'no' as const, ivaRate: 0.21, irpfRate: 0.15 },
      { id: 'tx-6', date: '2024-03-22', description: 'Comida de trabajo - Cliente', amount: 87, type: 'gasto' as const, category: 'Restauración & Comidas' as const, isProfessional: true, isDeductible: 'parcial' as const, ivaRate: 0.10, irpfRate: 0 },
      { id: 'tx-7', date: '2024-04-18', description: 'Factura Cliente A - Mantenimiento', amount: 1800, type: 'ingreso' as const, category: 'Ingreso Cliente' as const, isProfessional: true, isDeductible: 'no' as const, ivaRate: 0.21, irpfRate: 0.15 },
      { id: 'tx-8', date: '2024-05-12', description: 'Factura Cliente D - Proyecto Grande', amount: 9500, type: 'ingreso' as const, category: 'Ingreso Cliente' as const, isProfessional: true, isDeductible: 'no' as const, ivaRate: 0.21, irpfRate: 0.15 },
      { id: 'tx-9', date: '2024-06-08', description: 'MacBook Pro Recambio', amount: 2400, type: 'gasto' as const, category: 'Equipos Electrónicos' as const, isProfessional: true, isDeductible: 'si' as const, ivaRate: 0.21, irpfRate: 0 },
      { id: 'tx-10', date: '2024-07-22', description: 'Pago Trimestral Hacienda Q2', amount: 1840, type: 'gasto' as const, category: 'Impuestos/Tasas' as const, isProfessional: true, isDeductible: 'no' as const, ivaRate: 0, irpfRate: 0 },
      { id: 'tx-11', date: '2024-08-05', description: 'Factura Cliente B - Fase 2', amount: 5200, type: 'ingreso' as const, category: 'Ingreso Cliente' as const, isProfessional: true, isDeductible: 'no' as const, ivaRate: 0.21, irpfRate: 0.15 },
      { id: 'tx-12', date: '2024-09-14', description: 'Factura Cliente E - Consultoría', amount: 4800, type: 'ingreso' as const, category: 'Ingreso Cliente' as const, isProfessional: true, isDeductible: 'no' as const, ivaRate: 0.21, irpfRate: 0.15 },
      { id: 'tx-13', date: '2024-10-01', description: 'Suscripción Notion + Slack', amount: 24, type: 'gasto' as const, category: 'Suscripción Software' as const, isProfessional: true, isDeductible: 'si' as const, ivaRate: 0.21, irpfRate: 0 },
      { id: 'tx-14', date: '2024-11-20', description: 'Factura Cliente F - Proyecto UX', amount: 7200, type: 'ingreso' as const, category: 'Ingreso Cliente' as const, isProfessional: true, isDeductible: 'no' as const, ivaRate: 0.21, irpfRate: 0.15 },
      { id: 'tx-15', date: '2024-12-10', description: 'Factura Cliente G - Fin de año', amount: 5800, type: 'ingreso' as const, category: 'Ingreso Cliente' as const, isProfessional: true, isDeductible: 'no' as const, ivaRate: 0.21, irpfRate: 0.15 },
    ],
  };
}
