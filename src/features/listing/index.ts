import { markWorksOnPage, updateWorksOnPage } from "./rendering";

export const Listing = {
  async init(main: HTMLElement) {
    // Handles BFCache restoration (back/forward navigation)
    window.addEventListener("pageshow", async (e) => {
      if (e.persisted) await updateWorksOnPage();
    });

    if (!main.classList.contains("works-index")) return;

    await markWorksOnPage();
  },
};
