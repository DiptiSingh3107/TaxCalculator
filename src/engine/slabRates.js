export const oldRegimeSlabsBelow60 = [
  { lower: 0, upper: 250000, rate: 0 },
  { lower: 250000, upper: 500000, rate: 0.05 },
  { lower: 500000, upper: 1000000, rate: 0.20 },
  { lower: 1000000, upper: Infinity, rate: 0.30 },
];

export const oldRegimeSlabsSenior = [
  { lower: 0, upper: 300000, rate: 0 },
  { lower: 300000, upper: 500000, rate: 0.05 },
  { lower: 500000, upper: 1000000, rate: 0.20 },
  { lower: 1000000, upper: Infinity, rate: 0.30 },
];

export const oldRegimeSlabsSuperSenior = [
  { lower: 0, upper: 500000, rate: 0 },
  { lower: 500000, upper: 1000000, rate: 0.20 },
  { lower: 1000000, upper: Infinity, rate: 0.30 },
];

export const newRegimeSlabs = [
  { lower: 0, upper: 400000, rate: 0 },
  { lower: 400000, upper: 800000, rate: 0.05 },
  { lower: 800000, upper: 1200000, rate: 0.10 },
  { lower: 1200000, upper: 1600000, rate: 0.15 },
  { lower: 1600000, upper: 2000000, rate: 0.20 },
  { lower: 2000000, upper: 2400000, rate: 0.25 },
  { lower: 2400000, upper: Infinity, rate: 0.30 },
];

export function computeSlabTax(taxableIncome, slabs) {
  let tax = 0;
  let breakdown = [];
  
  for (let i = 0; i < slabs.length; i++) {
    const { lower, upper, rate } = slabs[i];
    if (taxableIncome <= lower) break;
    
    const amountInSlab = Math.min(taxableIncome, upper) - lower;
    const taxForSlab = amountInSlab * rate;
    
    tax += taxForSlab;
    breakdown.push({
      slab: `${lower} - ${upper === Infinity ? 'Above' : upper}`,
      rate,
      amountInSlab,
      tax: taxForSlab
    });
  }
  
  return { tax, breakdown };
}
