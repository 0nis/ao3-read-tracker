import { UI } from "./ui/core";

(async function main() {
  // Entry point for the application
  UI.init();
})();

// TODO: Implement "read" functionality
// - Add "read" button to ff chapter UI                                 DONE
// - Add "unread" button to ff chapter UI                               DONE
// - Track read ffs in storage                                          DONE
// - Update UI of ff listing based on read status
// - OPT: Add page to manage read ffs

// TODO: Implement "ignore" functionality
// - Add "ignore" button to ff chapter UI and listing UI                DONE
// - Add "unignore" button to ff chapter UI and listing UI              DONE
// - Track ignored ffs in storage                                       DONE
// - Hide or collapse ignored ffs in the UI
// - OPT: Add page to manage ignored ffs

// TODO: Implement settings page / modal
// - Create modal UI for settings                                       DONE
// - Allow user to configure display modes for read and ignored ffs

// TODO: Add export/import functionality

// TODO: Account for edge cases in listings
