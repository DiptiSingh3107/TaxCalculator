import React, { useState } from 'react';
import { formatIndianNumber, parseFormattedCurrency } from '../../utils/formatCurrency';

export default function PFStep({ data, updateData }) {
  const [hasPF, setHasPF] = useState(data.pfDeduction > 0);
  const [isNotSure, setIsNotSure] = useState(false);
  const estimatedPF = (data.grossSalary || 0) * 0.40 * 0.12 / 12; // 12% of basic (estimated at 40% of gross) per month
  
  const [inputValue, setInputValue] = useState(data.pfDeduction ? formatIndianNumber(data.pfDeduction) : '');
  const [error, setError] = useState('');

  const handleToggle = (val, notSure = false) => {
    setHasPF(val);
    setIsNotSure(notSure);
    if (!val) {
      setInputValue('');
      updateData({ pfDeduction: 0 });
    } else if (notSure) {
      const annualPF = estimatedPF * 12;
      setInputValue(formatIndianNumber(Math.round(estimatedPF)));
      updateData({ pfDeduction: Math.round(estimatedPF), total80C: (data.total80C || 0) + annualPF });
    }
  };

  const handleChange = (e) => {
    const rawVal = e.target.value;
    const num = parseFormattedCurrency(rawVal);
    setInputValue(rawVal ? formatIndianNumber(num) : '');
    
    if (num > 10000) {
      setError("PF is usually 12% of your basic salary. Double-check?");
    } else {
      setError("");
    }
    
    updateData({ pfDeduction: num, total80C: num * 12 }); // Automatically add to 80C
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Does your company deduct PF (Provident Fund)?</h2>
      <p className="text-gray-500 text-lg mb-8">Most employers with 20+ employees do this automatically.</p>
      
      <div className="flex gap-2 sm:gap-4 mb-8 flex-wrap">
        <button 
          onClick={() => handleToggle(true, false)}
          className={`flex-1 py-3 px-2 sm:px-4 rounded-xl border font-medium transition whitespace-nowrap ${hasPF && !isNotSure ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
        >
          Yes
        </button>
        <button 
          onClick={() => handleToggle(false, false)}
          className={`flex-1 py-3 px-2 sm:px-4 rounded-xl border font-medium transition whitespace-nowrap ${!hasPF && !isNotSure ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
        >
          No
        </button>
        <button 
          onClick={() => handleToggle(true, true)}
          className={`flex-1 py-3 px-2 sm:px-4 rounded-xl border font-medium transition whitespace-nowrap ${isNotSure ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
        >
          I'm not sure
        </button>
      </div>

      {hasPF && (
        <div className="max-w-md animate-fade-in">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isNotSure ? "We've estimated this amount. Feel free to correct it." : "How much PF is deducted from your salary each month?"}
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-gray-500 sm:text-lg">₹</span>
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={handleChange}
              className="block w-full rounded-lg border-gray-300 pl-8 pr-12 py-3 text-lg focus:border-blue-500 focus:ring-blue-500 border"
              placeholder="e.g. 1,800"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <span className="text-gray-500 sm:text-sm">/ mo</span>
            </div>
          </div>
          {error && <p className="mt-2 text-sm text-orange-600">{error}</p>}
        </div>
      )}

      <div className="mt-12 pt-6 border-t border-gray-100">
        <details className="group">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-700 hover:text-blue-700 transition">
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">?</span>
              What is PF?
            </span>
            <span className="transition group-open:rotate-180">▾</span>
          </summary>
          <div className="text-gray-600 text-sm mt-3 pl-7 bg-gray-50 p-4 rounded-lg space-y-2">
            <p>Your employer deducts 12% of your basic salary and deposits it in your EPF account. Your employer also contributes 12% on top (you don't see that in your take-home).</p>
            <p><strong>Is PF deductible from tax?</strong> Yes, your own PF contribution counts toward the ₹1.5L limit under Section 80C — but only in the old regime.</p>
          </div>
        </details>
      </div>
    </div>
  );
}
