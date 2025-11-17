import { db } from "./data/db";
import { UI } from "./ui/core";

(async function main() {
  // Entry point for the application
  await db
    .open()
    .then(() => {
      UI.init();
    })
    .catch((err) => {
      console.error("Failed to open database:", err);
    });
})();
