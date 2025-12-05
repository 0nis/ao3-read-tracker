import { ReadingStatus } from "../../enums/works";
import { InProgressWork } from "../../types/works";

export function generateInProgressWorks(count: number = 100): InProgressWork[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `work-${i + 1}`,
    title: `Test In Progress Work ${i + 1}`,
    lastReadAt: Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000,
    startedAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    lastReadChapter: Math.floor(Math.random() * 20),
    readingStatus: [
      ReadingStatus.ACTIVE,
      ReadingStatus.WAITING,
      ReadingStatus.PAUSED,
    ][Math.floor(Math.random() * 3)],
  }));
}
