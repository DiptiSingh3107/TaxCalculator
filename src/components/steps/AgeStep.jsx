import React from 'react';

export default function AgeStep({ data, updateData }) {
  const ageGroup = data.ageGroup || 'below60';

  const handleChange = (e) => {
    updateData({ ageGroup: e.target.value });
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">How old are you?</h2>
      <p className="text-gray-500 text-lg mb-8">Age affects the basic exemption limit under the old regime.</p>
      
      <div className="space-y-4 max-w-md">
        <label className={`block p-4 border rounded-xl cursor-pointer transition ${ageGroup === 'below60' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
          <div className="flex items-center">
            <input 
              type="radio" 
              name="ageGroup" 
              value="below60" 
              checked={ageGroup === 'below60'} 
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 font-medium text-gray-900">Under 60</span>
          </div>
        </label>
        
        <label className={`block p-4 border rounded-xl cursor-pointer transition ${ageGroup === 'senior' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
          <div className="flex items-center">
            <input 
              type="radio" 
              name="ageGroup" 
              value="senior" 
              checked={ageGroup === 'senior'} 
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 font-medium text-gray-900">60 to 79 (Senior Citizen)</span>
          </div>
        </label>
        
        <label className={`block p-4 border rounded-xl cursor-pointer transition ${ageGroup === 'superSenior' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
          <div className="flex items-center">
            <input 
              type="radio" 
              name="ageGroup" 
              value="superSenior" 
              checked={ageGroup === 'superSenior'} 
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 font-medium text-gray-900">80 or above (Super Senior Citizen)</span>
          </div>
        </label>
      </div>

      {/* FAQ Accordion */}
      <div className="mt-12 pt-6 border-t border-gray-100">
        <details className="group">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-700 hover:text-blue-700 transition">
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">?</span>
              Why does age matter for taxes?
            </span>
            <span className="transition group-open:rotate-180">▾</span>
          </summary>
          <div className="text-gray-600 text-sm mt-3 pl-7 bg-gray-50 p-4 rounded-lg space-y-2">
            <p>Under the old regime, people aged 60–79 get a higher tax-free threshold (₹3L vs ₹2.5L), and those 80+ get ₹5L. The new regime doesn't change rates with age.</p>
            <p><strong>Which date do I use?</strong> Your age as of 31st March 2026 (last day of FY 2025-26).</p>
          </div>
        </details>
      </div>
    </div>
  );
}
