import React, { useState } from 'react';
import useTaxCalculation from '../hooks/useTaxCalculation';
import { formatIndianCurrency } from '../utils/formatCurrency';

export default function ResultPage({ onRestart, data }) {
  const result = useTaxCalculation(data || {});
  const { oldRegime, newRegime, recommendation } = result;
  
  const [showSlabs, setShowSlabs] = useState(false);

  const isOldBetter = recommendation.betterRegime === 'old';
  const isNewBetter = recommendation.betterRegime === 'new';
  const isEqual = recommendation.betterRegime === 'equal';

  // Helper for generating tips
  const generateTips = () => {
    const tips = [];
    
    // Check if they are leaving 80C on the table (Old Regime)
    const current80C = data.total80C || 0;
    if (current80C < 150000 && isOldBetter) {
      tips.push({
        title: "Maximize 80C Investments",
        desc: `You've invested ${formatIndianCurrency(current80C)} out of the ₹1.5L limit. Investing the remaining ${formatIndianCurrency(150000 - current80C)} in ELSS or PPF will save you more tax under the Old Regime.`
      });
    }

    // Check NPS 80CCD(1B)
    if (!data.employeeNPS && isOldBetter) {
      tips.push({
        title: "Extra ₹50,000 deduction with NPS",
        desc: "You can claim an additional ₹50,000 deduction under Section 80CCD(1B) by investing in the National Pension System (NPS), above the 80C limit."
      });
    }

    // Health Insurance
    if (!data.healthPremiumSelf) {
      tips.push({
        title: "Get Health Insurance",
        desc: "Medical emergencies can wipe out savings. Getting a health policy not only protects you but also gives up to ₹25,000 in tax deductions under Section 80D."
      });
    }
    
    // Default tip if they are firmly in New Regime territory
    if (isNewBetter && newRegime.taxableIncome > 1200000) {
      tips.push({
        title: "Keep it simple",
        desc: "Because you benefit from the New Regime, you don't need to lock away your money in tax-saving instruments. Invest according to your financial goals, not just for tax."
      });
    }

    return tips;
  };

  const tips = generateTips();

  // Helper for rendering comparison rows
  const Row = ({ label, oldVal, newVal, isNegative, isTotal, isHeader, isSub }) => {
    if (isHeader) {
      return (
        <div className="grid grid-cols-[2fr_1fr_1fr] bg-gray-50 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right border-b border-gray-200">
          <div className="text-left px-4">{label}</div>
          <div className="px-4">Old Regime</div>
          <div className="px-4">New Regime</div>
        </div>
      );
    }
    
    return (
      <div className={`grid grid-cols-[2fr_1fr_1fr] py-3 text-sm md:text-base ${isTotal ? 'font-bold border-t-2 border-b-2 border-gray-100 my-2 bg-gray-50/50' : 'border-b border-gray-100 hover:bg-gray-50/50 transition'} ${isSub ? 'text-gray-500 text-sm' : ''}`}>
        <div className={`pl-4 pr-2 ${isTotal ? 'text-gray-900' : isSub ? 'pl-8' : 'text-gray-700'}`}>{label}</div>
        <div className={`text-right px-4 ${isTotal ? 'text-gray-900' : isNegative && oldVal > 0 ? 'text-red-600' : 'text-gray-600'}`}>
          {oldVal === 0 ? <span className="text-gray-300">—</span> : formatIndianCurrency(isNegative ? -oldVal : oldVal)}
        </div>
        <div className={`text-right px-4 ${isTotal ? 'text-gray-900' : isNegative && newVal > 0 ? 'text-red-600' : 'text-gray-600'}`}>
          {newVal === 0 ? <span className="text-gray-300">—</span> : formatIndianCurrency(isNegative ? -newVal : newVal)}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* Navbar / Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Your Tax Verdict</h1>
          <button 
            onClick={onRestart}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
          >
            Start Over
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Verdict Hero Card */}
        <div className={`rounded-2xl p-6 md:p-10 shadow-lg border text-center ${isNewBetter ? 'bg-green-50 border-green-200' : isOldBetter ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'}`}>
          <h2 className={`text-sm font-bold uppercase tracking-wider mb-2 ${isNewBetter ? 'text-green-600' : isOldBetter ? 'text-blue-600' : 'text-purple-600'}`}>
            Final Recommendation
          </h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            {isNewBetter && "Go with the New Regime"}
            {isOldBetter && "Stick to the Old Regime"}
            {isEqual && "Both are exactly the same"}
          </h3>
          <p className="text-xl text-gray-700">
            {isEqual ? (
              "You will pay " + formatIndianCurrency(oldRegime.totalTax) + " either way."
            ) : (
              <>You will save <strong className={isNewBetter ? 'text-green-700' : 'text-blue-700'}>{formatIndianCurrency(recommendation.savingsAmount)}</strong> this year.</>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Comparison Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Why did this happen? */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why did this happen?</h3>
              <p className="text-gray-700 leading-relaxed">
                {isNewBetter && `Even though you have ${formatIndianCurrency(oldRegime.deductions?.total || 0)} in deductions under the old regime, the new regime's lower tax rates and the ₹12 Lakh tax-free threshold make it the clear winner for you. Under the new regime, you pay zero tax up to ₹12 Lakhs!`}
                
                {isOldBetter && `Because you have high deductions (like HRA, 80C, and Home Loan) totaling ${formatIndianCurrency(oldRegime.deductions?.total || 0)}, the Old Regime is better for you. These deductions bring your taxable income down enough to beat the lower tax rates of the New Regime.`}
                
                {isEqual && `Your deductions of ${formatIndianCurrency(oldRegime.deductions?.total || 0)} under the old regime perfectly balance out the lower tax rates of the new regime.`}
              </p>
            </div>

            {/* Detailed Comparison Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 className="text-xl font-bold text-gray-900">Detailed Breakdown</h3>
              </div>
              
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  <Row label="Category" isHeader />
                  
                  {result.incomeType === 'freelance' && <Row label="Gross Receipts" oldVal={data.freelanceGrossReceipts || 0} newVal={data.freelanceGrossReceipts || 0} />}
                  {result.incomeType === 'business' && <Row label="Gross Turnover" oldVal={(data.businessTurnoverDigital || 0) + (data.businessTurnoverCash || 0)} newVal={(data.businessTurnoverDigital || 0) + (data.businessTurnoverCash || 0)} />}
                  
                  <Row label="Gross Income" oldVal={oldRegime.totalIncomeBeforeDeductions} newVal={newRegime.totalIncomeBeforeDeductions} />
                  
                  {/* Deductions block */}
                  {oldRegime.deductions.standardDeduction > 0 && (
                     <Row label="Standard Deduction" oldVal={oldRegime.deductions.standardDeduction} newVal={newRegime.deductions.standardDeduction} isNegative />
                  )}
                  {oldRegime.deductions.professionalTax > 0 && <Row label="Professional Tax" oldVal={oldRegime.deductions.professionalTax} newVal={newRegime.deductions.professionalTax} isNegative />}
                  {oldRegime.deductions.hraExemption > 0 && <Row label="HRA Exemption" oldVal={oldRegime.deductions.hraExemption} newVal={0} isNegative />}
                  {oldRegime.deductions.section24b > 0 && <Row label="Home Loan Interest (Sec 24b)" oldVal={oldRegime.deductions.section24b} newVal={0} isNegative />}
                  
                  {oldRegime.deductions.section80C > 0 && <Row label="Section 80C (PF, ELSS, etc.)" oldVal={oldRegime.deductions.section80C} newVal={0} isNegative />}
                  {oldRegime.deductions.npsEmployee_80CCD1B > 0 && <Row label="NPS Self (80CCD 1B)" oldVal={oldRegime.deductions.npsEmployee_80CCD1B} newVal={0} isNegative />}
                  {oldRegime.deductions.npsEmployer_80CCD2 > 0 && <Row label="NPS Employer (80CCD 2)" oldVal={oldRegime.deductions.npsEmployer_80CCD2} newVal={newRegime.deductions.npsEmployer_80CCD2} isNegative />}
                  {oldRegime.deductions.section80D > 0 && <Row label="Health Insurance (80D)" oldVal={oldRegime.deductions.section80D} newVal={0} isNegative />}
                  {oldRegime.deductions.interestDeduction > 0 && <Row label="Interest Income (80TTA/TTB)" oldVal={oldRegime.deductions.interestDeduction} newVal={0} isNegative />}
                  
                  <Row label="Net Taxable Income" oldVal={oldRegime.taxableIncome} newVal={newRegime.taxableIncome} isTotal />
                  
                  {/* Tax computation block */}
                  <Row label="Tax on Income Slabs" oldVal={oldRegime.taxBeforeRebate} newVal={newRegime.taxBeforeRebate} />
                  {oldRegime.rebate87A > 0 && <Row label="Section 87A Rebate" oldVal={oldRegime.rebate87A} newVal={0} isNegative />}
                  {newRegime.rebate87A > 0 && <Row label="Section 87A Rebate" oldVal={0} newVal={newRegime.rebate87A} isNegative />}
                  
                  {newRegime.marginalRelief > 0 && <Row label="Marginal Relief" oldVal={0} newVal={newRegime.marginalRelief} isNegative />}
                  
                  <Row label="Health & Education Cess (4%)" oldVal={oldRegime.cess} newVal={newRegime.cess} />
                  
                  <div className="grid grid-cols-[2fr_1fr_1fr] py-5 text-lg md:text-xl font-bold bg-gray-50 border-t border-gray-200">
                    <div className="pl-4 pr-2 text-gray-900 flex items-center uppercase tracking-wide text-sm md:text-base">Total Tax Payable</div>
                    <div className={`text-right px-4 ${isOldBetter ? 'text-blue-700' : 'text-gray-900'}`}>
                      {formatIndianCurrency(oldRegime.totalTax)}
                    </div>
                    <div className={`text-right px-4 ${isNewBetter ? 'text-green-700' : 'text-gray-900'}`}>
                      {formatIndianCurrency(newRegime.totalTax)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slab by Slab */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Slab-by-Slab Breakdown</h3>
                <button 
                  onClick={() => setShowSlabs(!showSlabs)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition px-3 py-1.5 rounded-md hover:bg-blue-50"
                >
                  {showSlabs ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
              
              {showSlabs && (
                <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-4 pb-2 border-b">Old Regime</h4>
                    <div className="space-y-3">
                      {oldRegime.slabBreakdown.map((s, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-600">{s.slab}</span>
                          <span className="text-gray-400 w-12 text-right">{s.rate * 100}%</span>
                          <span className="font-medium w-24 text-right">{formatIndianCurrency(s.tax)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-4 pb-2 border-b">New Regime</h4>
                    <div className="space-y-3">
                      {newRegime.slabBreakdown.map((s, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-600">{s.slab}</span>
                          <span className="text-gray-400 w-12 text-right">{s.rate * 100}%</span>
                          <span className="font-medium w-24 text-right">{formatIndianCurrency(s.tax)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
          </div>
          
          {/* Sidebar / Tips */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>💡</span> Personalised Tips
              </h3>
              
              {tips.length > 0 ? (
                <div className="space-y-6">
                  {tips.map((tip, i) => (
                    <div key={i} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <h4 className="font-bold text-gray-800 text-sm mb-1">{tip.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{tip.desc}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Your taxes are perfectly optimized based on your current inputs!
                </p>
              )}
            </div>
            
            <div className="bg-gray-100 rounded-2xl p-6 border border-gray-200 text-sm text-gray-600">
              <p className="mb-2"><strong>Disclaimer:</strong></p>
              <p>This is a tool to help you estimate your taxes and understand the new Budget 2025 rules. It is not financial advice.</p>
              <p className="mt-2">Always consult a qualified Chartered Accountant before filing your ITR.</p>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
