import React, { useState } from 'react';
import { formatIndianNumber, parseFormattedCurrency } from '../../utils/formatCurrency';

export default function NPSStep({ data, updateData }) {
  const [hasNPS, setHasNPS] = useState((data.employeeNPS > 0 || data.employerNPS > 0) ? true : false);
  const [inputs, setInputs] = useState({
    employee: data.employeeNPS ? formatIndianNumber(data.employeeNPS) : '',
    employer: data.employerNPS ? formatIndianNumber(data.employerNPS) : '',
  });

  const handleToggle = (val) => {
    setHasNPS(val);
    if (!val) {
      setInputs({ employee: '', employer: '' });
      updateData({ employeeNPS: 0, employerNPS: 0 });
    }
  };

  const handleChange = (field, e) => {
    const rawVal = e.target.value;
    const num = parseFormattedCurrency(rawVal);
    
    setInputs({ ...inputs, [field]: rawVal ? formatIndianNumber(num) : '' });
    updateData({ [`${field}NPS`]: num });
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Do you contribute to NPS?</h2>
      <p className="text-gray-500 text-lg mb-8">National Pension System contributions.</p>
      
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => handleToggle(true)}
          className={`flex-1 py-3 px-4 rounded-xl border font-medium transition ${hasNPS ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
        >
          Yes
        </button>
        <button 
          onClick={() => handleToggle(false)}
          className={`flex-1 py-3 px-4 rounded-xl border font-medium transition ${!hasNPS ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
        >
          No / Skip
        </button>
      </div>

      {hasNPS && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-1">Your own NPS contribution</h4>
            <p className="text-sm text-gray-500 mb-4">Under Section 80CCD(1B) — extra ₹50,000 deduction (Old Regime only)</p>
            <div className="relative rounded-md shadow-sm max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.employee}
                onChange={(e) => handleChange('employee', e)}
                className="block w-full rounded-md border-gray-300 pl-7 pr-12 py-2 sm:text-sm focus:border-blue-500 focus:ring-blue-500 border"
                placeholder="Per year"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">/ yr</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-1">Employer NPS contribution</h4>
            <p className="text-sm text-gray-500 mb-4">Under Section 80CCD(2) — deductible in <strong className="text-green-600">both regimes</strong></p>
            <div className="relative rounded-md shadow-sm max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.employer}
                onChange={(e) => handleChange('employer', e)}
                className="block w-full rounded-md border-gray-300 pl-7 pr-12 py-2 sm:text-sm focus:border-blue-500 focus:ring-blue-500 border"
                placeholder="Per year"
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
