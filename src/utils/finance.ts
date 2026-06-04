import { Transaction, TaxEstimate, SmoothingResult } from '../types';

// Spanish IRPF progressive scale 2024
export function calculateIRPF(annualIncome: number): number {
  const brackets = [
    { limit: 12450, rate: 0.19 },
    { limit: 20200, rate: 0.24 },
    { limit: 35200, rate: 0.30 },
    { limit: 60000, rate: 0.37 },
    { limit: 300000, rate: 0.45 },
    { limit: Infinity, rate: 0.47 },
  ];

  let tax = 0;
  let prev = 0;
  for (const bracket of brackets) {
    if (annualIncome <= prev) break;
    const taxable = Math.min(annualIncome, bracket.limit) - prev;
    tax += taxable * bracket.rate;
    prev = bracket.limit;
  }
  return tax;
}

export function calculateTaxEstimate(transactions: Transaction[]): TaxEstimate {
  let ivaCollected = 0;
  let ivaPaid = 0;
  let irpfWithheld = 0;
  let professionalIncome = 0;
  let professionalExpenses = 0;

  for (const tx of transactions) {
    if (!tx.isProfessional) continue;

    if (tx.type === 'ingreso') {
      professionalIncome += tx.amount;
      ivaCollected += tx.amount * tx.ivaRate;
      irpfWithheld += tx.amount * tx.irpfRate;
    } else {
      const deductibleFactor = tx.isDeductible === 'si' ? 1 : tx.isDeductible === 'parcial' ? 0.5 : 0;
      if (deductibleFactor === 0) continue;
      const baseAmount = tx.amount / (1 + tx.ivaRate);
      const ivaTx = tx.amount - baseAmount;
      professionalExpenses += baseAmount * deductibleFactor;
      ivaPaid += ivaTx * deductibleFactor;
    }
  }

  const netProfit = Math.max(0, professionalIncome - professionalExpenses);
  // Modelo 130: 20% of net profit minus withheld
  const irpfEstimatedOwed = Math.max(0, netProfit * 0.20 - irpfWithheld);

  return {
    ivaCollected,
    ivaPaid,
    ivaNet: Math.max(0, ivaCollected - ivaPaid),
    irpfWithheld,
    irpfEstimatedOwed,
    totalTaxLiability: Math.max(0, ivaCollected - ivaPaid) + irpfEstimatedOwed,
  };
}

export function calculateSmoothing(
  transactions: Transaction[],
  taxEstimate: TaxEstimate,
  monthsOfData: number = 12
): SmoothingResult {
  const incomeTransactions = transactions.filter(t => t.type === 'ingreso' && t.isProfessional);
  
  // Monthly income buckets
  const monthlyIncomes: Record<string, number> = {};
  for (const tx of incomeTransactions) {
    const month = tx.date.substring(0, 7); // YYYY-MM
    monthlyIncomes[month] = (monthlyIncomes[month] || 0) + tx.amount;
  }

  const incomeValues = Object.values(monthlyIncomes);
  const avgMonthlyIncome = incomeValues.length > 0
    ? incomeValues.reduce((a, b) => a + b, 0) / incomeValues.length
    : 0;

  // Volatility: coefficient of variation
  const variance = incomeValues.length > 1
    ? incomeValues.reduce((sum, v) => sum + Math.pow(v - avgMonthlyIncome, 2), 0) / incomeValues.length
    : 0;
  const stdDev = Math.sqrt(variance);
  const cv = avgMonthlyIncome > 0 ? stdDev / avgMonthlyIncome : 0;
  const volatilityScore = Math.min(100, Math.round(cv * 100));

  const riskLevel = volatilityScore < 25 ? 'bajo' : volatilityScore < 55 ? 'medio' : 'alto';

  // Monthly tax reserve (quarterly taxes / 3)
  const monthlyTaxReserve = (taxEstimate.ivaNet + taxEstimate.irpfEstimatedOwed) / 3;

  // Stability buffer: 1-3 months expenses depending on risk
  const totalExpenses = transactions
    .filter(t => t.type === 'gasto' && t.isProfessional)
    .reduce((sum, t) => sum + t.amount, 0);
  const avgMonthlyExpenses = totalExpenses / Math.max(1, monthsOfData);
  const bufferMonths = riskLevel === 'bajo' ? 1 : riskLevel === 'medio' ? 2 : 3;
  const stabilityBufferNeeded = avgMonthlyExpenses * bufferMonths;

  // Safe salary: avg income minus taxes minus a safety margin
  const safeMonthlySalary = Math.max(0, avgMonthlyIncome - monthlyTaxReserve - (avgMonthlyExpenses * 0.1));

  // Next quarterly tax date
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3);
  const quarterlyDates = ['2024-01-30', '2024-04-22', '2024-07-22', '2024-10-21'];
  const nextDate = quarterlyDates[(quarter + 1) % 4] || quarterlyDates[0];

  return {
    safeMonthlySalary: Math.round(safeMonthlySalary),
    taxReserveNeeded: Math.round(monthlyTaxReserve),
    stabilityBufferNeeded: Math.round(stabilityBufferNeeded),
    volatilityScore,
    riskLevel,
    nextQuarterlyTaxDate: nextDate,
    nextQuarterlyTaxAmount: Math.round(taxEstimate.totalTaxLiability),
  };
}

export function formatEUR(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
