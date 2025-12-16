import { FinishedStatus } from "../../enums/works";
import { FinishedWork } from "../../types/works";

export function generateFinishedWorks(count: number = 100): FinishedWork[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `work-${i + 1}`,
    title: `Test Finished Work ${i + 1}`,
    finishedAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    rereadWorthy: Math.random() > 0.8,
    timesRead: Math.floor(Math.random() * 5) + 1,
    finishedStatus:
      Math.random() > 0.5
        ? FinishedStatus.COMPLETED
        : Math.random() > 0.5
        ? FinishedStatus.DROPPED
        : FinishedStatus.DORMANT,
  }));
}
