import React, { useState } from 'react';
import { formatIndianNumber, parseFormattedCurrency } from '../../utils/formatCurrency';

export default function ProfTaxStep({ data, updateData }) {
  const [hasPT, setHasPT] = useState(data.professionalTax > 0);
  const [inputValue, setInputValue] = useState(data.professionalTax ? formatIndianNumber(data.professionalTax) : '2,400');
  const [error, setError] = useState('');

  const handleToggle = (val) => {
    setHasPT(val);
    if (!val) {
      updateData({ professionalTax: 0 });
    } else {
      updateData({ professionalTax: parseFormattedCurrency(inputValue) });
    }
  };

  const handleChange = (e) => {
    const rawVal = e.target.value;
    const num = parseFormattedCurrency(rawVal);
    setInputValue(rawVal ? formatIndianNumber(num) : '');
    
    if (num > 2500) {
      setError("Professional Tax is typically ₹2,400/year or less");
    } else {
      setError("");
    }
    
    updateData({ professionalTax: num });
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Does your employer deduct Professional Tax?</h2>
      <p className="text-gray-500 text-lg mb-8">It's a small state-level deduction — usually ₹200/month or ₹2,400/year.</p>
      
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => handleToggle(true)}
          className={`flex-1 py-3 px-4 rounded-xl border font-medium transition ${hasPT ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
        >
          Yes
        </button>
        <button 
          onClick={() => handleToggle(false)}
          className={`flex-1 py-3 px-4 rounded-xl border font-medium transition ${!hasPT ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
        >
          No / Not Sure
        </button>
      </div>

      {hasPT && (
        <div className="max-w-md animate-fade-in">
          <label className="block text-sm font-medium text-gray-700 mb-2">How much is deducted per year?</label>
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
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <span className="text-gray-500 sm:text-sm">/ yr</span>
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
              What is Professional Tax?
            </span>
            <span className="transition group-open:rotate-180">▾</span>
          </summary>
          <div className="text-gray-600 text-sm mt-3 pl-7 bg-gray-50 p-4 rounded-lg space-y-2">
            <p>It's a small tax levied by some state governments (Maharashtra, Karnataka, etc.), not by the central government. It reduces your taxable income.</p>
            <p><strong>My state doesn't have Professional Tax.</strong> Select "No". States like Delhi, Rajasthan, UP don't levy it.</p>
          </div>
        </details>
      </div>
    </div>
  );
}
