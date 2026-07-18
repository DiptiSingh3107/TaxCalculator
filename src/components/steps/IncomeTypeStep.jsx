import React from 'react';

export default function IncomeTypeStep({ data, updateData }) {
  const types = [
    { id: 'salary', title: 'Salaried Employee', desc: 'You receive a monthly salary from an employer.' },
    { id: 'freelance', title: 'Freelancer / Professional', desc: 'Consultant, doctor, lawyer, or independent contractor.' },
    { id: 'business', title: 'Business Owner', desc: 'You run a shop, trade, or manufacturing business.' }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What is your primary source of income?</h2>
        <p className="text-gray-600">Select the one that brings in the most income. We'll adjust the tax rules accordingly.</p>
      </div>

      <div className="space-y-3">
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => updateData({ incomeType: t.id })}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
              data.incomeType === t.id
                ? 'border-blue-600 bg-blue-50/50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">{t.title}</div>
                <div className="text-sm text-gray-500 mt-1">{t.desc}</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                data.incomeType === t.id ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
              }`}>
                {data.incomeType === t.id && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {!data.incomeType && (
         <div className="text-amber-600 bg-amber-50 p-3 rounded-lg text-sm mt-4">
           Please select an income type to continue.
         </div>
      )}
    </div>
  );
}
