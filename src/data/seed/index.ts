import { db } from "../db";
import { generateReadWorks } from "./readWorks";
import { generateIgnoredWorks } from "./ignoredWorks";

export async function seedDatabase() {
  await db.readWorks.bulkPut(generateReadWorks(50));
  await db.ignoredWorks.bulkPut(generateIgnoredWorks(20));
  console.log("✅ Database seeded with test data");
}
