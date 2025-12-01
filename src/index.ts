import { App } from "./app";
import { db } from "./data/db";
import { reportExtensionFailure } from "./utils/ui/dialogs";

(async function main() {
  try {
    await db.open();
  } catch (err) {
    reportExtensionFailure(
      "⚠️ Extension %name% (v%version%) failed to start! ⚠️",
      err
    );
    return;
  }
  try {
    await App.init();
  } catch (err) {
    reportExtensionFailure(
      "⚠️ An unknown error occurred in extension %name% (v%version%)! The extension may not work as expected. ⚠️",
      err
    );
    return;
  }
})();
