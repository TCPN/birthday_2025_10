export function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
}

export function randomChoice<T>(items: T[]): T | undefined {
  return items[randomInt(0, items.length)];
}

export function randomIndexWithProbTable(probabilities: number[]): number {
  const total = probabilities.reduce((acc, p) => acc + p, 0);
  const rand = Math.random() * total;
  let cumulative = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulative += (probabilities[i] || 0);
    if (rand < cumulative) {
      return i;
    }
  }
  return -1;
}

export function randomString(length: number, charset = '0123456789abcdef'): string {
  return Array.from({ length }, () => randomChoice(charset as unknown as string[])).join('');
}
