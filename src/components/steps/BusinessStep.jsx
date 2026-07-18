import React from 'react';

export default function BusinessStep({ data, updateData }) {
  const digital = data.businessTurnoverDigital || '';
  const cash = data.businessTurnoverCash || '';
  const presumptive = data.businessPresumptive !== false; // default true

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What is your annual turnover?</h2>
        <p className="text-gray-600">Enter the total sales/turnover of your business for the financial year.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Digital Receipts (UPI, NEFT, Cards)</label>
          <div className="relative max-w-sm">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
            <input
              type="number"
              value={digital}
              onChange={(e) => updateData({ businessTurnoverDigital: Number(e.target.value) })}
              placeholder="e.g. 2000000"
              className="w-full pl-8 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cash Receipts</label>
          <div className="relative max-w-sm">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
            <input
              type="number"
              value={cash}
              onChange={(e) => updateData({ businessTurnoverCash: Number(e.target.value) })}
              placeholder="e.g. 500000"
              className="w-full pl-8 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={presumptive}
            onChange={(e) => updateData({ businessPresumptive: e.target.checked })}
            className="mt-1 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <div>
            <div className="font-semibold text-gray-900">Use Presumptive Taxation (Section 44AD)</div>
            <div className="text-sm text-gray-600 mt-1">
              Your profit is assumed to be 6% of digital receipts and 8% of cash receipts. No need to maintain expense records!
            </div>
          </div>
        </label>
      </div>

      {!presumptive && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Actual Expenses (₹)</label>
          <input
            type="number"
            value={data.businessExpenses || ''}
            onChange={(e) => updateData({ businessExpenses: Number(e.target.value) })}
            placeholder="e.g. 1800000"
            className="w-full max-w-sm pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      )}
    </div>
  );
}
