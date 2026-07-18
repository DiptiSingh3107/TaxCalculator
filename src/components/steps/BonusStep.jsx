import React, { useState } from 'react';
import { formatIndianNumber, parseFormattedCurrency } from '../../utils/formatCurrency';

export default function BonusStep({ data, updateData }) {
  const [hasBonus, setHasBonus] = useState(data.bonus > 0);
  const [inputValue, setInputValue] = useState(data.bonus ? formatIndianNumber(data.bonus) : '');

  const handleToggle = (val) => {
    setHasBonus(val);
    if (!val) {
      setInputValue('');
      updateData({ bonus: 0 });
    }
  };

  const handleChange = (e) => {
    const rawVal = e.target.value;
    const num = parseFormattedCurrency(rawVal);
    setInputValue(rawVal ? formatIndianNumber(num) : '');
    updateData({ bonus: num });
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Do you get any bonus or variable pay?</h2>
      <p className="text-gray-500 text-lg mb-8">Bonus is fully taxable in the year it's received.</p>
      
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => handleToggle(true)}
          className={`flex-1 py-3 px-4 rounded-xl border font-medium transition ${hasBonus ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
        >
          Yes
        </button>
        <button 
          onClick={() => handleToggle(false)}
          className={`flex-1 py-3 px-4 rounded-xl border font-medium transition ${!hasBonus ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
        >
          No / Skip
        </button>
      </div>

      {hasBonus && (
        <div className="max-w-md animate-fade-in">
          <label className="block text-sm font-medium text-gray-700 mb-2">How much bonus did you receive (or expect to receive) this financial year?</label>
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
              placeholder="e.g. 1,00,000"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <span className="text-gray-500 sm:text-sm">/ yr</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 pt-6 border-t border-gray-100">
        <details className="group">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-700 hover:text-blue-700 transition">
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">?</span>
              What if my bonus hasn't been paid yet?
            </span>
            <span className="transition group-open:rotate-180">▾</span>
          </summary>
          <div className="text-gray-600 text-sm mt-3 pl-7 bg-gray-50 p-4 rounded-lg space-y-2">
            <p>Enter your expected amount. We'll include it in your annual income.</p>
            <p><strong>Is my joining bonus taxable?</strong> Yes, all bonuses are taxable as salary.</p>
          </div>
        </details>
      </div>
    </div>
  );
}
