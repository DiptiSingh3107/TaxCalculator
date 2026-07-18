import React, { useState } from 'react';
import { formatIndianNumber, parseFormattedCurrency } from '../../utils/formatCurrency';

export default function RentStep({ data, updateData }) {
  const [paysRent, setPaysRent] = useState(!!data.actualRentPaid);
  
  const [rentInput, setRentInput] = useState(data.actualRentPaid ? formatIndianNumber(data.actualRentPaid / 12) : '');
  const [isMetro, setIsMetro] = useState(data.isMetro || false);
  
  const [receivesHRA, setReceivesHRA] = useState(data.actualHRAReceived !== undefined ? (data.actualHRAReceived > 0 ? 'yes' : 'no') : '');
  const [hraInput, setHraInput] = useState(data.actualHRAReceived ? formatIndianNumber(data.actualHRAReceived / 12) : '');
  
  const estimatedBasic = (data.grossSalary || 0) * 0.40;
  const estimatedHRA = estimatedBasic * 0.40;

  const handleRentToggle = (val) => {
    setPaysRent(val);
    if (!val) {
      updateData({ actualRentPaid: 0, actualHRAReceived: 0, isMetro: false });
      setRentInput('');
      setReceivesHRA('');
      setHraInput('');
    }
  };

  const handleRentChange = (e) => {
    const rawVal = e.target.value;
    const num = parseFormattedCurrency(rawVal);
    setRentInput(rawVal ? formatIndianNumber(num) : '');
    updateData({ actualRentPaid: num * 12 });
  };
  
  const handleMetroToggle = (val) => {
    setIsMetro(val);
    updateData({ isMetro: val });
  };

  const handleHRAToggle = (val) => {
    setReceivesHRA(val);
    if (val === 'no') {
      setHraInput('');
      updateData({ actualHRAReceived: 0 });
    } else if (val === 'not_sure') {
      // Estimate HRA as 40% of basic
      setHraInput(formatIndianNumber(Math.round(estimatedHRA / 12)));
      updateData({ actualHRAReceived: Math.round(estimatedHRA) });
    }
  };

  const handleHRAChange = (e) => {
    const rawVal = e.target.value;
    const num = parseFormattedCurrency(rawVal);
    setHraInput(rawVal ? formatIndianNumber(num) : '');
    updateData({ actualHRAReceived: num * 12 });
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Do you pay rent for where you live?</h2>
      <p className="text-gray-500 text-lg mb-8">This determines your HRA exemption under the old regime.</p>
      
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => handleRentToggle(true)}
          className={`flex-1 py-3 px-4 rounded-xl border font-medium transition ${paysRent ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
        >
          Yes
        </button>
        <button 
          onClick={() => handleRentToggle(false)}
          className={`flex-1 py-3 px-4 rounded-xl border font-medium transition ${!paysRent ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
        >
          No
        </button>
      </div>

      {paysRent && (
        <div className="space-y-8 animate-fade-in">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">How much rent do you pay per month?</label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-gray-500 sm:text-lg">₹</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={rentInput}
                onChange={handleRentChange}
                className="block w-full rounded-lg border-gray-300 pl-8 pr-12 py-3 text-lg focus:border-blue-500 focus:ring-blue-500 border"
                placeholder="e.g. 20,000"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <span className="text-gray-500 sm:text-sm">/ mo</span>
              </div>
            </div>
          </div>
          
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">Which city do you live in?</label>
            <div className="flex gap-4">
              <button 
                onClick={() => handleMetroToggle(true)}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm transition ${isMetro ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                Metro<br/><span className="text-xs font-normal text-gray-500">(Delhi, Mumbai, Kolkata, Chennai)</span>
              </button>
              <button 
                onClick={() => handleMetroToggle(false)}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm transition ${!isMetro ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                Non-Metro<br/><span className="text-xs font-normal text-gray-500">(Other cities)</span>
              </button>
            </div>
          </div>
          
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">Does your employer give you HRA (House Rent Allowance)?</label>
            <div className="flex gap-2 flex-wrap mb-4">
              <button 
                onClick={() => handleHRAToggle('yes')}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition ${receivesHRA === 'yes' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                Yes
              </button>
              <button 
                onClick={() => handleHRAToggle('no')}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition ${receivesHRA === 'no' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                No
              </button>
              <button 
                onClick={() => handleHRAToggle('not_sure')}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition ${receivesHRA === 'not_sure' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                Not Sure
              </button>
            </div>
            
            {(receivesHRA === 'yes' || receivesHRA === 'not_sure') && (
              <div className="animate-fade-in mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {receivesHRA === 'not_sure' ? 'Estimated HRA (40% of basic)' : 'How much HRA per month?'}
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="text-gray-500 sm:text-lg">₹</span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={hraInput}
                    onChange={handleHRAChange}
                    className="block w-full rounded-lg border-gray-300 pl-8 pr-12 py-3 text-lg focus:border-blue-500 focus:ring-blue-500 border"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-gray-500 sm:text-sm">/ mo</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-12 pt-6 border-t border-gray-100">
        <details className="group">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-700 hover:text-blue-700 transition">
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">?</span>
              What is HRA?
            </span>
            <span className="transition group-open:rotate-180">▾</span>
          </summary>
          <div className="text-gray-600 text-sm mt-3 pl-7 bg-gray-50 p-4 rounded-lg space-y-2">
            <p>It's the rent allowance your employer pays you. If you pay rent AND receive HRA, you get a tax exemption under the old regime.</p>
            <p><strong>Note:</strong> HRA exemption is NOT available under the new regime.</p>
          </div>
        </details>
      </div>
    </div>
  );
}
