import { addGlobalListener } from "../../utils/extension/listeners";
import { markWorksOnPage, updateWorksOnPage } from "./rendering";

export const Listing = {
  async init(main: HTMLElement) {
    // Handles BFCache restoration (back/forward navigation)
    const handlePageShow = async (e: Event) => {
      if ((e as PageTransitionEvent).persisted) await updateWorksOnPage();
    };
    addGlobalListener(window, "pageshow", handlePageShow);

    if (!main.classList.contains("works-index")) return;

    await markWorksOnPage();
  },
};
