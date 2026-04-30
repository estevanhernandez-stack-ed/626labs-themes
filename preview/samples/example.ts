// 626 Labs — sample TypeScript surface for the theme preview.
// Cyan owns logic. Magenta owns control flow. Green owns content.

import { readFileSync } from 'node:fs';
import type { Project } from './types';

const BRAND = {
  cyan: '#17d4fa',
  magenta: '#f22f89',
  navy: '#0a1524',
} as const;

interface DecisionLog {
  readonly id: string;
  readonly project: Project | null;
  readonly stakes: 'low' | 'medium' | 'high';
  tags: string[];
  notes?: string;
}

class Architect {
  private readonly history: DecisionLog[] = [];

  constructor(private readonly storagePath: string) {}

  log(entry: Omit<DecisionLog, 'id'>): DecisionLog {
    const id = crypto.randomUUID();
    const next: DecisionLog = { id, ...entry };
    this.history.push(next);
    return next;
  }

  recent(limit = 10): DecisionLog[] {
    return this.history.slice(-limit).reverse();
  }

  async hydrate(): Promise<number> {
    const raw = readFileSync(this.storagePath, 'utf8');
    const parsed = JSON.parse(raw) as DecisionLog[];
    for (const entry of parsed) {
      if (entry.stakes === 'high') {
        console.warn(`high-stakes: ${entry.id}`);
      }
      this.history.push(entry);
    }
    return parsed.length;
  }
}

export async function main(): Promise<void> {
  const arch = new Architect('./decisions.json');
  const count = await arch.hydrate();
  console.log(`hydrated ${count} decisions, brand=${BRAND.cyan}`);
}

main().catch((err) => {
  console.error('failed to start:', err);
  process.exit(1);
});
