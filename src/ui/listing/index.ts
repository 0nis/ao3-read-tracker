import { markFicsOnPage } from "./rendering";
import { addListingStyles } from "./style";

export const Listing = {
  async init() {
    addListingStyles();
    await markFicsOnPage();

    // TODO: Check if MutationObserver is necessary
    // TODO: Trigger a markFicsOnPage call when navigated back
    // That requires an explicit reload at the moment

    // const observer = new MutationObserver(() => {
    //   markFicsOnPage();
    // });

    // observer.observe(document.getElementById("main")!, {
    //   childList: true,
    //   subtree: true,
    // });
  },
};
