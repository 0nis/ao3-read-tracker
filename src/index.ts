console.log("Starting Ao3 Mark As Read extension...");
import { db } from "./data/db";
import { reportExtensionFailure } from "@utils/ui";

import { App } from "./app";

(async function main() {
  try {
    console.log("Opening database...");
    await db.open();
    await App.init();
  } catch (err) {
    reportExtensionFailure(
      "⚠️ Extension %name% (v%version%) failed to start! ⚠️",
      err
    );
  }
})();
