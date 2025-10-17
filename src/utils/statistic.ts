export function sum(numbers: number[]): number {
  return numbers.reduce((acc, val) => acc + val, 0);
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
}
