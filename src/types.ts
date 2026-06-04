export type TransactionCategory =
  | 'Ingreso Cliente'
  | 'Suscripción Software'
  | 'Espacio Coworking'
  | 'Suministros & Hogar'
  | 'Restauración & Comidas'
  | 'Viaje & Transporte'
  | 'Equipos Electrónicos'
  | 'Impuestos/Tasas'
  | 'Nómina/Sueldo propio'
  | 'Otros';

export type TransactionType = 'ingreso' | 'gasto';
export type DeductibleStatus = 'si' | 'no' | 'parcial' | 'dudoso';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  isProfessional: boolean;
  isDeductible: DeductibleStatus;
  ivaRate: number;      // 0, 0.04, 0.10, 0.21
  irpfRate: number;     // 0, 0.07, 0.15, 0.19
}

export interface ParsedStatement {
  transactions: Transaction[];
  bankDetected: string;
  periodStart: string;
  periodEnd: string;
  totalIncome: number;
  totalExpenses: number;
}

export interface TaxEstimate {
  ivaCollected: number;
  ivaPaid: number;
  ivaNet: number;            // ivaCollected - ivaPaid (what you owe Hacienda)
  irpfWithheld: number;      // already withheld by clients
  irpfEstimatedOwed: number; // quarterly Modelo 130 estimate
  totalTaxLiability: number;
}

export interface SmoothingResult {
  safeMonthlySalary: number;
  taxReserveNeeded: number;
  stabilityBufferNeeded: number;
  volatilityScore: number;   // 0-100
  riskLevel: 'bajo' | 'medio' | 'alto';
  nextQuarterlyTaxDate: string;
  nextQuarterlyTaxAmount: number;
}

export interface OnboardingData {
  fullname: string;
  businessSector: string;
  irpfRetentionRate: number;  // 0.07 or 0.15
  isNewFreelancer: boolean;   // < 2 years → 7% retention
}

export interface AppState {
  step: 'landing' | 'onboarding' | 'upload' | 'processing' | 'results' | 'paywall' | 'dashboard';
  onboarding: OnboardingData | null;
  statement: ParsedStatement | null;
  taxEstimate: TaxEstimate | null;
  smoothing: SmoothingResult | null;
  trialActive: boolean;
  trialDaysLeft: number;
  userEmail: string | null;
}
