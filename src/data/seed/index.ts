import { db } from "../db";
import { generateFinishedWorks } from "./finishedWorks";
import { generateIgnoredWorks } from "./ignoredWorks";
import { generateInProgressWorks } from "./inProgressWorks";
import { info } from "../../shared/extension/logger";

export async function seedDatabase() {
  await db.finishedWorks.bulkPut(generateFinishedWorks(50));
  await db.ignoredWorks.bulkPut(generateIgnoredWorks(20));
  await db.inProgressWorks.bulkPut(generateInProgressWorks(30));
  info("✅ Database seeded with test data");
}
