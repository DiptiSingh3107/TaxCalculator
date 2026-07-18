import React, { useState } from 'react';
import { formatIndianNumber, parseFormattedCurrency } from '../../utils/formatCurrency';

export default function HealthStep({ data, updateData }) {
  const [hasHealth, setHasHealth] = useState((data.healthPremiumSelf > 0 || data.healthPremiumParents > 0) ? true : false);
  const [hasParents, setHasParents] = useState(data.healthPremiumParents > 0 ? true : false);
  const [isParentsSenior, setIsParentsSenior] = useState(data.isParentsSenior || false);

  const [inputs, setInputs] = useState({
    self: data.healthPremiumSelf ? formatIndianNumber(data.healthPremiumSelf) : '',
    parents: data.healthPremiumParents ? formatIndianNumber(data.healthPremiumParents) : '',
  });

  const handleToggle = (val) => {
    setHasHealth(val);
    if (!val) {
      setHasParents(false);
      setIsParentsSenior(false);
      setInputs({ self: '', parents: '' });
      updateData({ healthPremiumSelf: 0, healthPremiumParents: 0, isParentsSenior: false });
    }
  };

  const handleParentsToggle = (val) => {
    setHasParents(val);
    if (!val) {
      setIsParentsSenior(false);
      setInputs({ ...inputs, parents: '' });
      updateData({ healthPremiumParents: 0, isParentsSenior: false });
    }
  };

  const handleSeniorToggle = (val) => {
    setIsParentsSenior(val);
    updateData({ isParentsSenior: val });
  };

  const handleChange = (field, e) => {
    const rawVal = e.target.value;
    const num = parseFormattedCurrency(rawVal);
    
    setInputs({ ...inputs, [field]: rawVal ? formatIndianNumber(num) : '' });
    
    if (field === 'self') updateData({ healthPremiumSelf: num });
    if (field === 'parents') updateData({ healthPremiumParents: num });
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Do you pay for health insurance?</h2>
      <p className="text-gray-500 text-lg mb-8">The premium you pay for yourself, spouse, children, or parents.</p>
      
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => handleToggle(true)}
          className={`flex-1 py-3 px-4 rounded-xl border font-medium transition ${hasHealth ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
        >
          Yes
        </button>
        <button 
          onClick={() => handleToggle(false)}
          className={`flex-1 py-3 px-4 rounded-xl border font-medium transition ${!hasHealth ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
        >
          No / Skip
        </button>
      </div>

      {hasHealth && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-1">Premium for yourself, spouse, and children</h4>
            <p className="text-sm text-gray-500 mb-4">You can claim up to ₹25,000 here (₹50,000 if you're a senior citizen)</p>
            <div className="relative rounded-md shadow-sm max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={inputs.self}
                onChange={(e) => handleChange('self', e)}
                className="block w-full rounded-md border-gray-300 pl-7 pr-12 py-2 sm:text-sm focus:border-blue-500 focus:ring-blue-500 border"
                placeholder="Per year"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">/ yr</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-4">Do you also pay health insurance for your parents?</h4>
            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => handleParentsToggle(true)}
                className={`py-2 px-6 rounded-lg border font-medium transition ${hasParents ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                Yes
              </button>
              <button 
                onClick={() => handleParentsToggle(false)}
                className={`py-2 px-6 rounded-lg border font-medium transition ${!hasParents ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                No
              </button>
            </div>
            
            {hasParents && (
              <div className="animate-fade-in border-t border-gray-100 pt-4">
                <h4 className="font-bold text-gray-800 mb-2">Are your parents senior citizens (60+)?</h4>
                <div className="flex gap-4 mb-6">
                  <button 
                    onClick={() => handleSeniorToggle(true)}
                    className={`py-1 px-4 rounded-lg border text-sm font-medium transition ${isParentsSenior ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    Yes (60+)
                  </button>
                  <button 
                    onClick={() => handleSeniorToggle(false)}
                    className={`py-1 px-4 rounded-lg border text-sm font-medium transition ${!isParentsSenior ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    No (Under 60)
                  </button>
                </div>
                
                <h4 className="font-bold text-gray-800 mb-1">Premium for parents</h4>
                <p className="text-sm text-gray-500 mb-4">You can claim up to ₹{isParentsSenior ? '50,000' : '25,000'}</p>
                <div className="relative rounded-md shadow-sm max-w-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={inputs.parents}
                    onChange={(e) => handleChange('parents', e)}
                    className="block w-full rounded-md border-gray-300 pl-7 pr-12 py-2 sm:text-sm focus:border-blue-500 focus:ring-blue-500 border"
                    placeholder="Per year"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">/ yr</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
