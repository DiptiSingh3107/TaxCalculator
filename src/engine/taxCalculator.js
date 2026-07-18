import { 
  oldRegimeSlabsBelow60, oldRegimeSlabsSenior, oldRegimeSlabsSuperSenior, 
  newRegimeSlabs, computeSlabTax 
} from './slabRates.js';
import { 
  STANDARD_DEDUCTION, calculateHRAExemption, calculate80C, 
  calculate80CCD1B, calculate80CCD2Old, calculate80CCD2New, 
  calculate80D, calculate24b, calculate80TTA, calculate80TTB 
} from './deductions.js';
import { 
  applySection87ARebateNewRegime, applySection87ARebateOldRegime, computeSurcharge 
} from './marginalRelief.js';

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
  
  const incomeType = inputs.incomeType || 'salary';
  
  // -- COMPUTE BASE INCOME --
  let grossIncome = 0;
  let standardDeductionAmount = 0;
  let businessOrProfessionIncome = 0;
  let applicableProfessionalTax = 0;

  if (incomeType === 'salary') {
    grossIncome = inputs.grossSalary || 0;
    standardDeductionAmount = STANDARD_DEDUCTION;
    applicableProfessionalTax = professionalTax;
  } else if (incomeType === 'freelance') {
    const receipts = inputs.freelanceGrossReceipts || 0;
    const presumptive = inputs.freelancePresumptive !== false; // Default true
    if (presumptive) {
      businessOrProfessionIncome = receipts * 0.50;
    } else {
      const expenses = inputs.freelanceExpenses || 0;
      businessOrProfessionIncome = receipts - expenses;
    }
    grossIncome = businessOrProfessionIncome;
  } else if (incomeType === 'business') {
    const digital = inputs.businessTurnoverDigital || 0;
    const cash = inputs.businessTurnoverCash || 0;
    const presumptive = inputs.businessPresumptive !== false; // Default true
    if (presumptive) {
      businessOrProfessionIncome = (digital * 0.06) + (cash * 0.08);
    } else {
      const expenses = inputs.businessExpenses || 0;
      businessOrProfessionIncome = (digital + cash) - expenses;
    }
    grossIncome = businessOrProfessionIncome;
  }

  // Common computations
  const salaryIncome = incomeType === 'salary' 
    ? Math.max(0, grossIncome - standardDeductionAmount - applicableProfessionalTax)
    : 0;
    
  const grossTotalIncomeBase = salaryIncome + businessOrProfessionIncome + (incomeType === 'salary' ? bonus : 0) + savingsInterest + fdInterest;
  
  // -- OLD REGIME COMPUTATION --
  const hraExemption = incomeType === 'salary' ? calculateHRAExemption(basicSalary, actualHRAReceived, actualRentPaid, isMetro) : 0;
  const incomeFromSalariesOld = salaryIncome + (incomeType === 'salary' ? bonus : 0) - hraExemption;
  const grossTotalIncomeOld = incomeFromSalariesOld + businessOrProfessionIncome + savingsInterest + fdInterest;
  
  const sec80C = calculate80C(total80C);
  const sec80CCD1B = calculate80CCD1B(employeeNPS);
  const sec80CCD2Old = incomeType === 'salary' ? calculate80CCD2Old(employerNPS, basicSalary) : 0;
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

  const { rate: surchargeRateOld, surcharge: surchargeOld, marginalRelief: surchargeMarginalReliefOld, taxAfterSurcharge: taxAfterSurchargeOld } =
    computeSurcharge(taxableIncomeOld, taxAfterRebateOld, 'old', (incomeAtThreshold) => {
      const { tax } = computeSlabTax(incomeAtThreshold, oldSlabs);
      return applySection87ARebateOldRegime(incomeAtThreshold, tax).taxAfterRebate;
    });

  const cessOld = taxAfterSurchargeOld * 0.04;
  const totalTaxOld = taxAfterSurchargeOld + cessOld;
  
  // -- NEW REGIME COMPUTATION --
  // New regime doesn't allow HRA, 80C, 80D, 24b, 80TTA/TTB, or employee NPS 80CCD1B
  const sec80CCD2New = incomeType === 'salary' ? calculate80CCD2New(employerNPS, basicSalary) : 0;
  
  let taxableIncomeNew = Math.max(0, grossTotalIncomeBase - sec80CCD2New);
  taxableIncomeNew = Math.round(taxableIncomeNew / 10) * 10;
  
  const { tax: taxBeforeRebateNew, breakdown: breakdownNew } = computeSlabTax(taxableIncomeNew, newRegimeSlabs);
  const { rebate: rebateNew, taxAfterRebate: taxAfterRebateNew, marginalRelief } = applySection87ARebateNewRegime(taxableIncomeNew, taxBeforeRebateNew);

  const { rate: surchargeRateNew, surcharge: surchargeNew, marginalRelief: surchargeMarginalReliefNew, taxAfterSurcharge: taxAfterSurchargeNew } =
    computeSurcharge(taxableIncomeNew, taxAfterRebateNew, 'new', (incomeAtThreshold) => {
      const { tax } = computeSlabTax(incomeAtThreshold, newRegimeSlabs);
      return applySection87ARebateNewRegime(incomeAtThreshold, tax).taxAfterRebate;
    });

  const cessNew = taxAfterSurchargeNew * 0.04;
  const totalTaxNew = taxAfterSurchargeNew + cessNew;
  
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
  
  const totalIncomeBeforeDeductions = grossIncome + (incomeType === 'salary' ? bonus : 0) + savingsInterest + fdInterest;

  return {
    incomeType,
    oldRegime: {
      grossIncome,
      totalIncomeBeforeDeductions,
      businessOrProfessionIncome,
      grossTotalIncome: grossTotalIncomeOld,
      deductions: {
        standardDeduction: standardDeductionAmount,
        professionalTax: applicableProfessionalTax,
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
      surchargeRate: surchargeRateOld,
      surcharge: surchargeOld,
      surchargeMarginalRelief: surchargeMarginalReliefOld,
      taxAfterSurcharge: taxAfterSurchargeOld,
      cess: cessOld,
      totalTax: totalTaxOld
    },
    newRegime: {
      grossIncome,
      totalIncomeBeforeDeductions,
      businessOrProfessionIncome,
      grossTotalIncome: grossTotalIncomeBase,
      deductions: {
        standardDeduction: standardDeductionAmount,
        professionalTax: applicableProfessionalTax,
        npsEmployer_80CCD2: sec80CCD2New,
        total: standardDeductionAmount + applicableProfessionalTax + sec80CCD2New
      },
      taxableIncome: taxableIncomeNew,
      slabBreakdown: breakdownNew,
      taxBeforeRebate: taxBeforeRebateNew,
      rebate87A: rebateNew,
      marginalRelief: marginalRelief,
      taxAfterRebate: taxAfterRebateNew,
      surchargeRate: surchargeRateNew,
      surcharge: surchargeNew,
      surchargeMarginalRelief: surchargeMarginalReliefNew,
      taxAfterSurcharge: taxAfterSurchargeNew,
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
