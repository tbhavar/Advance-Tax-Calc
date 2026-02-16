export interface IncomeInputs {
  grossSalary: number;
  businessIncome: number;
  rentalIncome: number;
  otherIncome: number;
}

export interface TaxCalculation {
  grossTotalIncome: number;
  standardDeduction: number;
  totalIncome: number;
  taxBeforeRebate: number;
  rebateU87A: number;
  taxAfterRebate: number;
  surcharge: number;
  taxAfterSurcharge: number;
  cess: number;
  totalTax: number;
  advanceTaxInstallments: {
    date: string;
    percentage: number;
    amount: number;
    cumulative: number;
  }[];
}

const TAX_SLABS = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400000, max: 800000, rate: 0.05 },
  { min: 800000, max: 1200000, rate: 0.10 },
  { min: 1200000, max: 1600000, rate: 0.15 },
  { min: 1600000, max: 2000000, rate: 0.20 },
  { min: 2000000, max: 2400000, rate: 0.25 },
  { min: 2400000, max: Infinity, rate: 0.30 },
];

function calculateSlabTax(income: number): number {
  let tax = 0;

  for (const slab of TAX_SLABS) {
    if (income > slab.min) {
      const taxableInThisSlab = Math.min(income, slab.max) - slab.min;
      tax += taxableInThisSlab * slab.rate;
    }
  }

  return Math.round(tax);
}

function calculateMarginalRelief(income: number, tax: number): number {
  if (income > 1200000 && income <= 1275000) {
    const excessIncome = income - 1200000;
    const maxTax = excessIncome;
    return Math.max(0, tax - maxTax);
  }
  return 0;
}

function calculateSurcharge(income: number, tax: number): number {
  let surchargeRate = 0;

  if (income > 5000000 && income <= 10000000) {
    surchargeRate = 0.10;
  } else if (income > 10000000 && income <= 20000000) {
    surchargeRate = 0.15;
  } else if (income > 20000000) {
    surchargeRate = 0.25;
  }

  if (surchargeRate === 0) return 0;

  const surcharge = tax * surchargeRate;

  let thresholdIncome = 0;
  if (income > 5000000 && income <= 10000000) {
    thresholdIncome = 5000000;
  } else if (income > 10000000 && income <= 20000000) {
    thresholdIncome = 10000000;
  } else if (income > 20000000) {
    thresholdIncome = 20000000;
  }

  if (thresholdIncome > 0) {
    const taxAtThreshold = calculateSlabTax(thresholdIncome);
    const excessIncome = income - thresholdIncome;
    const maxTaxWithSurcharge = taxAtThreshold + excessIncome;
    const actualTaxWithSurcharge = tax + surcharge;

    if (actualTaxWithSurcharge > maxTaxWithSurcharge) {
      return Math.round(maxTaxWithSurcharge - tax);
    }
  }

  return Math.round(surcharge);
}

export function calculateTax(inputs: IncomeInputs): TaxCalculation {
  const grossTotalIncome =
    inputs.grossSalary +
    inputs.businessIncome +
    inputs.rentalIncome +
    inputs.otherIncome;

  const standardDeduction = inputs.grossSalary > 0 ? 75000 : 0;

  const totalIncome = Math.max(0, grossTotalIncome - standardDeduction);

  let taxBeforeRebate = calculateSlabTax(totalIncome);

  const marginalReliefAmount = calculateMarginalRelief(totalIncome, taxBeforeRebate);
  taxBeforeRebate = taxBeforeRebate - marginalReliefAmount;

  let rebateU87A = 0;
  if (totalIncome <= 1200000) {
    rebateU87A = Math.min(taxBeforeRebate, 60000);
  }

  const taxAfterRebate = taxBeforeRebate - rebateU87A;

  const surcharge = calculateSurcharge(totalIncome, taxAfterRebate);

  const taxAfterSurcharge = taxAfterRebate + surcharge;

  const cess = Math.round(taxAfterSurcharge * 0.04);

  const totalTax = taxAfterSurcharge + cess;

  const advanceTaxInstallments = [
    { date: '15 June 2025', percentage: 15, amount: Math.round(totalTax * 0.15), cumulative: 0 },
    { date: '15 September 2025', percentage: 45, amount: 0, cumulative: 0 },
    { date: '15 December 2025', percentage: 75, amount: 0, cumulative: 0 },
    { date: '15 March 2026', percentage: 100, amount: 0, cumulative: 0 },
  ];

  advanceTaxInstallments[0].cumulative = advanceTaxInstallments[0].amount;
  advanceTaxInstallments[1].amount = Math.round(totalTax * 0.45) - advanceTaxInstallments[0].cumulative;
  advanceTaxInstallments[1].cumulative = Math.round(totalTax * 0.45);
  advanceTaxInstallments[2].amount = Math.round(totalTax * 0.75) - advanceTaxInstallments[1].cumulative;
  advanceTaxInstallments[2].cumulative = Math.round(totalTax * 0.75);
  advanceTaxInstallments[3].amount = totalTax - advanceTaxInstallments[2].cumulative;
  advanceTaxInstallments[3].cumulative = totalTax;

  return {
    grossTotalIncome,
    standardDeduction,
    totalIncome,
    taxBeforeRebate,
    rebateU87A,
    taxAfterRebate,
    surcharge,
    taxAfterSurcharge,
    cess,
    totalTax,
    advanceTaxInstallments,
  };
}
