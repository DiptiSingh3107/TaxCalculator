import React, { useMemo } from 'react';
import { calculateTaxes } from '../engine/taxCalculator';

export default function DebugEngine() {
  const testCases = useMemo(() => {
    return [
      {
        name: 'Basic ₹8L no deductions',
        inputs: { grossSalary: 800000 }
      },
      {
        name: '₹12L, full 80C + HRA ₹1.2L',
        inputs: { grossSalary: 1200000, total80C: 150000, actualHRAReceived: 120000, actualRentPaid: 200000, basicSalary: 600000 }
      },
      {
        name: '₹15L, no deductions',
        inputs: { grossSalary: 1500000 }
      },
      {
        name: '₹12.75L salaried',
        inputs: { grossSalary: 1275000 }
      },
      {
        // To get taxable 12.1L in new regime, gross should be 12.1L + 75k (sd) = 12.85L
        name: '₹12,10,000 taxable new regime',
        inputs: { grossSalary: 1285000 }
      },
      {
        name: 'Senior citizen ₹5L',
        inputs: { grossSalary: 500000, ageGroup: 'senior' }
      }
    ].map(tc => {
      const result = calculateTaxes(tc.inputs);
      return {
        ...tc,
        oldTax: result.oldRegime.totalTax,
        newTax: result.newRegime.totalTax,
        recommendation: result.recommendation.betterRegime,
        marginalRelief: result.newRegime.marginalRelief
      };
    });
  }, []);

  return (
    <div className="p-4 m-4 bg-gray-100 rounded border border-gray-300 text-sm font-mono">
      <h3 className="font-bold text-lg mb-2">Engine Debug Tests</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Test Case</th>
            <th className="border-b p-2">Old Tax</th>
            <th className="border-b p-2">New Tax</th>
            <th className="border-b p-2">Recommendation</th>
            <th className="border-b p-2">Marginal Relief (New)</th>
          </tr>
        </thead>
        <tbody>
          {testCases.map((tc, idx) => (
            <tr key={idx}>
              <td className="border-b p-2">{tc.name}</td>
              <td className="border-b p-2">₹{tc.oldTax}</td>
              <td className="border-b p-2">₹{tc.newTax}</td>
              <td className="border-b p-2">{tc.recommendation}</td>
              <td className="border-b p-2">₹{tc.marginalRelief}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
