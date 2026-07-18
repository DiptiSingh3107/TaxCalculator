# Product Requirements Document
## Indian Salary Tax Calculator — FY 2025-26 (AY 2026-27)
### Old Regime vs New Regime Comparison

**Version:** 1.0  
**Scope:** Salaried individuals only. No surcharge on income above ₹50L, no capital gains, no freelance income, no rental income as primary source.  
**Privacy:** 100% client-side. No data leaves the browser. No backend, no cookies, no analytics on user inputs.  
**Target Users:** Salaried employees in India, especially first-time filers (21–35 age group), who know their monthly take-home salary but not their CTC or gross.

---

## 1. Product Vision

Most Indians don't know whether the old or new tax regime saves them more money. Existing calculators ask for CTC, gross salary, or technical terms that confuse new earners. This product:

1. Starts from **monthly in-hand salary** (what lands in the bank account)
2. Walks users through a **plain-language, one-question-at-a-time wizard**
3. Shows a **live preview panel** updating in real time on every answer
4. Delivers a **clear, human verdict**: which regime to pick and how much is saved
5. Teaches users **why** through a personalised explanation section

The tone is that of a smart, friendly CA friend — not a government form.

---

## 2. Technology Stack (Recommended)

- **Framework:** React 18 (single-page app, no routing needed)
- **Styling:** Tailwind CSS or CSS Modules
- **State:** React `useState` / `useReducer` (no Redux needed)
- **Math:** Pure JavaScript — no library needed
- **Storage:** None (no localStorage, no backend)
- **Build:** Vite or Create React App
- **Deployment:** Static host (Vercel, Netlify, GitHub Pages)

All tax calculations must run entirely in-browser JavaScript.

---

## 3. Application Structure

```
App
├── LandingPage          (Screen 0)
├── WizardShell          (Screens 1–N)
│   ├── ProgressBar
│   ├── StepRenderer     (renders one step at a time)
│   ├── LivePreviewPanel (right side, always visible on desktop)
│   └── StepFAQ          (bottom of each step)
└── ResultPage           (Final screen)
```

**Layout — Desktop (≥768px):**
- Left 55%: Wizard step
- Right 45%: Live preview panel (sticky, full height)
- Progress bar: top of wizard area

**Layout — Mobile (<768px):**
- Full width wizard
- Live preview collapses into an accordion "See live estimate ▾" below the question
- Progress dots instead of bar

---

## 4. Landing Page (Screen 0)

### Purpose
Build trust before the user fills in a single field. The page should feel like a product, not a utility.

### Hero Section
- **Headline (H1):** "Which tax regime actually saves you money?"
- **Subheadline:** "Answer 8 simple questions. Get a clear answer in under 2 minutes."
- **Trust badges (inline):** 🔒 Private — runs in your browser · ✓ FY 2025-26 · ✓ Budget 2025 updated
- **CTA button:** "Find out — it's free →"
- **Secondary line:** "No sign-up. No email. Everything stays on your device."

### "What you'll get" Section (3 columns)
1. **Which regime saves you more** — with exact rupee difference
2. **Slab-by-slab breakdown** — see exactly how your income is taxed
3. **Personalised tips** — based on your actual situation

### Preview / Mock Result
Show a blurred or placeholder result card so users see what they're about to receive. Use dummy numbers (e.g., "Aman · ₹14L income"). Include:
- A regime recommendation badge ("✓ New Regime saves ₹23,400")
- Mini comparison table (two columns: Old vs New, numbers blurred/placeholder)
- Caption: "Your result will look like this"

### How It Works (3 steps)
1. Tell us about your salary and deductions (plain questions)
2. We calculate tax under both regimes instantly
3. You get a clear recommendation with a full breakdown

### FAQ Teaser
3–4 quick questions like:
- "I don't know my CTC — can I still use this?" → Yes, we start from your monthly take-home
- "Is this calculator accurate?" → Yes, updated for Budget 2025 / FY 2025-26

### Footer
"Made for Indian salaried employees. Tax rules sourced from Income Tax Act, 1961 as amended by Finance Act 2025. Always verify with a CA for complex situations."

---

## 5. Wizard Steps

### Step Design Rules
- One primary question per step
- Question text: plain English, conversational
- Input type: appropriate for data (number, toggle, select, slider)
- Validation: inline, friendly ("Looks like that's a bit low — double check?")
- FAQ section: 2–4 relevant Q&As at the bottom of every step (collapsible)
- "Back" and "Next" buttons always visible
- "Skip / I'm not sure" option where applicable (uses safe default)
- Every answer immediately updates the Live Preview Panel

### Step 0.5 — Age Group (shown before income questions)

**Question:** "How old are you?"

**Input:** Three buttons / radio group:
- Under 60
- 60 to 79 (Senior Citizen)
- 80 or above (Super Senior Citizen)

**Why we ask:** Age affects the basic exemption limit under the old regime.

**FAQ:**
- Q: Why does age matter for taxes? → A: Under the old regime, people aged 60–79 get a higher tax-free threshold (₹3L vs ₹2.5L), and those 80+ get ₹5L. The new regime doesn't change rates with age.
- Q: Which date do I use? → A: Your age as of 31st March 2026 (last day of FY 2025-26).

---

### Step 1 — Monthly Take-Home Salary

**Question:** "How much money lands in your bank account every month from your employer?"

**Subtext:** "This is your salary after PF deduction and tax — what you actually receive."

**Input:** Number field  
**Placeholder:** "e.g. 65,000"  
**Unit label:** "₹ per month"  
**Validation:**
- Minimum: ₹10,000 (warn below this)
- Maximum: ₹8,33,333 (= ₹1 crore/year; show note above this that surcharge may apply)
- Must be a positive integer

**What we do with this:** This is the anchor. We reverse-engineer gross salary from take-home by estimating PF deduction and TDS. See calculation logic in Section 7.

**FAQ:**
- Q: What counts as "take-home"? → A: The amount your employer credits to your bank account every month. Not including reimbursements, LTA paid separately, or bonuses.
- Q: Should I include my bonus? → A: No — enter your regular monthly salary. We'll ask about bonuses separately.
- Q: My salary varies each month. What should I enter? → A: Enter your average monthly amount for the year, or your fixed monthly component.
- Q: I don't know my in-hand salary. Can I enter my CTC instead? → A: Yes — tap "I know my CTC instead" and we'll work from there.

**Alternate input path:** "I know my CTC instead"
- Ask: "What is your annual CTC?" (Number field, ₹ per year)
- Internal note: "CTC" is just used as the gross annual salary starting point. Wizard will still ask about PF and deductions to refine.

---

### Step 2 — Bonus / Variable Pay

**Question:** "Do you get any bonus or variable pay?"

**Input:** Toggle (Yes / No / Skip), then if Yes:  
"How much bonus did you receive (or expect to receive) this financial year?"
- Input: Number field, ₹ (annual total)
- Label: "Annual bonus"

**Note shown:** "Bonus is fully taxable in the year it's received."

**FAQ:**
- Q: What if my bonus hasn't been paid yet this year? → A: Enter your expected amount. We'll include it in your annual income.
- Q: Is my joining bonus taxable? → A: Yes, all bonuses are taxable as salary.
- Q: What about annual incentives / PLI / performance pay? → A: Include all of these as bonus.

---

### Step 3 — Professional Tax

**Question:** "Does your employer deduct Professional Tax from your salary?"

**Subtext:** "It's a small state-level deduction — usually ₹200/month or ₹2,400/year."

**Input:** Toggle (Yes / No / Not Sure)  
**If Yes:** "How much is deducted per year?" → Number field (default: ₹2,400)

**FAQ:**
- Q: What is Professional Tax? → A: It's a small tax levied by some state governments (Maharashtra, Karnataka, etc.), not by the central government. It reduces your taxable income.
- Q: How do I find out? → A: Check your salary slip under deductions. It may appear as "PT" or "Prof. Tax".
- Q: My state doesn't have Professional Tax. → A: Select "No". States like Delhi, Rajasthan, UP don't levy it.

**Deduction treatment:** Professional Tax paid is deductible from salary income under Section 16(iii) in **both** old and new regimes.

---

### Step 4 — PF (Provident Fund)

**Question:** "Does your company deduct PF (Provident Fund) from your salary?"

**Subtext:** "Most employers with 20+ employees do this automatically."

**Input:** Toggle (Yes / No / Not Sure)  
**If Yes:** "How much PF is deducted from your salary each month?"
- Option A: "I know the amount" → Number field (₹ per month)
- Option B: "I'm not sure" → We estimate 12% of basic (typically 40–50% of gross)

**FAQ:**
- Q: What is PF? → A: Your employer deducts 12% of your basic salary and deposits it in your EPF account. Your employer also contributes 12% on top (you don't see that in your take-home).
- Q: Is PF deductible from tax? → A: Yes, your own PF contribution counts toward the ₹1.5L limit under Section 80C — but only in the old regime.
- Q: I work at a startup. They don't deduct PF. → A: Select "No". This is valid for many small employers.

**Internal use:**
- PF deduction under old regime → added to 80C bucket (capped at ₹1.5L combined)
- Under new regime: employee PF contribution NOT deductible (no 80C)

---

### Step 5 — Rent

**Question:** "Do you pay rent for where you live?"

**Input:** Toggle (Yes / No)  

**If Yes, follow-up questions (same screen or next step):**
1. "How much rent do you pay per month?" → Number field (₹)
2. "Which city do you live in?" → Select: Metro (Delhi, Mumbai, Kolkata, Chennai) / Non-metro
3. "Does your employer give you HRA (House Rent Allowance)?" → Yes / No / Not Sure
   - If Yes: "How much HRA do you receive per month?" → Number field (₹)
   - If Not Sure: "We'll estimate it as 40% of your basic salary (common default)"

**FAQ:**
- Q: I live with my parents and pay them rent. Can I claim it? → A: Yes, if you actually transfer money and they have PAN. It needs a proper rent agreement.
- Q: What's metro vs non-metro for taxes? → A: Only Delhi, Mumbai, Kolkata, and Chennai are considered "metro" for HRA calculation. Bengaluru, Hyderabad, Pune, Ahmedabad are non-metro for this purpose.
- Q: I own my house. → A: Select "No" for rent. You can't claim HRA if you own your home (unless it's in a different city from where you work).
- Q: What is HRA? → A: It's the rent allowance your employer pays you as part of your salary. If you pay rent AND receive HRA, you get a tax exemption under the old regime.

**HRA Calculation Logic (Old Regime only — see Section 7.4):**
Exemption = minimum of:
1. Actual HRA received (annual)
2. Rent paid − 10% of (Basic + DA) (annual)
3. 50% of (Basic + DA) if metro, 40% if non-metro

HRA exemption is **NOT available** under the new regime.

---

### Step 6 — 80C Investments

**Question:** "Do you invest in any tax-saving options? (These reduce your tax bill under the old regime)"

**Subtext:** "Things like PPF, ELSS mutual funds, life insurance premiums, NSC, or kids' school fees count here."

**Input:** Two-column checkbox list with amounts:

| Investment Type | Amount (₹/year) |
|---|---|
| EPF / PF (auto-filled from Step 4 if provided) | _________ |
| PPF (Public Provident Fund) | _________ |
| ELSS Mutual Funds | _________ |
| Life Insurance Premium | _________ |
| NSC (National Savings Certificate) | _________ |
| Tax-saving FD (5-year) | _________ |
| Children's tuition fees | _________ |
| Home loan principal repayment | _________ |
| Other 80C investments | _________ |

**Total shown live:** "Total 80C investments: ₹X / ₹1,50,000 limit"  
**Warning if over limit:** "You've entered more than ₹1.5L — only ₹1.5L will be counted."

**Skip option:** "I don't invest in any of these / Skip"

**FAQ:**
- Q: What is 80C? → A: Section 80C lets you deduct up to ₹1.5 lakh per year from your taxable income if you invest in approved instruments. This saves tax only under the old regime.
- Q: Does my EPF contribution count? → A: Yes. The amount your employer deducts from your salary for EPF is counted here.
- Q: What about my LIC premium? → A: Yes, life insurance premiums for yourself, spouse, or children count under 80C.
- Q: Do 80C benefits apply in the new regime? → A: No. The new regime doesn't allow 80C deductions, which is a trade-off for lower tax rates.

---

### Step 7 — NPS (National Pension System)

**Question:** "Do you contribute to NPS?"

**Input:** Toggle (Yes / No / Skip)  
**If Yes, two sub-questions:**
1. "Do you personally contribute to NPS?" → Yes / No  
   - If Yes: "How much per year?" → Number field (₹)
   - Label: "Your own NPS contribution (80CCD(1B) — extra ₹50,000 deduction)"
2. "Does your employer contribute to NPS on your behalf?" → Yes / No  
   - If Yes: "How much does your employer contribute per year?" → Number field (₹)
   - Label: "Employer NPS contribution (80CCD(2) — deductible in both regimes)"

**FAQ:**
- Q: What is NPS? → A: National Pension System is a government retirement savings scheme. You invest now and get a pension later.
- Q: Why is employer NPS special? → A: Employer NPS contributions (up to 14% of basic) are deductible even in the new regime. Your own contributions are only deductible in the old regime (within 80C limit + extra ₹50,000 under 80CCD(1B)).
- Q: I have NPS but don't know the split. → A: Check your salary slip or ask HR. The employer contribution is separate from your salary.

---

### Step 8 — Health Insurance

**Question:** "Do you pay for health insurance?"

**Subtext:** "The premium you pay for yourself, your spouse, children, or parents."

**Input:** Toggle (Yes / No)  
**If Yes:**
1. "Premium for yourself, spouse, and children (per year):" → Number field (₹)  
   Note: "You can claim up to ₹25,000 here (₹50,000 if you're a senior citizen)"
2. "Do you also pay health insurance for your parents?" → Yes / No  
   - If Yes: "Are your parents senior citizens (60+)?" → Yes / No  
   - "Premium for parents (per year):" → Number field (₹)  
   - Note: "You can claim up to ₹25,000 (₹50,000 if parents are senior citizens)"

**Total 80D shown:** "Your 80D deduction: ₹X / up to ₹Y limit"

**FAQ:**
- Q: What is Section 80D? → A: It lets you deduct health insurance premiums from your taxable income — up to ₹25,000 for self/family, and another ₹25,000 (or ₹50,000) for parents. Old regime only.
- Q: My employer provides health insurance. Can I claim it? → A: Only the premium you personally pay counts. Employer-paid group health insurance premiums are not eligible.
- Q: I don't have health insurance. → A: Select No. Consider getting some — it's a good deduction and essential coverage.

---

### Step 9 — Home Loan (Optional)

**Question:** "Do you have a home loan for a self-occupied property?"

**Input:** Toggle (Yes / No / Skip)  
**If Yes:**  
"How much interest did you pay on your home loan this financial year?"  
→ Number field (₹)  
Note: "Maximum deductible: ₹2,00,000 per year under Section 24(b), old regime only"

**FAQ:**
- Q: What interest can I claim? → A: Under the old regime, you can claim up to ₹2L of home loan interest per year for a self-occupied property under Section 24(b).
- Q: What about the principal? → A: Principal repayment goes into 80C (we asked about that in the investments step).
- Q: Is home loan interest deductible in the new regime? → A: No, not for self-occupied property. For let-out property it's different, but we don't cover rental income here.
- Q: I have a joint loan. → A: Each co-borrower can claim interest deduction separately up to their own ₹2L limit if they're co-owners.

---

### Step 10 — Other Income (Savings/FD Interest)

**Question:** "Do you earn interest from savings accounts or fixed deposits?"

**Subtext:** "This is optional but helps us be more accurate."

**Input:** Toggle (Yes / No / Skip)  
**If Yes:**
1. "Savings account interest (per year):" → Number field (₹) — optional
2. "FD / RD / other deposit interest (per year):" → Number field (₹) — optional

**FAQ:**
- Q: Why does bank interest matter? → A: It's taxable income added to your salary income. Under the old regime, you can deduct up to ₹10,000 of savings account interest via Section 80TTA (₹50,000 for senior citizens under 80TTB, which also covers FD interest).
- Q: How do I find my savings interest? → A: Check your bank's annual interest statement or Form 26AS. Banks usually send an email or update the passbook.

---

## 6. Live Preview Panel

### Visible At All Times (desktop) or Expandable (mobile)

The panel updates in real time as each question is answered. It should never show a blank state — show estimates from the first input.

### Panel Sections

**Section A — Income Summary**  
A small card showing:
- Estimated Annual Gross Income: ₹X
- Less: Standard Deduction (both regimes): ₹75,000
- Estimated Taxable Income (before deductions): ₹X

**Section B — Old Regime vs New Regime Side-by-Side**

Two columns. Every line item clearly labelled.

```
                        OLD REGIME      NEW REGIME
Gross Income             ₹X,XX,XXX      ₹X,XX,XXX
− Standard Deduction      −₹75,000       −₹75,000
− Professional Tax        −₹X,XXX        −₹X,XXX
− HRA Exemption          −₹X,XXX         —
− 80C Deductions         −₹X,XX,XXX      —
− 80CCD(1B) NPS          −₹XX,XXX        —
− 80CCD(2) Employer NPS  −₹X,XXX        −₹X,XXX
− 80D Health Insurance   −₹XX,XXX        —
− Section 24(b) Loan Int −₹X,XX,XXX      —
− 80TTA/80TTB Interest   −₹X,XXX         —
─────────────────────────────────────────────────
Taxable Income           ₹X,XX,XXX      ₹X,XX,XXX
Tax (before rebate)      ₹X,XX,XXX      ₹X,XX,XXX
− Section 87A Rebate      −₹X,XXX        −₹X,XXX
Tax After Rebate          ₹X,XX,XXX      ₹X,XX,XXX
+ Health & Education Cess (+4%)
─────────────────────────────────────────────────
TOTAL TAX PAYABLE        ₹X,XX,XXX      ₹X,XX,XXX
```

**Section C — Tax Slab Breakdown Table (for active estimate)**

Show slab-by-slab breakdown for whichever regime is currently estimated to be better (or both, toggled):

```
New Regime Slab Breakdown
Up to ₹4,00,000       → 0%     ₹0
₹4L – ₹8L            → 5%     ₹X
₹8L – ₹12L           → 10%    ₹X
₹12L – ₹16L          → 15%    ₹X
...
```

**Section D — Live Recommendation Chip**  
A colored tag: "New Regime saves you ₹23,400" (green) or "Old Regime saves you ₹18,700" (blue)  
This updates on every answer.

**Section E — Completion Hint**  
"Answer 3 more questions to get your full result →"

---

## 7. Tax Calculation Engine

### 7.1 Gross Salary Reconstruction (from take-home)

When the user enters monthly take-home:
- `annualTakeHome = monthlyTakeHome × 12`
- Estimate employee PF: if user says PF is deducted, add it back
  - `estimatedPF = (annualTakeHome × 0.12) / 0.88` (rough back-calculation)
  - Refine once user gives actual PF amount
- Add professional tax back to get approximate gross
- `estimatedGross = annualTakeHome + pfDeductedAnnually + professionalTax`
- Note: TDS (income tax withheld) is already deducted from take-home, but gross salary is before TDS
  - We reconstruct gross differently: use the wizard's reverse calculation
  - Simpler approach: ask the user to confirm the gross via the bonus question flow

**Recommended flow:** Use take-home + PF amount + professional tax to estimate gross salary, then calculate tax from that gross. Show the estimated gross in the preview so users can correct if it looks wrong.

**If user enters CTC:**
- `grossSalary = CTC − (employerPFContribution) − (employerNPSContribution)`
- Or approximate: `grossSalary = CTC × 0.88` for typical CTC structures
- Prompt user to confirm if they have unusual perks in CTC

### 7.2 Standard Deduction
- Both old and new regime: **₹75,000** for FY 2025-26 (Budget 2025 update)
- Applied automatically, no user input needed

### 7.3 Professional Tax
- Deductible under **Section 16(iii)** in both regimes
- Amount entered by user, default ₹2,400 if "Yes" selected

### 7.4 HRA Exemption (Old Regime Only)

```
HRA_Exemption = MIN(
  actualHRAReceived_annual,
  (actualRentPaid_annual − 0.10 × basicSalary_annual),
  (metroMultiplier × basicSalary_annual)  // 0.50 for metro, 0.40 for non-metro
)
```

Where:
- `basicSalary_annual` = estimated as 40–50% of gross (configurable; show assumption to user)
- `actualHRAReceived_annual` = user-provided × 12
- `actualRentPaid_annual` = user-provided × 12
- Metro cities: Delhi, Mumbai, Kolkata, Chennai → 50%
- Non-metro → 40%

**Not available under new regime.** HRA exemption = ₹0.

Edge cases:
- If rent paid < 10% of basic salary, the middle term is negative → HRA exemption = ₹0 on that term → result = min of the other two
- HRA cannot exceed actual HRA received
- If user doesn't receive HRA (no HRA from employer), explore Section 80GG (not covered in MVP)

### 7.5 Section 80C (Old Regime Only)

```
section80C_deduction = MIN(totalUserInvestments80C, 150000)
```

Components (all user-provided):
- EPF contribution (employee share only)
- PPF contributions
- ELSS mutual fund investments
- Life insurance premiums
- NSC
- Tax-saving FD (5-year lock-in)
- Children's tuition fees
- Home loan principal repayment

Cap: ₹1,50,000 per year. No 80C deduction in new regime.

### 7.6 NPS Deductions

**Employee NPS — 80CCD(1B) — Old Regime Only:**
```
nps_employee_deduction = MIN(userNPSContribution, 50000)
```
This is **over and above** the 80C limit of ₹1.5L.

**Employer NPS — 80CCD(2) — BOTH regimes:**
```
Old regime: nps_employer_deduction = MIN(employerNPSContribution, 0.10 × (basic + DA))
New regime: nps_employer_deduction = MIN(employerNPSContribution, 0.14 × (basic + DA))
```
Max aggregate employer contributions (PF + NPS + superannuation) = ₹7,50,000/year

Note: If user doesn't know basic salary, estimate basic = 40% of gross salary.

### 7.7 Section 80D Health Insurance (Old Regime Only)

```
80D_self = MIN(premiumSelf, selfLimit)  // selfLimit = ₹25,000; ₹50,000 if user is senior citizen
80D_parents = MIN(premiumParents, parentsLimit)  // ₹25,000; ₹50,000 if parents are senior citizens
total_80D = 80D_self + 80D_parents  // max combined = ₹1,00,000 (₹50K + ₹50K) in extreme case
```

Not available in new regime.

### 7.8 Section 24(b) Home Loan Interest (Old Regime Only)

```
section24b = MIN(homeLoanInterestAnnual, 200000)
```

Not available for self-occupied property in new regime. Set to ₹0 under new regime.

### 7.9 Section 80TTA / 80TTB (Old Regime Only)

- **Non-senior citizens (under 60):** 80TTA — savings account interest only
  - `80TTA = MIN(savingsInterest, 10000)`
  - FD interest is NOT covered by 80TTA
- **Senior citizens (60+):** 80TTB — savings + FD + RD + post office deposits
  - `80TTB = MIN(savingsInterest + fdInterest, 50000)`
  - 80TTA NOT available to senior citizens (use 80TTB instead)

Not available in new regime.

### 7.10 Taxable Income Calculation

**OLD REGIME:**
```
grossSalary
− standardDeduction (₹75,000)
− professionalTax
= salaryIncome

+ bonus
+ interestIncome (savings + FD; fully taxable before 80TTA/TTB)
= grossTotalIncome

− HRA_Exemption
= incomeFromSalaries

− section80C
− section80CCD1B (NPS employee)
− section80CCD2 (NPS employer, old: 10% of basic)
− section80D
− section24b (home loan interest)
− section80TTA (non-senior) OR section80TTB (senior)
= taxableIncome_old
```

**NEW REGIME:**
```
grossSalary
− standardDeduction (₹75,000)
− professionalTax
= salaryIncome

+ bonus
+ interestIncome (fully taxable, no 80TTA/TTB)
= grossTotalIncome

− section80CCD2 (NPS employer only, new: 14% of basic)
= taxableIncome_new
```

### 7.11 Tax Slab Computation

#### Old Regime Slabs

**Below 60 years:**
| Income Slab | Rate |
|---|---|
| Up to ₹2,50,000 | 0% |
| ₹2,50,001 – ₹5,00,000 | 5% |
| ₹5,00,001 – ₹10,00,000 | 20% |
| Above ₹10,00,000 | 30% |

**Senior Citizens (60–79 years):**
| Income Slab | Rate |
|---|---|
| Up to ₹3,00,000 | 0% |
| ₹3,00,001 – ₹5,00,000 | 5% |
| ₹5,00,001 – ₹10,00,000 | 20% |
| Above ₹10,00,000 | 30% |

**Super Senior Citizens (80+ years):**
| Income Slab | Rate |
|---|---|
| Up to ₹5,00,000 | 0% |
| ₹5,00,001 – ₹10,00,000 | 20% |
| Above ₹10,00,000 | 30% |

#### New Regime Slabs (All ages — same rate)
| Income Slab | Rate |
|---|---|
| Up to ₹4,00,000 | 0% |
| ₹4,00,001 – ₹8,00,000 | 5% |
| ₹8,00,001 – ₹12,00,000 | 10% |
| ₹12,00,001 – ₹16,00,000 | 15% |
| ₹16,00,001 – ₹20,00,000 | 20% |
| ₹20,00,001 – ₹24,00,000 | 25% |
| Above ₹24,00,000 | 30% |

**Slab computation function (same logic for both regimes):**
```javascript
function computeSlabTax(taxableIncome, slabs) {
  let tax = 0;
  for (let i = 0; i < slabs.length; i++) {
    const { lower, upper, rate } = slabs[i];
    if (taxableIncome <= lower) break;
    const taxableInSlab = Math.min(taxableIncome, upper ?? Infinity) - lower;
    tax += taxableInSlab * rate;
  }
  return tax;
}
```

### 7.12 Section 87A Rebate

**Old Regime:**
- If `taxableIncome_old ≤ 5,00,000` → rebate = MIN(taxBeforeRebate_old, ₹12,500)
- If `taxableIncome_old > 5,00,000` → rebate = 0

**New Regime:**
- If `taxableIncome_new ≤ 12,00,000` → rebate = MIN(taxBeforeRebate_new, ₹60,000)
- If `taxableIncome_new > 12,00,000` → rebate = 0

**Marginal Relief (New Regime — critical edge case):**

When `taxableIncome_new` is just above ₹12,00,000, the tax after rebate could exceed the "extra" income above ₹12L. This would be unfair. Marginal relief prevents this.

```javascript
function applyMarginalRelief(taxableIncome, taxBeforeRebate) {
  const REBATE_LIMIT = 1200000;
  const MAX_REBATE = 60000;
  
  if (taxableIncome <= REBATE_LIMIT) {
    // Full rebate
    return Math.max(0, taxBeforeRebate - Math.min(taxBeforeRebate, MAX_REBATE));
  }
  
  const incomeAboveLimit = taxableIncome - REBATE_LIMIT;
  const taxAfterFullRebateIfAtLimit = 0; // tax at exactly ₹12L = 0 after rebate
  const maxTaxPayable = taxAfterFullRebateIfAtLimit + incomeAboveLimit;
  
  if (taxBeforeRebate > maxTaxPayable) {
    // Apply marginal relief — cap tax at income above ₹12L
    return maxTaxPayable;
  }
  return taxBeforeRebate;
}
```

This ensures that someone with ₹12,10,000 doesn't pay more than ₹10,000 in tax.

### 7.13 Health & Education Cess

```javascript
const taxAfterRebate = ...; // computed above
const cess = taxAfterRebate * 0.04;
const totalTax = taxAfterRebate + cess;
```

Applies to **both** regimes. No exceptions.

### 7.14 Final Output Variables

```javascript
{
  // Old Regime
  oldRegime: {
    grossSalary,
    deductions: {
      standardDeduction: 75000,
      professionalTax,
      hraExemption,
      section80C,
      npsEmployee_80CCD1B,
      npsEmployer_80CCD2_old,
      section80D,
      section24b,
      interestDeduction_80TTA_or_80TTB
    },
    taxableIncome,
    slabBreakdown: [ { slab, rate, tax } ],
    taxBeforeRebate,
    rebate87A,
    taxAfterRebate,
    cess,
    totalTax
  },
  
  // New Regime
  newRegime: {
    grossSalary,
    deductions: {
      standardDeduction: 75000,
      professionalTax,
      npsEmployer_80CCD2_new,
    },
    taxableIncome,
    slabBreakdown: [ { slab, rate, tax } ],
    taxBeforeRebate,
    rebate87A,
    marginalRelief, // if applicable
    taxAfterRebate,
    cess,
    totalTax
  },
  
  // Recommendation
  recommendation: {
    betterRegime: 'new' | 'old' | 'equal',
    savingsAmount: number,
    savingsPercent: number
  }
}
```

---

## 8. Result Page

### Layout
Full page. Not a modal. Persistent URL state (optional: encode inputs in URL hash for shareability without a backend).

### Section 1 — Verdict Card (Hero)

Large, high-contrast card at the top.

**If new regime wins:**
> "✅ Go with the **New Tax Regime**"  
> "You save **₹23,400** compared to the old regime."  
> "That's ₹1,950 more every month in your pocket."

**If old regime wins:**
> "✅ Go with the **Old Tax Regime**"  
> "You save **₹18,700** compared to the new regime."  
> "Your investments are doing the work — keep it up."

**If they're equal (within ₹500):**
> "⚖️ Both regimes are almost the same for you."  
> "Difference is less than ₹500. We recommend the **New Regime** for simplicity."

Monthly savings = annual savings ÷ 12 (rounded)

### Section 2 — Side-by-Side Full Comparison Table

Two-column table: Old Regime | New Regime

Rows (in order):
1. Gross Annual Salary
2. + Bonus / Variable Pay
3. + Interest Income
4. − Standard Deduction (₹75,000)
5. − Professional Tax
6. − HRA Exemption (Old only)
7. − Section 80C Investments (Old only)
8. − NPS — Your Contribution / 80CCD(1B) (Old only)
9. − NPS — Employer's Share / 80CCD(2)
10. − Health Insurance / 80D (Old only)
11. − Home Loan Interest / 24(b) (Old only)
12. − Savings/FD Interest / 80TTA or 80TTB (Old only)
13. **= Taxable Income** (bold row)
14. Tax on slab income
15. − Section 87A Rebate
16. + 4% Health & Education Cess
17. **= Total Tax Payable** (bold, highlighted)
18. Monthly Tax Equivalent
19. **Effective Tax Rate** (total tax / gross income × 100)

Cells that are "₹0" or "Not applicable" should be shown in muted grey. The winning regime column should be highlighted (green tint or border).

### Section 3 — Slab-by-Slab Breakdown

Two tables (Old Regime and New Regime), shown side by side or as tabbed view.

Each table:
```
Income Slab         | Rate | Amount Taxed | Tax
Up to ₹4,00,000     | 0%   | ₹4,00,000    | ₹0
₹4L – ₹8L          | 5%   | ₹4,00,000    | ₹20,000
₹8L – ₹12L         | 10%  | ₹3,25,000    | ₹32,500
...
TOTAL               |      | ₹X,XX,XXX   | ₹X,XX,XXX
```

Visually highlight which slab the user's income falls in.

### Section 4 — "Why Did This Happen?" (Personalised Explanation)

Plain English explanation of what drove the result. Dynamically generated based on user inputs.

**Template logic:**

If new regime wins:
> "Even though you invest ₹1.2 lakh in tax-saving instruments, the new regime's lower slab rates and the ₹12 lakh zero-tax limit (thanks to the Section 87A rebate) mean you still pay less overall. Your investments helped in the old regime, but not enough to overcome the new regime's slab advantage."

If old regime wins (heavy HRA):
> "Your HRA exemption of ₹1,44,000 made the biggest difference. Because you pay ₹20,000/month in rent in a metro city and receive HRA from your employer, you could deduct a significant amount. Combined with your 80C investments, your taxable income under the old regime is substantially lower."

If old regime wins (heavy investments):
> "You're maximising your 80C (₹1.5 lakh) and also contributing to NPS for an extra ₹50,000 deduction, plus home loan interest of ₹1.8 lakh. Together these deductions pull your taxable income far below what the new regime's slabs would otherwise impose."

Include a bullet list of which deductions contributed most:
- "HRA Exemption: saved you ₹X in old regime"
- "80C Investments: saved you ₹X in old regime"
- "Health Insurance (80D): saved you ₹X in old regime"
- etc.

### Section 5 — Personalised Tax-Saving Tips

Dynamic tips based on what the user hasn't maxed out. Show only relevant ones.

**Tip Templates (show only if applicable):**

1. **If 80C < ₹1,50,000 and user chose old regime:**
   > "💡 You can invest ₹[1,50,000 − your80C] more in 80C instruments (PPF, ELSS, life insurance) to save an additional ₹[amount] in tax this year."

2. **If user has no health insurance:**
   > "💡 Buying health insurance for yourself (₹25,000/year) can save you ₹[5,000–7,500] in tax under the old regime — and protects you medically."

3. **If employer NPS is not mentioned:**
   > "💡 Ask your employer if they offer NPS contributions. Employer NPS (up to 14% of basic) is deductible even in the new regime — it's a rare deduction that works in both."

4. **If new regime is recommended and user has large 80C:**
   > "💡 In the new regime, your 80C investments won't save tax — but they're still good for wealth building (PPF, ELSS). Just don't invest *only* for tax purposes."

5. **If salary > ₹12.75L and new regime is borderline:**
   > "💡 Your taxable income is just above the ₹12 lakh rebate threshold. If you can increase your employer NPS contribution slightly, you might bring it below ₹12 lakh and pay zero tax."

6. **If senior citizen with no health insurance:**
   > "💡 As a senior citizen, you can claim up to ₹50,000 under Section 80D for health insurance or medical expenses. This can save ₹10,000–15,000 in tax."

7. **If senior citizen with no 80TTB:**
   > "💡 As a senior citizen, bank FD interest up to ₹50,000 is tax-deductible under Section 80TTB in the old regime. Check if you've captured all your FD interest."

### Section 6 — What Next?

Three action prompts:
1. "📋 Share your result with your HR / Finance team" (copy text to clipboard)
2. "🔄 Change any inputs" → back to Step 1
3. "📚 Learn more about ITR filing" → external link to incometax.gov.in

---

## 9. Progress Indicator

### Desktop: Progress Bar
- Thin bar at top of wizard area
- Shows % complete (e.g., Step 4 of 10 = 40%)
- Animate smooth width transition

### Mobile: Step Dots
- Row of dots below question title
- Filled dot = completed, current dot = highlighted, empty = upcoming
- Tap on completed dots to jump back

### Step Labels (shown on hover on desktop, always on tablet):
`Age → Income → Bonus → Prof. Tax → PF → Rent → Investments → NPS → Health → Home Loan → Interest`

---

## 10. Validation & Error States

### Input Validation Rules

| Field | Min | Max | Type | Error Message |
|---|---|---|---|---|
| Monthly take-home | ₹1,000 | ₹10,00,000 | integer | "Please enter a valid monthly salary" |
| Annual bonus | ₹0 | ₹2,00,00,000 | integer | — |
| Professional tax | ₹0 | ₹2,500 | integer | "Professional Tax is typically ₹2,400/year or less" |
| PF monthly | ₹0 | ₹10,000 | integer | "PF is usually 12% of your basic salary" |
| Monthly rent | ₹0 | ₹5,00,000 | integer | — |
| Monthly HRA received | ₹0 | monthly salary | integer | "HRA can't be more than your total salary" |
| 80C each component | ₹0 | ₹1,50,000 | integer | — |
| 80C total | — | ₹1,50,000 | — | "Only ₹1.5 lakh counts — we'll cap it automatically" (warning, not error) |
| Home loan interest | ₹0 | ₹2,00,000 input; ₹5,00,000 allowed | integer | "Only ₹2 lakh is deductible for self-occupied property" (cap, not error) |

### UX Rules
- Never block progression entirely for "warnings" (caution in yellow, error in red blocks "Next")
- Inline validation on blur (not on every keystroke)
- Show ₹-formatted display next to raw input: user types `65000`, sees `₹65,000`
- Numbers formatted with Indian number system: ₹1,23,456 (not ₹123,456)

---

## 11. Default Values & Skip Logic

When a user skips a step or says "Not sure":

| Step | Skip Default |
|---|---|
| Bonus | ₹0 |
| Professional Tax (Not Sure) | Use ₹2,400 and show note |
| PF (Not Sure) | Estimate 12% of estimated basic |
| HRA (Not Sure) | Estimate 40% of basic |
| 80C (Skip) | ₹0 |
| NPS (Skip) | ₹0 |
| 80D (Skip) | ₹0 |
| Home Loan (Skip) | ₹0 |
| Interest Income (Skip) | ₹0 |

Show all assumptions clearly in the Live Preview Panel as small footnotes: "Estimated PF as 12% of basic. Update if different."

---

## 12. Design System

### Visual Identity
- **Tone:** Clean, trustworthy, modern. Like a well-designed fintech product.
- **Colour palette:**
  - Primary: `#1A56DB` (deep blue — authority, trust)
  - Accent (saving): `#0E9F6E` (green — money saved)
  - Warning: `#FF5A1F` (orange)
  - Background: `#F9FAFB` (light grey)
  - Surface: `#FFFFFF`
  - Text primary: `#111928`
  - Text secondary: `#6B7280`
  - Border: `#E5E7EB`
- **Typography:**
  - Display/Hero: `Inter` or `DM Sans`, weight 700, large size
  - Body: `Inter`, weight 400–500, 16px base
  - Numbers/tables: `JetBrains Mono` or `Roboto Mono` for monospace alignment
  - Indian Rupee symbol: `₹` (U+20B9), ensure the font supports it
- **Border radius:** 12px for cards, 8px for inputs, 20px for chips/badges
- **Shadow:** `0 1px 3px rgba(0,0,0,0.1)` for cards
- **Spacing:** 8px base grid

### Wizard Step Card
```
┌─────────────────────────────────────────┐
│  Step 5 of 10                           │
│  ████████░░░░░░░░░  50%                 │
│                                         │
│  Q: Do you pay rent?                    │
│  [subtext]                              │
│                                         │
│  ○ Yes   ○ No                           │
│                                         │
│  [Back]          [Next →]               │
│  ─────────────────────────              │
│  ▸ Common questions about this step     │
│    Q: Can I claim HRA and home loan...  │
└─────────────────────────────────────────┘
```

### Live Preview Panel (right side)
```
┌────────────────────────────────┐
│  LIVE ESTIMATE                 │
│                                │
│  Annual Income: ₹14,40,000    │
│                                │
│              OLD    NEW        │
│  Taxable:   ₹8.2L  ₹12.6L    │
│  Tax:       ₹91K   ₹72.5K    │
│  + Cess:    ₹3.6K  ₹2.9K     │
│  ─────────  ─────  ───────    │
│  Total Tax: ₹94.6K ₹75.4K    │
│                                │
│  ✅ New Regime saves ₹19,200   │
│                                │
│  [Slab Details ▾]              │
└────────────────────────────────┘
```

### Result Page — Verdict Card
```
┌─────────────────────────────────────────────────┐
│  ✅ Go with the NEW TAX REGIME                   │
│                                                   │
│  You save  ₹19,200  this year                    │
│  (₹1,600 more every month)                       │
│                                                   │
│  Effective tax rate: 5.2% (New) vs 6.6% (Old)   │
└─────────────────────────────────────────────────┘
```

---

## 13. Accessibility Requirements

- All inputs must have proper `<label>` associations
- Keyboard navigable: Tab through all interactive elements
- Focus indicators: visible ring `2px solid #1A56DB`
- Colour is never the only indicator of meaning (use icons + text alongside)
- Minimum touch target: 44×44px on mobile
- Number inputs: type="number" with `inputmode="numeric"` for mobile keyboards
- Screen reader: announce when Live Preview updates (use `aria-live="polite"` on the preview section)
- Reduced motion: respect `prefers-reduced-motion` (disable number transitions)
- Form errors: `aria-describedby` linking error text to input

---

## 14. Edge Cases & Special Handling

### Edge Case 1: Zero Tax
If total tax = ₹0 (after rebate), show:
> "Great news — you owe zero tax this year! ✅"
Do not show a negative number.

### Edge Case 2: Tax exactly at rebate limit
New regime: If taxable income = exactly ₹12,00,000:
- Tax before rebate (on slabs) = ₹60,000
- Rebate = ₹60,000
- Tax after rebate = ₹0
- Cess on ₹0 = ₹0
- Show zero tax clearly

### Edge Case 3: Marginal income above ₹12L
Taxable income = ₹12,10,000 (new regime):
- Tax on slabs = ₹61,500
- No Section 87A rebate (income > ₹12L)
- But ₹61,500 > ₹10,000 (income above ₹12L)
- Apply marginal relief → tax = ₹10,000
- + 4% cess = ₹10,400 total

Handle this range carefully (₹12,00,001 to ~₹12,75,000) with explicit marginal relief calculation.

### Edge Case 4: Super Senior Citizen in New Regime
- New regime offers NO age-based exemption
- Same slabs as below-60 taxpayers
- Old regime has ₹5L basic exemption (often better for low-income super seniors)
- Flag this clearly in the result

### Edge Case 5: Income below taxable threshold
If taxable income < basic exemption (e.g., ₹1.8L old regime below-60):
- Tax = ₹0, cess = ₹0
- Show "No tax payable"

### Edge Case 6: Very high income (>₹50L warning)
Show advisory: "For incomes above ₹50 lakh, a surcharge may apply. This calculator doesn't include surcharge — consult a CA for accurate figures."

### Edge Case 7: HRA + Home Loan simultaneously
Both are allowed (different properties):
- User pays rent in City A (claims HRA)
- Owns a home in City B (claims home loan interest)
This is legal. The wizard should not block this combination.

### Edge Case 8: PF contribution exceeds ₹1.5L cap
If user's EPF contribution alone is >₹1.5L (very high salary):
- 80C is capped at ₹1.5L
- Warn: "Your EPF contribution alone exceeds the ₹1.5L limit. Other 80C investments won't give additional tax benefit."

---

## 15. Assumptions to Display to Users

The Live Preview Panel and Result Page must show a small "Assumptions" section explaining any estimated values:

```
ℹ️ Assumptions we've made:
• Basic salary estimated as 40% of gross (industry average for salary structure)
• If you know your actual basic salary, HRA will be more accurate
• Professional Tax treated as ₹2,400/year based on your selection
• Monthly in-hand salary used to estimate annual gross: ₹X × 12 + PF deducted
```

---

## 16. Sequence of Wizard Screens Summary

| Step | Screen Name | Key Input | Regime Impact |
|---|---|---|---|
| 0 | Landing Page | CTA click | — |
| 0.5 | Age Group | Below 60 / Senior / Super Senior | Old regime basic exemption |
| 1 | Monthly Salary | In-hand amount or CTC | Both |
| 2 | Bonus | Annual bonus | Both |
| 3 | Professional Tax | Yes/No + amount | Both |
| 4 | PF Contribution | Yes/No + amount | Old: 80C |
| 5 | Rent & HRA | Rent, city, HRA | Old: HRA exemption |
| 6 | 80C Investments | Components + amounts | Old: 80C deduction |
| 7 | NPS | Employee + Employer | Old: both; New: employer only |
| 8 | Health Insurance | Self + parents premiums | Old: 80D |
| 9 | Home Loan | Annual interest | Old: 24(b) |
| 10 | Interest Income | Savings + FD | Old: 80TTA / 80TTB |
| Result | Final Screen | — | Recommendation + full breakdown |

---

## 17. Content & Copy Guidelines

### Voice
- **Address the user as "you"** — never "the taxpayer" or "the assessee"
- Use action words: "You'll save", "This reduces your tax by", "Your ₹X investment cuts..."
- Avoid: "pursuant to Section 80C of the Income Tax Act..."
- Use: "Your PF and investments (up to ₹1.5 lakh total) reduce what you're taxed on"

### Number formatting
- Always use Indian notation: ₹1,23,456 (not ₹123,456)
- Lakhs and crores, not thousands: "₹1.5 lakh" not "₹150,000"
- Monthly equivalents help: "You save ₹19,200 per year — that's ₹1,600 more every month"

### Error messages
- Helpful, not judgmental: "That looks a bit high for monthly PF — double-check?" not "Invalid input"
- Always offer the path forward: "Enter the exact amount or tap 'I'm not sure' to skip"

---

## 18. What This App Does NOT Cover

The following are intentionally out of scope for v1:

- Surcharge (applies above ₹50L — show disclaimer only)
- Capital gains (short-term and long-term equity/property)
- Rental income from property
- Business or freelance income
- Foreign income / DTAA benefits
- Agricultural income
- Dividend income
- Set-off and carry-forward of losses
- Alternate Minimum Tax (AMT)
- Section 80G donations
- Education loan interest (Section 80E)
- LTA (Leave Travel Allowance)
- PDF report download
- Saving / sharing full result
- Filing the actual ITR

If a user brings up any of these in FAQs, note they're outside scope and recommend a CA.

---

## 19. Legal Disclaimer

Display prominently on both the landing page and result page (smaller text, not blocking):

> "This calculator is for educational and estimation purposes only. Tax rules can change. The results are based on FY 2025-26 rules as per Finance Act 2025. For complex situations (surcharge, capital gains, multiple income sources, or income above ₹50 lakh), please consult a qualified Chartered Accountant or tax advisor. This tool does not constitute professional tax advice."

---

## 20. Testing Checklist

### Tax Logic Tests

| Test Case | Inputs | Expected Old Tax | Expected New Tax | Recommendation |
|---|---|---|---|---|
| Basic ₹8L no deductions | Gross ₹8L | ₹54,600 | ₹0 (after rebate) | New |
| ₹12L, full 80C + HRA ₹1.2L | Gross ₹12L, 80C ₹1.5L, HRA ₹1.2L | ~₹55,000 | ₹75,000 (after sd) = ₹0 rebate | Old |
| ₹15L, no deductions | Gross ₹15L | ₹1,71,600 | ₹1,06,600 | New |
| ₹15L, 80C+HRA+80D+24b maxed | | ~₹60,000–80,000 | ₹1,06,600 | Old |
| ₹12.75L salaried | ₹12.75L gross | varies | ₹0 after sd ₹75K → taxable ₹12L → rebate = ₹60K → ₹0 | New |
| ₹12,10,000 new regime | Taxable ₹12.1L | — | ₹10,000 (marginal relief) | Compare |
| Senior citizen ₹5L | ₹5L | ₹0 (old regime exemption) | ₹5,200 (on ₹4.25L after sd) | Old |
| Super senior ₹10L | ₹10L | Standard old slabs | Slab calc | Compare |

### UI/UX Tests
- [ ] All steps reachable via keyboard only
- [ ] Live preview updates on every input change (debounce 200ms)
- [ ] Progress bar advances at each step
- [ ] Back button preserves previously entered values
- [ ] Skip/default values are applied and shown
- [ ] Indian number formatting (₹1,23,456) everywhere
- [ ] Mobile layout tested at 375px and 390px width
- [ ] Result page prints/screenshots cleanly
- [ ] No console errors on any step
- [ ] Marginal relief applied correctly for ₹12L–₹12.75L incomes

---

## 21. File Structure (Suggested)

```
src/
├── components/
│   ├── LandingPage.jsx
│   ├── WizardShell.jsx
│   ├── steps/
│   │   ├── AgeStep.jsx
│   │   ├── SalaryStep.jsx
│   │   ├── BonusStep.jsx
│   │   ├── ProfTaxStep.jsx
│   │   ├── PFStep.jsx
│   │   ├── RentStep.jsx
│   │   ├── InvestmentsStep.jsx
│   │   ├── NPSStep.jsx
│   │   ├── HealthStep.jsx
│   │   ├── HomeLoanStep.jsx
│   │   └── InterestStep.jsx
│   ├── LivePreview.jsx
│   ├── ProgressBar.jsx
│   ├── StepFAQ.jsx
│   └── ResultPage.jsx
│       ├── VerdictCard.jsx
│       ├── ComparisonTable.jsx
│       ├── SlabBreakdown.jsx
│       ├── WhyExplanation.jsx
│       └── TaxSavingTips.jsx
├── engine/
│   ├── taxCalculator.js      # Core calculation logic
│   ├── slabRates.js          # Slab definitions for both regimes
│   ├── deductions.js         # Deduction computation functions
│   ├── reconstruction.js     # Gross salary reconstruction from take-home
│   └── marginalRelief.js     # Marginal relief edge case
├── utils/
│   ├── formatCurrency.js     # Indian number formatting
│   └── defaults.js           # Default values for skipped steps
├── hooks/
│   └── useTaxCalculation.js  # React hook wrapping the engine
└── App.jsx
```

---

*End of PRD. Version 1.0. FY 2025-26 (AY 2026-27). Tax rules sourced from Finance Act 2025, CBDT circulars, and Income Tax Act 1961 as amended.*
