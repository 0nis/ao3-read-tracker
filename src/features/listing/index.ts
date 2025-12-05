import { addGlobalListener } from "../../utils/extension";
import { markWorksOnPage, updateWorksOnPage } from "./rendering/setup";

export const Listing = {
  async init(main: HTMLElement) {
    // Handles BFCache restoration (back/forward navigation)
    addGlobalListener(window, "pageshow", async (e: Event) => {
      if ((e as PageTransitionEvent).persisted) await updateWorksOnPage();
    });

    if (!main.classList.contains("works-index")) return;

    await markWorksOnPage();
  },
};
