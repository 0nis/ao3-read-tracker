import { registerAuthBackground } from "../services/auth/background";
import { registerBackupBackground } from "../services/backup/background";
import { debug } from "../shared/extension/logger";

(async function main() {
  debug("Background script successfully loaded!");
  registerAuthBackground();
  registerBackupBackground();
})();
