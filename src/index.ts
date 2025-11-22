import { App } from "./app";
import { db } from "./data/db";
import { reportExtensionFailure } from "./utils/dialogs";

(async function main() {
  try {
    await db.open();
    App.init();
  } catch (err) {
    reportExtensionFailure(
      "⚠️ Extension %name% (v%version%) failed to start! ⚠️",
      err
    );
  }
})();
