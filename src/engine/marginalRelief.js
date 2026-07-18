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

/**
 * Surcharge slab lookup (FY 2026-27 rules, individuals/HUF).
 * New regime surcharge is capped at 25% (no 37% slab above ₹5Cr).
 * Old regime retains the 37% slab above ₹5Cr.
 */
function getSurchargeSlab(income, regime) {
  if (income <= 5000000) return { rate: 0, threshold: 0 };
  if (income <= 10000000) return { rate: 0.10, threshold: 5000000 };
  if (income <= 20000000) return { rate: 0.15, threshold: 10000000 };
  if (regime === 'old' && income > 50000000) return { rate: 0.37, threshold: 50000000 };
  return { rate: 0.25, threshold: 20000000 };
}

/**
 * Computes surcharge on post-rebate tax, with marginal relief so that
 * crossing a surcharge threshold never increases total tax+surcharge
 * by more than the amount of income above that threshold.
 *
 * @param {number} taxableIncome
 * @param {number} taxAfterRebate - post-rebate tax (pre-surcharge, pre-cess)
 * @param {'old'|'new'} regime
 * @param {(incomeAtThreshold: number) => number} computeTaxAtIncomeFn
 *        Callback that returns post-rebate tax for a given income,
 *        using the same slabs/rebate rules as the caller. Needed to
 *        compute the tax+surcharge total exactly at the threshold.
 */
export function computeSurcharge(taxableIncome, taxAfterRebate, regime, computeTaxAtIncomeFn) {
  const { rate, threshold } = getSurchargeSlab(taxableIncome, regime);

  if (rate === 0) {
    return { rate: 0, surcharge: 0, marginalRelief: 0, taxAfterSurcharge: taxAfterRebate };
  }

  const surcharge = taxAfterRebate * rate;
  const totalWithSurcharge = taxAfterRebate + surcharge;

  const prevRate = getSurchargeSlab(threshold, regime).rate;
  const taxAtThreshold = computeTaxAtIncomeFn(threshold);
  const totalAtThreshold = taxAtThreshold * (1 + prevRate);
  const maxAllowedTotal = totalAtThreshold + (taxableIncome - threshold);

  if (totalWithSurcharge > maxAllowedTotal) {
    const marginalRelief = totalWithSurcharge - maxAllowedTotal;
    return {
      rate,
      surcharge: surcharge - marginalRelief,
      marginalRelief,
      taxAfterSurcharge: maxAllowedTotal
    };
  }

  return { rate, surcharge, marginalRelief: 0, taxAfterSurcharge: totalWithSurcharge };
}
