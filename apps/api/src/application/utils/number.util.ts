export function parseDecimalSafely(price: string | null): number {
  if (!price) return 0;
  const parsed = parseFloat(price);
  if (isNaN(parsed)) {
    throw new Error(`Invalid number: ${price}`);
  }
  return parsed;
}
