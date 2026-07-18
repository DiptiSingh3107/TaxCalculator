import { test, expect } from '@playwright/test';

// Seeded PRNG to ensure deterministic tests across Playwright workers
let seed = 12345;
const random = function() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

function generateRandomData(type) {
  const income = Math.floor(random() * 50000000);
  return {
    type,
    income,
    textInput: income.toString(),
    presumptive: random() > 0.5,
    expenses: Math.floor(random() * 2000000),
    pf: random() > 0.5 ? Math.floor(random() * 500000) : 0,
    rent: random() > 0.5 ? Math.floor(random() * 1000000) : 0,
    hra: random() > 0.5 ? Math.floor(random() * 1000000) : 0,
    basic: random() > 0.5 ? Math.floor(random() * 2000000) : 0,
    pt: random() > 0.5 ? Math.floor(random() * 2500) : 0,
    bonus: random() > 0.5 ? Math.floor(random() * 1000000) : 0,
    deductions_80c: random() > 0.5 ? Math.floor(random() * 200000) : 0,
    deductions_80d: random() > 0.5 ? Math.floor(random() * 100000) : 0,
    deductions_nps: random() > 0.5 ? Math.floor(random() * 100000) : 0,
    hl_interest: random() > 0.5 ? Math.floor(random() * 300000) : 0,
    hl_principal: random() > 0.5 ? Math.floor(random() * 200000) : 0,
    savings_interest: random() > 0.5 ? Math.floor(random() * 100000) : 0,
    fd_interest: random() > 0.5 ? Math.floor(random() * 100000) : 0,
  };
}

function generateFuzzScenarios() {
  const scenarios = [];
  const types = ['salary', 'freelance', 'business'];
  const ageGroups = ['general', 'senior', 'super'];
  
  for (const type of types) {
    for (let i = 0; i < 50; i++) {
      const ageGroup = ageGroups[Math.floor(random() * ageGroups.length)];
      scenarios.push({
        id: `${type.toUpperCase()}_${i+1}`,
        age: ageGroup,
        ...generateRandomData(type)
      });
    }
  }
  return scenarios;
}

const scenarios = generateFuzzScenarios();

scenarios.forEach((s) => {
  test(`Fuzz Scenario ${s.id} - ${s.type} - ${s.age}`, async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Listen for uncaught exceptions
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('https://tax-calculator-six-tau.vercel.app/');

    // Wait for and click the start button on the landing page
    await page.getByRole('button', { name: /Find out/i }).click();

    // Helper to safely click Next
    const goNext = async () => {
      await page.getByRole('button', { name: /Next|Finish Wizard/i }).click();
    };

    // Helper to fill input if present
    const fillInputByPlaceholder = async (placeholder, value) => {
      if (value !== 0 && value !== '0' && value !== '') {
         const loc = page.getByPlaceholder(placeholder).first();
         if (await loc.isVisible().catch(() => false)) {
            await loc.fill(value.toString());
         }
      }
    };

    // Step 1: Age
    if (s.age === 'general') {
       await page.getByLabel(/Under 60/i).click();
    } else if (s.age === 'senior') {
       await page.getByLabel(/60 to 79/i).click();
    } else {
       await page.getByLabel(/80 or above/i).click();
    }
    await goNext();

    // Step 2: Income Type
    if (s.type === 'salary') {
       await page.getByRole('button', { name: /Salaried Employee/i }).click();
    } else if (s.type === 'freelance') {
       await page.getByRole('button', { name: /Freelancer/i }).click();
    } else {
       await page.getByRole('button', { name: /Business Owner/i }).click();
    }
    await goNext();

    // Navigate Wizard Dynamically
    let isFinished = false;
    let stepCount = 0;
    while (!isFinished && stepCount < 20) {
      stepCount++;
      
      const finishBtn = page.getByRole('button', { name: /Finish Wizard/i });
      if (await finishBtn.isVisible()) {
         isFinished = true;
      }

      // Salary Step
      if (await page.getByText('How much money lands in your bank account every month?').isVisible().catch(()=>false)) {
         await fillInputByPlaceholder('e.g. 65,000', s.textInput);
      }
      
      // Bonus Step
      if (await page.getByText('Do you get any bonus or variable pay?').isVisible().catch(()=>false)) {
         if (s.bonus > 0) {
           await page.getByRole('button', { name: 'Yes' }).first().click();
           const inputs = await page.getByRole('textbox').all();
           if (inputs.length >= 1) await inputs[0].fill(s.bonus.toString());
         } else {
           await page.getByRole('button', { name: /^No(\s*\/.*)?$/i }).first().click();
         }
      }
      
      // PT Step
      if (await page.getByText('Does your employer deduct Professional Tax?').isVisible().catch(()=>false)) {
         if (s.pt > 0) {
           await page.getByRole('button', { name: 'Yes' }).first().click();
           const inputs = await page.getByRole('textbox').all();
           if (inputs.length >= 1) await inputs[0].fill(s.pt.toString());
         } else {
           await page.getByRole('button', { name: /^No(\s*\/.*)?$/i }).first().click();
         }
      }
      
      // Freelance Step
      if (await page.getByText('What are your gross receipts?').isVisible().catch(()=>false)) {
         await fillInputByPlaceholder('e.g. 1500000', s.textInput);
         if (!s.presumptive) {
            await page.getByRole('checkbox').uncheck();
            await fillInputByPlaceholder('e.g. 250000', s.expenses.toString());
         }
      }
      
      // Business Step
      if (await page.getByText('What is your annual turnover?').isVisible().catch(()=>false)) {
         const inputs = await page.getByRole('spinbutton').all();
         if (inputs.length >= 2) {
            await inputs[0].fill(s.textInput);
            await inputs[1].fill(s.textInput);
         }
         if (!s.presumptive) {
            await page.getByRole('checkbox').uncheck();
            await fillInputByPlaceholder('e.g. 1800000', s.expenses.toString());
         }
      }

      // PF Step
      if (await page.getByText('Does your company deduct PF (Provident Fund)?').isVisible().catch(()=>false)) {
         if (s.pf > 0) {
           await page.getByRole('button', { name: 'Yes' }).first().click();
           const inputs = await page.getByRole('textbox').all();
           if (inputs.length >= 1) await inputs[0].fill(s.pf.toString());
         } else {
           await page.getByRole('button', { name: /^No(\s*\/.*)?$/i }).first().click();
         }
      }
      
      // Rent Step
      if (await page.getByText('Do you pay rent for where you live?').isVisible().catch(()=>false)) {
         if (s.rent > 0) {
           await page.getByRole('button', { name: 'Yes' }).first().click();
           const inputs = await page.getByRole('textbox').all();
           if (inputs.length >= 1) {
              await inputs[0].fill(s.rent.toString());
           }
           
           if (Math.random() > 0.5) {
             await page.getByRole('button', { name: /^Metro/ }).first().click();
           } else {
             await page.getByRole('button', { name: /^Non-Metro/ }).first().click();
           }
           
           if (s.hra > 0) {
             await page.getByRole('button', { name: /^Yes$/, exact: true }).nth(1).click();
             const updatedInputs = await page.getByRole('textbox').all();
             if (updatedInputs.length >= 2) {
                await updatedInputs[1].fill(s.hra.toString());
             }
           } else {
             await page.getByRole('button', { name: /^No$/, exact: true }).nth(1).click();
           }
         } else {
           await page.getByRole('button', { name: /^No(\s*\/.*)?$/i }).first().click();
         }
      }
      
      // Investments (80C)
      if (await page.getByText('Do you invest in tax-saving options (Section 80C)?').isVisible().catch(()=>false)) {
         if (s.deductions_80c > 0) {
           await page.getByRole('button', { name: 'Yes' }).first().click();
           const inputs = await page.getByRole('textbox').all();
           if (inputs.length >= 4) {
             const quarter = Math.floor(s.deductions_80c / 4);
             await inputs[0].fill(quarter.toString());
             await inputs[1].fill(quarter.toString());
             await inputs[2].fill(quarter.toString());
             await inputs[3].fill(quarter.toString());
           }
         } else {
           const noBtn = page.getByRole('button', { name: /^No(\s*\/.*)?$/i }).first();
           if (await noBtn.isVisible()) {
              await noBtn.click();
           }
         }
      }

      // NPS
      if (await page.getByText('Do you contribute to NPS?').isVisible().catch(()=>false)) {
         if (s.deductions_nps > 0) {
           await page.getByRole('button', { name: 'Yes' }).first().click();
           const inputs = await page.getByRole('textbox').all();
           if (inputs.length >= 2) {
             const half = Math.floor(s.deductions_nps / 2);
             await inputs[0].fill(half.toString());
             await inputs[1].fill(half.toString());
           }
         } else {
           await page.getByRole('button', { name: /^No(\s*\/.*)?$/i }).first().click();
         }
      }

      // Health
      if (await page.getByText('Do you pay for health insurance?').isVisible().catch(()=>false)) {
         if (s.deductions_80d > 0) {
           await page.getByRole('button', { name: 'Yes' }).first().click();
           const inputs = await page.getByRole('textbox').all();
           if (inputs.length >= 1) {
             const half = Math.floor(s.deductions_80d / 2);
             await inputs[0].fill(half.toString());
             
             await page.getByRole('button', { name: /^Yes$/ }).nth(1).click();
             
             if (Math.random() > 0.5) {
                await page.getByRole('button', { name: /Yes \(60\+\)/ }).click();
             } else {
                await page.getByRole('button', { name: /No \(Under 60\)/ }).click();
             }
             
             const updatedInputs = await page.getByRole('textbox').all();
             if (updatedInputs.length >= 2) {
                await updatedInputs[1].fill(half.toString());
             }
           }
         } else {
           await page.getByRole('button', { name: /^No(\s*\/.*)?$/i }).first().click();
         }
      }
      
      // Home Loan
      if (await page.getByText('Do you have a home loan for a self-occupied property?').isVisible().catch(()=>false)) {
         if (s.hl_interest > 0) {
           await page.getByRole('button', { name: 'Yes' }).first().click();
           const inputs = await page.getByRole('textbox').all();
           if (inputs.length >= 1) {
              await inputs[0].fill(s.hl_interest.toString());
           }
         } else {
           await page.getByRole('button', { name: /^No(\s*\/.*)?$/i }).first().click();
         }
      }
      
      // Interest
      if (await page.getByText('Do you earn interest from savings or FDs?').isVisible().catch(()=>false)) {
         if (s.savings_interest > 0 || s.fd_interest > 0) {
           await page.getByRole('button', { name: 'Yes' }).first().click();
           const inputs = await page.getByRole('textbox').all();
           if (inputs.length >= 2) {
              await inputs[0].fill(s.savings_interest.toString());
              await inputs[1].fill(s.fd_interest.toString());
           }
         } else {
           await page.getByRole('button', { name: /^No(\s*\/.*)?$/i }).first().click();
         }
      }

      if (isFinished) {
         await finishBtn.click();
      } else {
         await goNext();
      }
      // Small wait for transition
      await page.waitForTimeout(50);
    }
    
    // Result Page assertions
    // Ignore vite / react hot reload errors if any exist, but we shouldn't have any in standard execution
    const filteredErrors = errors.filter(e => !e.includes('favicon'));
    expect(filteredErrors).toEqual([]);

    await page.waitForSelector('text=Your Tax Verdict');

    const pageText = await page.textContent('body');
    expect(pageText).not.toContain('NaN');
    expect(pageText).not.toContain('Infinity');
    expect(pageText).not.toContain('undefined');

    const totalTaxRow = await page.getByText('Total Tax Payable', { exact: true }).locator('xpath=..').innerText();
    expect(totalTaxRow).not.toContain('-₹');
  });
});
