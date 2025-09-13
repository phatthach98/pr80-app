export function formatCurrency(amount: number, locale: string = 'vi-VN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 2,
  }).format(amount);
}
