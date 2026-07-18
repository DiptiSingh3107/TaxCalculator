import React, { useState } from 'react';
import { formatIndianNumber, parseFormattedCurrency } from '../../utils/formatCurrency';

export default function InterestStep({ data, updateData }) {
  const [hasInterest, setHasInterest] = useState((data.savingsInterest > 0 || data.fdInterest > 0) ? true : false);
  const [inputs, setInputs] = useState({
    savings: data.savingsInterest ? formatIndianNumber(data.savingsInterest) : '',
    fd: data.fdInterest ? formatIndianNumber(data.fdInterest) : '',
  });

  const handleToggle = (val) => {
    setHasInterest(val);
    if (!val) {
      setInputs({ savings: '', fd: '' });
      updateData({ savingsInterest: 0, fdInterest: 0 });
    }
  };

  const handleChange = (field, e) => {
    const rawVal = e.target.value;
    const num = parseFormattedCurrency(rawVal);
    
    setInputs({ ...inputs, [field]: rawVal ? formatIndianNumber(num) : '' });
    updateData({ [`${field}Interest`]: num });
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Do you earn interest from savings or FDs?</h2>
      <p className="text-gray-500 text-lg mb-8">This is optional but helps us be more accurate.</p>
      
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => handleToggle(true)}
          className={`flex-1 py-3 px-4 rounded-xl border font-medium transition ${hasInterest ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
        >
          Yes
        </button>
        <button 
          onClick={() => handleToggle(false)}
          className={`flex-1 py-3 px-4 rounded-xl border font-medium transition ${!hasInterest ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
        >
          No / Skip
        </button>
      </div>

      {hasInterest && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-1">Savings account interest</h4>
            <p className="text-sm text-gray-500 mb-4">Up to ₹10,000 is deductible under 80TTA (Old Regime)</p>
            <div className="relative rounded-md shadow-sm max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.savings}
                onChange={(e) => handleChange('savings', e)}
                className="block w-full rounded-md border-gray-300 pl-7 pr-12 py-2 sm:text-sm focus:border-blue-500 focus:ring-blue-500 border"
                placeholder="Per year (optional)"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">/ yr</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-1">FD / RD / other deposit interest</h4>
            <p className="text-sm text-gray-500 mb-4">Senior citizens can deduct up to ₹50,000 across Savings + FDs under 80TTB</p>
            <div className="relative rounded-md shadow-sm max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.fd}
                onChange={(e) => handleChange('fd', e)}
                className="block w-full rounded-md border-gray-300 pl-7 pr-12 py-2 sm:text-sm focus:border-blue-500 focus:ring-blue-500 border"
                placeholder="Per year (optional)"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">/ yr</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
