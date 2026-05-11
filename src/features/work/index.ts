import { setupForms } from "./forms/setup";
import { setupButtons } from "./buttons/setup";
import { setupWorkMetaAreas } from "./meta/setup";

export const Work = {
  async init(main: HTMLElement) {
    if (
      !main.classList.contains("chapters-show") &&
      !main.classList.contains("works-show")
    )
      return;

    await setupForms();
    await setupButtons();
    await setupWorkMetaAreas();
  },
};
