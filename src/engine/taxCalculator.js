import { 
  oldRegimeSlabsBelow60, oldRegimeSlabsSenior, oldRegimeSlabsSuperSenior, 
  newRegimeSlabs, computeSlabTax 
} from './slabRates';
import { 
  STANDARD_DEDUCTION, calculateHRAExemption, calculate80C, 
  calculate80CCD1B, calculate80CCD2Old, calculate80CCD2New, 
  calculate80D, calculate24b, calculate80TTA, calculate80TTB 
} from './deductions';
import { 
  applySection87ARebateNewRegime, applySection87ARebateOldRegime 
} from './marginalRelief';

export function calculateTaxes(inputs) {
  // Extract and normalize inputs
  const grossSalary = inputs.grossSalary || 0;
  const ageGroup = inputs.ageGroup || 'below60'; // 'below60', 'senior', 'superSenior'
  const isSenior = ageGroup === 'senior' || ageGroup === 'superSenior';
  const isSuperSenior = ageGroup === 'superSenior';
  
  const professionalTax = inputs.professionalTax || 0;
  const bonus = inputs.bonus || 0;
  const savingsInterest = inputs.savingsInterest || 0;
  const fdInterest = inputs.fdInterest || 0;
  
  // Deductions inputs
  const basicSalary = inputs.basicSalary || (grossSalary * 0.40); // Estimate if not provided
  const actualHRAReceived = inputs.actualHRAReceived || 0;
  const actualRentPaid = inputs.actualRentPaid || 0;
  const isMetro = inputs.isMetro || false;
  
  const total80C = inputs.total80C || 0;
  const employeeNPS = inputs.employeeNPS || 0;
  const employerNPS = inputs.employerNPS || 0;
  
  const healthPremiumSelf = inputs.healthPremiumSelf || 0;
  const healthPremiumParents = inputs.healthPremiumParents || 0;
  const isParentsSenior = inputs.isParentsSenior || false;
  
  const homeLoanInterest = inputs.homeLoanInterest || 0;
  
  // -- COMMON COMPUTATIONS --
  const salaryIncome = grossSalary - STANDARD_DEDUCTION - professionalTax;
  const grossTotalIncomeBase = salaryIncome + bonus + savingsInterest + fdInterest;
  
  // -- OLD REGIME COMPUTATION --
  const hraExemption = calculateHRAExemption(basicSalary, actualHRAReceived, actualRentPaid, isMetro);
  const incomeFromSalariesOld = salaryIncome + bonus - hraExemption;
  const grossTotalIncomeOld = incomeFromSalariesOld + savingsInterest + fdInterest;
  
  const sec80C = calculate80C(total80C);
  const sec80CCD1B = calculate80CCD1B(employeeNPS);
  const sec80CCD2Old = calculate80CCD2Old(employerNPS, basicSalary);
  const sec80D = calculate80D(healthPremiumSelf, healthPremiumParents, isSenior, isParentsSenior);
  const sec24b = calculate24b(homeLoanInterest);
  const interestDeductionOld = isSenior 
    ? calculate80TTB(savingsInterest + fdInterest) 
    : calculate80TTA(savingsInterest);
    
  const totalDeductionsOld = sec80C + sec80CCD1B + sec80CCD2Old + sec80D + sec24b + interestDeductionOld;
  let taxableIncomeOld = Math.max(0, grossTotalIncomeOld - totalDeductionsOld);
  
  // Round to nearest 10 for taxation as per IT rules
  taxableIncomeOld = Math.round(taxableIncomeOld / 10) * 10;
  
  let oldSlabs = oldRegimeSlabsBelow60;
  if (isSuperSenior) oldSlabs = oldRegimeSlabsSuperSenior;
  else if (isSenior) oldSlabs = oldRegimeSlabsSenior;
  
  const { tax: taxBeforeRebateOld, breakdown: breakdownOld } = computeSlabTax(taxableIncomeOld, oldSlabs);
  const { rebate: rebateOld, taxAfterRebate: taxAfterRebateOld } = applySection87ARebateOldRegime(taxableIncomeOld, taxBeforeRebateOld);
  
  const cessOld = taxAfterRebateOld * 0.04;
  const totalTaxOld = taxAfterRebateOld + cessOld;
  
  // -- NEW REGIME COMPUTATION --
  // New regime doesn't allow HRA, 80C, 80D, 24b, 80TTA/TTB, or employee NPS 80CCD1B
  const sec80CCD2New = calculate80CCD2New(employerNPS, basicSalary);
  
  let taxableIncomeNew = Math.max(0, grossTotalIncomeBase - sec80CCD2New);
  taxableIncomeNew = Math.round(taxableIncomeNew / 10) * 10;
  
  const { tax: taxBeforeRebateNew, breakdown: breakdownNew } = computeSlabTax(taxableIncomeNew, newRegimeSlabs);
  const { rebate: rebateNew, taxAfterRebate: taxAfterRebateNew, marginalRelief } = applySection87ARebateNewRegime(taxableIncomeNew, taxBeforeRebateNew);
  
  const cessNew = taxAfterRebateNew * 0.04;
  const totalTaxNew = taxAfterRebateNew + cessNew;
  
  // -- RECOMMENDATION --
  let betterRegime = 'equal';
  let savingsAmount = 0;
  if (totalTaxOld < totalTaxNew && (totalTaxNew - totalTaxOld > 500)) {
    betterRegime = 'old';
    savingsAmount = totalTaxNew - totalTaxOld;
  } else if (totalTaxNew < totalTaxOld && (totalTaxOld - totalTaxNew > 500)) {
    betterRegime = 'new';
    savingsAmount = totalTaxOld - totalTaxNew;
  } else if (totalTaxNew < totalTaxOld) {
    betterRegime = 'new';
    savingsAmount = totalTaxOld - totalTaxNew;
  } else if (totalTaxOld < totalTaxNew) {
    // If difference is <= 500 but old is slightly better, we might still recommend New for simplicity, but strictly speaking old is mathematically lower.
    // The PRD says: "If they're equal (within ₹500): ... We recommend the New Regime for simplicity."
    betterRegime = 'new';
    savingsAmount = 0;
  }
  
  return {
    oldRegime: {
      grossSalary,
      grossTotalIncome: grossTotalIncomeOld,
      deductions: {
        standardDeduction: STANDARD_DEDUCTION,
        professionalTax,
        hraExemption,
        section80C: sec80C,
        npsEmployee_80CCD1B: sec80CCD1B,
        npsEmployer_80CCD2: sec80CCD2Old,
        section80D: sec80D,
        section24b: sec24b,
        interestDeduction: interestDeductionOld,
        total: totalDeductionsOld
      },
      taxableIncome: taxableIncomeOld,
      slabBreakdown: breakdownOld,
      taxBeforeRebate: taxBeforeRebateOld,
      rebate87A: rebateOld,
      taxAfterRebate: taxAfterRebateOld,
      cess: cessOld,
      totalTax: totalTaxOld
    },
    newRegime: {
      grossSalary,
      grossTotalIncome: grossTotalIncomeBase,
      deductions: {
        standardDeduction: STANDARD_DEDUCTION,
        professionalTax,
        npsEmployer_80CCD2: sec80CCD2New,
        total: STANDARD_DEDUCTION + professionalTax + sec80CCD2New
      },
      taxableIncome: taxableIncomeNew,
      slabBreakdown: breakdownNew,
      taxBeforeRebate: taxBeforeRebateNew,
      rebate87A: rebateNew,
      marginalRelief: marginalRelief,
      taxAfterRebate: taxAfterRebateNew,
      cess: cessNew,
      totalTax: totalTaxNew
    },
    recommendation: {
      betterRegime,
      savingsAmount,
      savingsPercent: savingsAmount > 0 ? (savingsAmount / Math.max(totalTaxOld, totalTaxNew)) * 100 : 0
    }
  };
}
