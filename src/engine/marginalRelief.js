export function applySection87ARebateNewRegime(taxableIncome, taxBeforeRebate) {
  const REBATE_LIMIT = 1200000;
  const MAX_REBATE = 60000;
  
  if (taxableIncome <= REBATE_LIMIT) {
    // Full rebate
    return {
      rebate: Math.min(taxBeforeRebate, MAX_REBATE),
      taxAfterRebate: Math.max(0, taxBeforeRebate - Math.min(taxBeforeRebate, MAX_REBATE)),
      marginalRelief: 0
    };
  }
  
  const incomeAboveLimit = taxableIncome - REBATE_LIMIT;
  const taxAfterFullRebateIfAtLimit = 0; // tax at exactly ₹12L = 0 after rebate
  const maxTaxPayable = taxAfterFullRebateIfAtLimit + incomeAboveLimit;
  
  if (taxBeforeRebate > maxTaxPayable) {
    // Apply marginal relief — cap tax at income above ₹12L
    const marginalReliefAmount = taxBeforeRebate - maxTaxPayable;
    return {
      rebate: 0,
      taxAfterRebate: maxTaxPayable,
      marginalRelief: marginalReliefAmount
    };
  }
  
  return {
    rebate: 0,
    taxAfterRebate: taxBeforeRebate,
    marginalRelief: 0
  };
}

export function applySection87ARebateOldRegime(taxableIncome, taxBeforeRebate) {
  const REBATE_LIMIT = 500000;
  const MAX_REBATE = 12500;
  
  if (taxableIncome <= REBATE_LIMIT) {
    return {
      rebate: Math.min(taxBeforeRebate, MAX_REBATE),
      taxAfterRebate: Math.max(0, taxBeforeRebate - Math.min(taxBeforeRebate, MAX_REBATE))
    };
  }
  
  return {
    rebate: 0,
    taxAfterRebate: taxBeforeRebate
  };
}
