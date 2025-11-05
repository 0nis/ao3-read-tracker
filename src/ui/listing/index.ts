import { markFicsOnPage } from "./renderer";

export const Listing = {
  async init() {
    await markFicsOnPage();

    const observer = new MutationObserver(() => {
      markFicsOnPage();
    });

    observer.observe(document.getElementById("main")!, {
      childList: true,
      subtree: true,
    });
  },
};
