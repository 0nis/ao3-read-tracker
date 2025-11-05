import { STORAGE_KEYS } from "../../constants/settings";
import {
  handleIgnoreFic,
  handleMarkFicAsRead,
  handleMarkFicAsUnread,
  handleUnignoreFic,
} from "./handlers";
import { addToggleButton } from "./navigation";

export const Work = {
  async init() {
    await addToggleButton({
      storageKey: STORAGE_KEYS.READ,
      labels: { ON: "Mark as Unread", OFF: "Mark as Read" },
      onActivate: handleMarkFicAsRead,
      onDeactivate: handleMarkFicAsUnread,
    });

    await addToggleButton({
      storageKey: STORAGE_KEYS.IGNORED,
      labels: { ON: "Unignore", OFF: "Ignore" },
      onActivate: handleIgnoreFic,
      onDeactivate: handleUnignoreFic,
    });
  },
};
