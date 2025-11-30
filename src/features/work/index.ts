import { setupForms } from "./forms/setup";
import { setupButtons } from "./buttons/setup";

// TODO: Test EVERYTHING here
export const Work = {
  async init() {
    await setupForms();
    await setupButtons();
  },
};
