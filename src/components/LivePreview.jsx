import React, { useState } from 'react';
import useTaxCalculation from '../hooks/useTaxCalculation';
import { formatIndianCurrency } from '../utils/formatCurrency';

export default function LivePreview({ data }) {
  const result = useTaxCalculation(data || {});
  const [showSlabs, setShowSlabs] = useState(false);
  
  const { oldRegime, newRegime, recommendation } = result;

  const isOldBetter = recommendation.betterRegime === 'old';
  const isNewBetter = recommendation.betterRegime === 'new';
  const isEqual = recommendation.betterRegime === 'equal';

  let recText = "Fill in your details to see what you save";
  let recColor = "bg-gray-100 text-gray-800 border-gray-200";
  
  if (data && data.grossSalary > 0) {
    if (isOldBetter) {
      recText = `✅ Old Regime saves you ${formatIndianCurrency(recommendation.savingsAmount)}`;
      recColor = "bg-blue-50 text-blue-800 border-blue-200";
    } else if (isNewBetter) {
      recText = `✅ New Regime saves you ${formatIndianCurrency(recommendation.savingsAmount)}`;
      recColor = "bg-green-50 text-green-800 border-green-200";
    } else if (isEqual) {
      recText = `⚖️ Both regimes are equal (₹0 diff)`;
      recColor = "bg-purple-50 text-purple-800 border-purple-200";
    }
  }

  // Helper for rendering rows
  const Row = ({ label, oldVal, newVal, isNegative, isTotal }) => (
    <div className={`grid grid-cols-3 py-2 text-sm ${isTotal ? 'font-bold border-t border-b border-gray-200 my-1' : 'border-b border-gray-100'}`}>
      <div className={`${isTotal ? 'text-gray-900' : 'text-gray-600'} pr-2`}>{label}</div>
      <div className={`text-right px-2 ${isTotal ? '' : isNegative && oldVal > 0 ? 'text-red-600' : ''}`}>
        {oldVal === 0 ? <span className="text-gray-400">—</span> : formatIndianCurrency(isNegative ? -oldVal : oldVal)}
      </div>
      <div className={`text-right pl-2 ${isTotal ? '' : isNegative && newVal > 0 ? 'text-red-600' : ''}`}>
        {newVal === 0 ? <span className="text-gray-400">—</span> : formatIndianCurrency(isNegative ? -newVal : newVal)}
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 h-full flex flex-col font-sans">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase">Live Estimate</h3>
      </div>
      
      {/* Recommendation Chip */}
      <div className={`px-4 py-3 rounded-lg border font-bold text-center mb-6 shadow-sm transition-colors ${recColor}`}>
        {recText}
      </div>

      {/* Income Summary (Small Card) */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="text-gray-500">Gross Income</span>
          <span className="font-bold">{formatIndianCurrency(Math.max(0, oldRegime.grossTotalIncome))}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Standard Deduction</span>
          <span className="text-red-600">{formatIndianCurrency(-75000)}</span>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="flex-grow bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="grid grid-cols-3 bg-gray-50 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right border-b border-gray-200">
          <div className="text-left px-4">Category</div>
          <div className="px-2">Old</div>
          <div className="px-4">New</div>
        </div>
        
        <div className="p-4">
          <Row label="Gross Income" oldVal={oldRegime.grossTotalIncome} newVal={newRegime.grossTotalIncome} />
          <Row label="Std Deduction" oldVal={oldRegime.deductions.standardDeduction} newVal={newRegime.deductions.standardDeduction} isNegative />
          <Row label="Prof. Tax" oldVal={oldRegime.deductions.professionalTax} newVal={newRegime.deductions.professionalTax} isNegative />
          <Row label="HRA Exemption" oldVal={oldRegime.deductions.hraExemption} newVal={0} isNegative />
          <Row label="80C Deductions" oldVal={oldRegime.deductions.section80C} newVal={0} isNegative />
          <Row label="80CCD(1B) NPS" oldVal={oldRegime.deductions.npsEmployee_80CCD1B} newVal={0} isNegative />
          <Row label="Employer NPS" oldVal={oldRegime.deductions.npsEmployer_80CCD2} newVal={newRegime.deductions.npsEmployer_80CCD2} isNegative />
          <Row label="Health (80D)" oldVal={oldRegime.deductions.section80D} newVal={0} isNegative />
          
          <Row label="Taxable Income" oldVal={oldRegime.taxableIncome} newVal={newRegime.taxableIncome} isTotal />
          
          <Row label="Tax on Slabs" oldVal={oldRegime.taxBeforeRebate} newVal={newRegime.taxBeforeRebate} />
          <Row label="87A Rebate" oldVal={oldRegime.rebate87A} newVal={newRegime.rebate87A} isNegative />
          
          {newRegime.marginalRelief > 0 && (
             <Row label="Marginal Relief" oldVal={0} newVal={newRegime.marginalRelief} isNegative />
          )}
          
          <Row label="Cess (4%)" oldVal={oldRegime.cess} newVal={newRegime.cess} />
          
          <div className="grid grid-cols-3 py-3 text-sm font-bold border-t-2 border-gray-800 mt-2">
            <div className="text-gray-900 pr-2 uppercase text-xs tracking-wider flex items-center">Total Tax</div>
            <div className={`text-right px-2 ${isOldBetter ? 'text-blue-700 bg-blue-50 py-1 rounded' : 'text-gray-900'}`}>
              {formatIndianCurrency(oldRegime.totalTax)}
            </div>
            <div className={`text-right pl-2 ${isNewBetter ? 'text-green-700 bg-green-50 py-1 rounded' : 'text-gray-900'}`}>
              {formatIndianCurrency(newRegime.totalTax)}
            </div>
          </div>
        </div>
      </div>

      {/* Slab Breakdown Toggle */}
      <button 
        onClick={() => setShowSlabs(!showSlabs)}
        className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 bg-blue-50 py-2 rounded-lg transition"
      >
        {showSlabs ? 'Hide Slab Details ▴' : 'View Slab Breakdown ▾'}
      </button>

      {/* Slab Breakdown Details */}
      {showSlabs && (
        <div className="mt-4 grid grid-cols-1 gap-4 animate-fade-in text-xs">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <h4 className="font-bold mb-2">New Regime Slabs</h4>
            {newRegime.slabBreakdown.map((s, i) => (
              <div key={i} className="flex justify-between py-1 border-b border-gray-50 last:border-0">
                <span className="text-gray-500 w-32">{s.slab}</span>
                <span className="text-gray-400 w-12 text-right">{s.rate * 100}%</span>
                <span className="font-medium w-24 text-right">{formatIndianCurrency(s.tax)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Assumptions Footer */}
      <div className="mt-8 text-xs text-gray-400">
        <p className="font-semibold mb-1">ℹ️ Assumptions:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Basic salary estimated as 40% of gross (if unknown)</li>
          <li>PF estimated at 12% of basic (if skipped)</li>
        </ul>
      </div>
    </div>
  );
}
