export function formatIndianNumber(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatIndianCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  
  if (amount < 0) {
    return `-₹${Math.abs(amount).toLocaleString('en-IN')}`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function parseFormattedCurrency(value) {
  if (!value) return 0;
  // Remove all non-numeric characters except for negative sign
  const numericValue = value.replace(/[^0-9-]/g, '');
  return parseInt(numericValue, 10) || 0;
}
