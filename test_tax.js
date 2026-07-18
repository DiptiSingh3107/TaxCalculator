import { calculateTaxes } from './src/engine/taxCalculator.js';

const scenarios = [
  {
    name: '1. Standard Salaried Employee (No investments)',
    inputs: {
      incomeType: 'salary',
      grossSalary: 1200000,
      professionalTax: 2400,
    }
  },
  {
    name: '2. Salaried with High Deductions (Old Regime wins)',
    inputs: {
      incomeType: 'salary',
      grossSalary: 1500000,
      professionalTax: 2400,
      total80C: 150000,
      employeeNPS: 50000,
      healthPremiumSelf: 25000,
      homeLoanInterest: 200000,
      actualRentPaid: 240000,
      actualHRAReceived: 200000,
      isMetro: true,
      basicSalary: 750000,
    }
  },
  {
    name: '3. Freelancer with Presumptive Taxation (44ADA)',
    inputs: {
      incomeType: 'freelance',
      freelanceGrossReceipts: 2000000,
      freelancePresumptive: true,
    }
  },
  {
    name: '4. Freelancer without Presumptive Taxation (Actual Expenses)',
    inputs: {
      incomeType: 'freelance',
      freelanceGrossReceipts: 2000000,
      freelancePresumptive: false,
      freelanceExpenses: 1200000, // 8L profit
    }
  },
  {
    name: '5. Business Owner with Presumptive Taxation (44AD)',
    inputs: {
      incomeType: 'business',
      businessTurnoverDigital: 5000000, // 50L digital @ 6% = 3L
      businessTurnoverCash: 1000000,   // 10L cash @ 8% = 80k -> Total 3.8L
      businessPresumptive: true,
    }
  },
  {
    name: '6. Marginal Relief Edge Case (New Regime)',
    inputs: {
      incomeType: 'salary',
      grossSalary: 1276000, // Just above 12L after 75k std ded -> 12.01L taxable
    }
  },
  {
    name: '7. Senior Citizen Salaried',
    inputs: {
      incomeType: 'salary',
      ageGroup: 'senior',
      grossSalary: 800000,
      savingsInterest: 40000, // 80TTB applies
    }
  }
];

scenarios.forEach((scenario) => {
  console.log(`\n=========================================`);
  console.log(`TEST: ${scenario.name}`);
  console.log(`=========================================`);
  
  const result = calculateTaxes(scenario.inputs);
  
  console.log(`Income Type: ${result.incomeType}`);
  console.log(`Old Regime Taxable Income: ${result.oldRegime.taxableIncome}`);
  console.log(`New Regime Taxable Income: ${result.newRegime.taxableIncome}`);
  console.log(`Old Regime Total Tax: ${result.oldRegime.totalTax}`);
  console.log(`New Regime Total Tax: ${result.newRegime.totalTax}`);
  
  if (result.newRegime.marginalRelief > 0) {
    console.log(`** Marginal Relief Applied (New Regime): ${result.newRegime.marginalRelief} **`);
  }
  
  console.log(`Recommendation: Go with ${result.recommendation.betterRegime.toUpperCase()} regime (Saves ${result.recommendation.savingsAmount})`);
});
