import { setupForms } from "./forms/setup";
import { setupButtons } from "./buttons/setup";

// TODO: Test EVERYTHING here
export const Work = {
  async init(main: HTMLElement) {
    if (!main.classList.contains("chapters-show")) return;

    await setupForms();
    await setupButtons();
  },
};
