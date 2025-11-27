import { ReadWork } from "@types";

export function generateReadWorks(count: number = 100): ReadWork[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `work-${i + 1}`,
    title: `Test Read Work ${i + 1}`,
    createdAt: Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000,
    modifiedAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    isReading: Math.random() > 0.7,
    rereadWorthy: Math.random() > 0.8,
    count: Math.floor(Math.random() * 5) + 1,
    lastReadChapter: Math.floor(Math.random() * 20),
  }));
}
