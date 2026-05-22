import { registerAuthBackground } from "../services/auth/background";
import { debug } from "../shared/extension/logger";

(async function main() {
  debug("Background script loaded.");
  registerAuthBackground();
})();
