import { markFicsOnPage, updateFicsOnPage } from "./rendering";

export const Listing = {
  async init() {
    await markFicsOnPage();

    // Handles BFCache restoration (back/forward navigation)
    window.addEventListener("pageshow", async (e) => {
      if (e.persisted) await updateFicsOnPage();
    });
  },
};
