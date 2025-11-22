import { App } from "./app";
import { db } from "./data/db";
import { showNotification } from "./utils/dialogs";

(async function main() {
  try {
    await db.open();
    App.init();
  } catch (err) {
    console.error("Failed to open database: ", err);

    showNotification(
      `⚠️ Mark-as-Read extension failed to start.\n\n` +
        `Please report this issue so it can be fixed:\n` +
        `https://github.com/0nis/ao3-mark-as-read/issues\n\n` +
        `Thank you!`
    );
  }
})();
