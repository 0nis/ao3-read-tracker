import { db } from "../db";
import { generateReadWorks } from "./readWorks";
import { generateIgnoredWorks } from "./ignoredWorks";
import { info } from "../../utils/extension/console";

export async function seedDatabase() {
  await db.readWorks.bulkPut(generateReadWorks(50));
  await db.ignoredWorks.bulkPut(generateIgnoredWorks(20));
  info("✅ Database seeded with test data");
}
