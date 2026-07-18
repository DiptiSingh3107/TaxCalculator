/**
 * FUZZ TEST — TaxCalculator (real repo: DiptiSingh3107/TaxCalculator)
 * ---------------------------------------------------------------------
 * Imports YOUR actual calculateTaxes() function and hammers it with
 * hundreds of random, realistic scenarios (salary / freelance / business,
 * all age groups, random deductions). No manual input needed.
 *
 * Instead of checking against "known correct answers" (which you'd have
 * to compute by hand for every scenario), this checks INVARIANTS —
 * rules your own code promises to always follow. Any violation is a
 * real bug in the engine.
 *
 * RUN:  node fuzz_test.js
 * (repo already uses "type": "module", so ESM imports work directly)
 */

import { calculateTaxes } from './src/engine/taxCalculator.js';

// --------------------------------------------------------
// RANDOM SCENARIO GENERATOR
// --------------------------------------------------------
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randBool(pTrue = 0.5) {
  return Math.random() < pTrue;
}
function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function generateScenario() {
  const incomeType = pick(['salary', 'salary', 'salary', 'freelance', 'business']); // salary weighted more
  const ageGroup = pick(['below60', 'below60', 'below60', 'senior', 'superSenior']);

  const base = {
    incomeType,
    ageGroup,
    professionalTax: randInt(0, 2500),
    bonus: randInt(0, 300000),
    savingsInterest: randInt(0, 60000),
    fdInterest: randInt(0, 100000),
  };

  if (incomeType === 'salary') {
    // Weighted to cover normal incomes AND surcharge brackets (>50L, >1Cr, >2Cr, >5Cr)
    const grossSalary = randBool(0.4)
      ? randInt(200000, 4900000)               // below surcharge threshold
      : randInt(5000000, 80000000);             // spans all surcharge brackets
    const basicSalary = Math.round(grossSalary * (randInt(35, 50) / 100));
    return {
      ...base,
      grossSalary,
      basicSalary,
      actualHRAReceived: randInt(0, Math.round(basicSalary * 0.6)),
      actualRentPaid: randInt(0, 600000),
      isMetro: randBool(),
      total80C: randInt(0, 200000),        // intentionally sometimes ABOVE the 1.5L cap
      employeeNPS: randInt(0, 80000),       // intentionally sometimes ABOVE the 50k cap
      employerNPS: randInt(0, Math.round(basicSalary * 0.2)),
      healthPremiumSelf: randInt(0, 60000),
      healthPremiumParents: randInt(0, 60000),
      isParentsSenior: randBool(0.3),
      homeLoanInterest: randInt(0, 300000), // intentionally sometimes ABOVE the 2L cap
    };
  }

  if (incomeType === 'freelance') {
    const freelancePresumptive = randBool(0.7);
    return {
      ...base,
      freelanceGrossReceipts: randInt(100000, 5000000),
      freelancePresumptive,
      freelanceExpenses: freelancePresumptive ? 0 : randInt(0, 2000000),
    };
  }

  // business
  const businessPresumptive = randBool(0.7);
  return {
    ...base,
    businessTurnoverDigital: randInt(0, 8000000),
    businessTurnoverCash: randInt(0, 3000000),
    businessPresumptive,
    businessExpenses: businessPresumptive ? 0 : randInt(0, 4000000),
  };
}

// --------------------------------------------------------
// INVARIANT CHECKS (derived from your actual code's own rules)
// --------------------------------------------------------
function checkInvariants(inputs, result) {
  const errors = [];
  const { oldRegime, newRegime, recommendation } = result;

  // 1. Tax can never be negative
  if (oldRegime.totalTax < 0) errors.push(`Old regime totalTax negative: ${oldRegime.totalTax}`);
  if (newRegime.totalTax < 0) errors.push(`New regime totalTax negative: ${newRegime.totalTax}`);

  // 2. Taxable income should be rounded to nearest 10 (per code's own rule)
  if (oldRegime.taxableIncome % 10 !== 0) errors.push(`Old taxableIncome not rounded to 10: ${oldRegime.taxableIncome}`);
  if (newRegime.taxableIncome % 10 !== 0) errors.push(`New taxableIncome not rounded to 10: ${newRegime.taxableIncome}`);

  // 3. Old regime rebate: taxableIncome <= 5L => totalTax must be 0
  if (oldRegime.taxableIncome <= 500000 && oldRegime.totalTax !== 0) {
    errors.push(`Old regime: taxableIncome ${oldRegime.taxableIncome} <= 5L but totalTax = ${oldRegime.totalTax} (should be 0)`);
  }

  // 4. New regime rebate: taxableIncome <= 12L => totalTax must be 0
  if (newRegime.taxableIncome <= 1200000 && newRegime.totalTax !== 0) {
    errors.push(`New regime: taxableIncome ${newRegime.taxableIncome} <= 12L but totalTax = ${newRegime.totalTax} (should be 0)`);
  }

  // 5. Cess must be exactly 4% of taxAfterSurcharge (within rounding)
  const expectedOldTotal = oldRegime.taxAfterSurcharge * 1.04;
  if (Math.abs(oldRegime.totalTax - expectedOldTotal) > 1) {
    errors.push(`Old regime: totalTax (${oldRegime.totalTax}) != taxAfterSurcharge*1.04 (${expectedOldTotal})`);
  }
  const expectedNewTotal = newRegime.taxAfterSurcharge * 1.04;
  if (Math.abs(newRegime.totalTax - expectedNewTotal) > 1) {
    errors.push(`New regime: totalTax (${newRegime.totalTax}) != taxAfterSurcharge*1.04 (${expectedNewTotal})`);
  }

  // 5b. Surcharge bracket must match taxableIncome per FY 2026-27 rules
  function expectedSurchargeRate(income, regime) {
    if (income <= 5000000) return 0;
    if (income <= 10000000) return 0.10;
    if (income <= 20000000) return 0.15;
    if (regime === 'old' && income > 50000000) return 0.37;
    return 0.25;
  }
  const expOldRate = expectedSurchargeRate(oldRegime.taxableIncome, 'old');
  if (oldRegime.surchargeRate !== expOldRate) {
    errors.push(`Old regime surcharge rate wrong: got ${oldRegime.surchargeRate}, expected ${expOldRate} at income ${oldRegime.taxableIncome}`);
  }
  const expNewRate = expectedSurchargeRate(newRegime.taxableIncome, 'new');
  if (newRegime.surchargeRate !== expNewRate) {
    errors.push(`New regime surcharge rate wrong: got ${newRegime.surchargeRate}, expected ${expNewRate} at income ${newRegime.taxableIncome}`);
  }

  // 5c. Marginal relief on surcharge must never be negative, and surcharge itself never negative
  if (oldRegime.surcharge < 0) errors.push(`Old regime surcharge negative: ${oldRegime.surcharge}`);
  if (newRegime.surcharge < 0) errors.push(`New regime surcharge negative: ${newRegime.surcharge}`);
  if (oldRegime.surchargeMarginalRelief < 0) errors.push(`Old regime surcharge marginal relief negative: ${oldRegime.surchargeMarginalRelief}`);
  if (newRegime.surchargeMarginalRelief < 0) errors.push(`New regime surcharge marginal relief negative: ${newRegime.surchargeMarginalRelief}`);

  // 6. Deduction caps must be respected regardless of raw input
  if (oldRegime.deductions.section80C > 150000) errors.push(`80C exceeded cap: ${oldRegime.deductions.section80C}`);
  if (oldRegime.deductions.npsEmployee_80CCD1B > 50000) errors.push(`80CCD1B exceeded cap: ${oldRegime.deductions.npsEmployee_80CCD1B}`);
  if (oldRegime.deductions.section24b > 200000) errors.push(`24b exceeded cap: ${oldRegime.deductions.section24b}`);

  // 7. Recommendation must match the code's own decision rule (reimplemented here)
  const totalTaxOld = oldRegime.totalTax;
  const totalTaxNew = newRegime.totalTax;
  let expectedBetter = 'equal', expectedSavings = 0;
  if (totalTaxOld < totalTaxNew && (totalTaxNew - totalTaxOld > 500)) {
    expectedBetter = 'old'; expectedSavings = totalTaxNew - totalTaxOld;
  } else if (totalTaxNew < totalTaxOld && (totalTaxOld - totalTaxNew > 500)) {
    expectedBetter = 'new'; expectedSavings = totalTaxOld - totalTaxNew;
  } else if (totalTaxNew < totalTaxOld) {
    expectedBetter = 'new'; expectedSavings = totalTaxOld - totalTaxNew;
  } else if (totalTaxOld < totalTaxNew) {
    expectedBetter = 'new'; expectedSavings = 0;
  }
  if (recommendation.betterRegime !== expectedBetter) {
    errors.push(`Recommendation mismatch: got "${recommendation.betterRegime}", expected "${expectedBetter}" (oldTax=${totalTaxOld}, newTax=${totalTaxNew})`);
  }
  if (Math.abs(recommendation.savingsAmount - expectedSavings) > 1) {
    errors.push(`Savings amount mismatch: got ${recommendation.savingsAmount}, expected ${expectedSavings}`);
  }

  // 8. NaN / undefined guard — catches silent breakage from unexpected input combos
  for (const [key, val] of Object.entries({ ...oldRegime, ...newRegime })) {
    if (typeof val === 'number' && isNaN(val)) errors.push(`NaN detected in field "${key}"`);
  }

  return errors;
}

// --------------------------------------------------------
// RUN
// --------------------------------------------------------
function runFuzz(numTests = 1000) {
  let failCount = 0;
  const failures = [];

  for (let i = 0; i < numTests; i++) {
    const inputs = generateScenario();
    let result, errors;
    try {
      result = calculateTaxes(inputs);
      errors = checkInvariants(inputs, result);
    } catch (e) {
      errors = [`Threw an exception: ${e.message}`];
      result = null;
    }
    if (errors.length > 0) {
      failCount++;
      failures.push({ inputs, result, errors });
    }
  }

  console.log(`\n=== FUZZ TEST RESULTS (${numTests} random scenarios) ===`);
  console.log(`Passed: ${numTests - failCount}`);
  console.log(`Failed: ${failCount}\n`);

  if (failures.length > 0) {
    console.log(`--- Showing first ${Math.min(15, failures.length)} failures ---`);
    failures.slice(0, 15).forEach((f, idx) => {
      console.log(`\nFailure #${idx + 1}`);
      console.log('Inputs:', JSON.stringify(f.inputs));
      console.log('Errors:', f.errors);
    });
  } else {
    console.log('All invariants held across every random scenario. ✅');
  }

  return { total: numTests, passed: numTests - failCount, failed: failCount, failures };
}

runFuzz(1000);
