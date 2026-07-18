import React, { useState, useEffect } from 'react';
import { formatIndianNumber, parseFormattedCurrency } from '../../utils/formatCurrency';

const InvestInput = ({ label, field, placeholder, inputs, handleChange }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 py-3 last:border-0">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative rounded-md shadow-sm w-full sm:w-48">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-gray-500 sm:text-sm">₹</span>
      </div>
      <input
        type="text"
        inputMode="numeric"
        value={inputs[field]}
        onChange={(e) => handleChange(field, e)}
        className="block w-full rounded-md border-gray-300 pl-7 pr-3 py-2 sm:text-sm focus:border-blue-500 focus:ring-blue-500 border"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default function InvestmentsStep({ data, updateData }) {
  const [hasInvestments, setHasInvestments] = useState((data.total80C && data.total80C > 0) ? true : false);
  const [inputs, setInputs] = useState({
    ppf: data.investments_ppf || '',
    elss: data.investments_elss || '',
    lic: data.investments_lic || '',
    other: data.investments_other || '',
  });
  
  // We already have PF from previous step
  const pfContribution = data.pfDeduction ? data.pfDeduction * 12 : 0;
  
  useEffect(() => {
    // If PF > 0, they inherently have 80C investments, so toggle "Yes"
    if (pfContribution > 0) {
      setHasInvestments(true);
    }
  }, [pfContribution]);

  const handleToggle = (val) => {
    setHasInvestments(val);
    if (!val) {
      setInputs({ ppf: '', elss: '', lic: '', other: '' });
      updateData({ 
        investments_ppf: 0, investments_elss: 0, investments_lic: 0, investments_other: 0,
        total80C: pfContribution // Reset to just PF
      });
    }
  };

  const handleChange = (field, e) => {
    const rawVal = e.target.value;
    const num = parseFormattedCurrency(rawVal);
    
    const newInputs = { ...inputs, [field]: rawVal ? formatIndianNumber(num) : '' };
    setInputs(newInputs);
    
    // Calculate new total
    const ppf = parseFormattedCurrency(newInputs.ppf);
    const elss = parseFormattedCurrency(newInputs.elss);
    const lic = parseFormattedCurrency(newInputs.lic);
    const other = parseFormattedCurrency(newInputs.other);
    
    const newTotal = pfContribution + ppf + elss + lic + other;
    
    updateData({
      [`investments_${field}`]: num,
      total80C: newTotal
    });
  };

  const total = pfContribution + parseFormattedCurrency(inputs.ppf) + parseFormattedCurrency(inputs.elss) + parseFormattedCurrency(inputs.lic) + parseFormattedCurrency(inputs.other);

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Do you invest in tax-saving options (Section 80C)?</h2>
      <p className="text-gray-500 text-lg mb-8">Things like PPF, ELSS, Life Insurance, or Kids' tuition fees.</p>
      
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => handleToggle(true)}
          className={`flex-1 py-3 px-4 rounded-xl border font-medium transition ${hasInvestments ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
        >
          Yes
        </button>
        <button 
          onClick={() => handleToggle(false)}
          className={`flex-1 py-3 px-4 rounded-xl border font-medium transition ${!hasInvestments ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
        >
          No / Skip
        </button>
      </div>

      {hasInvestments && (
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm animate-fade-in">
          
          {(!data.incomeType || data.incomeType === 'salary') && (
            <div className="flex justify-between items-center py-3 border-b border-gray-200 bg-gray-50 px-3 rounded-md mb-2">
              <span className="text-sm font-medium text-gray-700">EPF (Auto-filled from earlier)</span>
              <span className="font-semibold text-gray-900">₹{formatIndianNumber(pfContribution)}</span>
            </div>
          )}

          <InvestInput label="PPF (Public Provident Fund)" field="ppf" placeholder="e.g. 50,000" inputs={inputs} handleChange={handleChange} />
          <InvestInput label="ELSS Mutual Funds" field="elss" placeholder="e.g. 25,000" inputs={inputs} handleChange={handleChange} />
          <InvestInput label="Life Insurance Premium" field="lic" placeholder="e.g. 15,000" inputs={inputs} handleChange={handleChange} />
          <InvestInput label="Other (Tuition, NSC, 5yr FD, etc.)" field="other" placeholder="e.g. 10,000" inputs={inputs} handleChange={handleChange} />
          
          <div className="mt-4 pt-4 border-t-2 border-gray-100 flex justify-between items-center">
            <span className="font-bold text-gray-800">Total 80C</span>
            <div className="text-right">
              <span className={`text-lg font-bold ${total > 150000 ? 'text-orange-600' : 'text-blue-700'}`}>
                ₹{formatIndianNumber(total)}
              </span>
              <div className="text-xs text-gray-500">Max limit: ₹1,50,000</div>
            </div>
          </div>
          {total > 150000 && (
            <p className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
              You've entered more than ₹1.5L — only ₹1.5L will be counted towards tax deduction.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
