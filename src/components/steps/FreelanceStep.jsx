import React from 'react';

export default function FreelanceStep({ data, updateData }) {
  const receipts = data.freelanceGrossReceipts || '';
  const presumptive = data.freelancePresumptive !== false; // default true

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What are your gross receipts?</h2>
        <p className="text-gray-600">This is the total amount you earned from your profession this year, before any expenses.</p>
      </div>

      <div>
        <div className="relative max-w-sm">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
          <input
            type="number"
            value={receipts}
            onChange={(e) => updateData({ freelanceGrossReceipts: Number(e.target.value) })}
            placeholder="e.g. 1500000"
            className="w-full pl-8 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={presumptive}
            onChange={(e) => updateData({ freelancePresumptive: e.target.checked })}
            className="mt-1 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <div>
            <div className="font-semibold text-gray-900">Use Presumptive Taxation (Section 44ADA)</div>
            <div className="text-sm text-gray-600 mt-1">
              Under this scheme, 50% of your gross receipts is considered as your taxable profit. You don't need to maintain detailed expense records. Highly recommended!
            </div>
          </div>
        </label>
      </div>

      {!presumptive && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Actual Expenses (₹)</label>
          <input
            type="number"
            value={data.freelanceExpenses || ''}
            onChange={(e) => updateData({ freelanceExpenses: Number(e.target.value) })}
            placeholder="e.g. 250000"
            className="w-full max-w-sm pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      )}
    </div>
  );
}
