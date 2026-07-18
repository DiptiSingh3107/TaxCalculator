import { useMemo } from 'react';
import { calculateTaxes } from '../engine/taxCalculator';

export default function useTaxCalculation(formData) {
  const result = useMemo(() => {
    return calculateTaxes(formData);
  }, [formData]);

  return result;
}
