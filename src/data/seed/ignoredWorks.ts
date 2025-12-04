import { IgnoredWork } from "../../types/works";

export function generateIgnoredWorks(count: number = 100): IgnoredWork[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `work-${i + 1}`,
    title: `Test Ignored Work ${i + 1}`,
    ignoredAt: Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000,
    reason: Math.random() > 0.5 ? "Not interested" : undefined,
  }));
}
