import React, { useState } from 'react';
import { formatIndianNumber, parseFormattedCurrency } from '../../utils/formatCurrency';

export default function SalaryStep({ data, updateData }) {
  const [inputValue, setInputValue] = useState(data.monthlySalary ? formatIndianNumber(data.monthlySalary) : '');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const rawVal = e.target.value;
    const num = parseFormattedCurrency(rawVal);
    
    setInputValue(rawVal ? formatIndianNumber(num) : '');
    
    if (num > 0 && num < 10000) {
      setError("Please enter a valid monthly salary (min ₹10,000)");
    } else if (num > 833333) {
      setError("Surcharge may apply above ₹1 crore/year. Estimates might be slightly off.");
    } else {
      setError("");
    }
    
    updateData({ monthlySalary: num, grossSalary: num * 12 }); // Simple estimate for now
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">How much money lands in your bank account every month?</h2>
      <p className="text-gray-500 text-lg mb-8">This is your salary after PF deduction and tax — what you actually receive.</p>
      
      <div className="max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">Monthly in-hand salary</label>
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
            placeholder="e.g. 65,000"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="text-gray-500 sm:text-sm">/ mo</span>
          </div>
        </div>
        {error && (
          <p className={`mt-2 text-sm ${error.includes('min') ? 'text-red-600' : 'text-orange-600'}`}>{error}</p>
        )}
      </div>

      <div className="mt-12 pt-6 border-t border-gray-100">
        <details className="group">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-700 hover:text-blue-700 transition">
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">?</span>
              What counts as "take-home"?
            </span>
            <span className="transition group-open:rotate-180">▾</span>
          </summary>
          <div className="text-gray-600 text-sm mt-3 pl-7 bg-gray-50 p-4 rounded-lg space-y-2">
            <p>The amount your employer credits to your bank account every month. Not including reimbursements, LTA paid separately, or bonuses.</p>
            <p><strong>Should I include my bonus?</strong> No — enter your regular monthly salary. We'll ask about bonuses separately.</p>
          </div>
        </details>
      </div>
    </div>
  );
}
