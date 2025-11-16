import { markFicsOnPage, updateFicsOnPage } from "./rendering";
import { addListingStyles } from "./style";

export const Listing = {
  async init() {
    addListingStyles();
    await markFicsOnPage();

    // Handles BFCache restoration (back/forward navigation)
    window.addEventListener("pageshow", async (e) => {
      if (e.persisted) await updateFicsOnPage();
    });
  },
};
