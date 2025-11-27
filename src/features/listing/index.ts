import { markWorksOnPage, updateWorksOnPage } from "./rendering";

export const Listing = {
  async init() {
    await markWorksOnPage();

    // Handles BFCache restoration (back/forward navigation)
    window.addEventListener("pageshow", async (e) => {
      if (e.persisted) await updateWorksOnPage();
    });
  },
};
