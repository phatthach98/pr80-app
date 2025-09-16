export function formatCurrency(amount: number | string, locale: string = 'vi-VN'): string {
  const amountNumber = typeof amount === 'string' ? Number(amount) : amount;

  if (isNaN(amountNumber)) {
    return '0';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 2,
  }).format(amountNumber);
}
