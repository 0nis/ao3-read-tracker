import { FinishedStatus } from "../../enums/works";
import { ReadWork } from "../../types/works";

export function generateReadWorks(count: number = 100): ReadWork[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `work-${i + 1}`,
    title: `Test Read Work ${i + 1}`,
    finishedAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    rereadWorthy: Math.random() > 0.8,
    timesRead: Math.floor(Math.random() * 5) + 1,
    finishedStatus:
      Math.random() > 0.5 ? FinishedStatus.COMPLETED : FinishedStatus.ABANDONED,
  }));
}
