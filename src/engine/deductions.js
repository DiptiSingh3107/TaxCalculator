// Deduction computation functions

export const STANDARD_DEDUCTION_OLD = 50000;
export const STANDARD_DEDUCTION_NEW = 75000;
export function calculateHRAExemption(basicSalary, actualHRAReceived, actualRentPaid, isMetro) {
  const rentMinus10PercentBasic = Math.max(0, actualRentPaid - (0.10 * basicSalary));
  const basicMultiplier = isMetro ? 0.50 : 0.40;
  const percentageOfBasic = basicMultiplier * basicSalary;
  
  return Math.min(actualHRAReceived, rentMinus10PercentBasic, percentageOfBasic);
}

export function calculate80C(totalInvestments) {
  return Math.min(totalInvestments, 150000);
}

export function calculate80CCD1B(employeeNPS) {
  return Math.min(employeeNPS, 50000);
}

export function calculate80CCD2Old(employerNPS, basicSalary) {
  return Math.min(employerNPS, 0.10 * basicSalary);
}

export function calculate80CCD2New(employerNPS, basicSalary) {
  return Math.min(employerNPS, 0.14 * basicSalary);
}

export function calculate80D(selfPremium, parentsPremium, isUserSenior, isParentsSenior) {
  const selfLimit = isUserSenior ? 50000 : 25000;
  const parentsLimit = isParentsSenior ? 50000 : 25000;
  
  const dSelf = Math.min(selfPremium, selfLimit);
  const dParents = Math.min(parentsPremium, parentsLimit);
  
  return dSelf + dParents;
}

export function calculate24b(homeLoanInterest) {
  return Math.min(homeLoanInterest, 200000);
}

export function calculate80TTA(savingsInterest) {
  return Math.min(savingsInterest, 10000);
}

export function calculate80TTB(savingsAndFdInterest) {
  return Math.min(savingsAndFdInterest, 50000);
}
