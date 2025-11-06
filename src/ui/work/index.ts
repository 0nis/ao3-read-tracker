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
      type: "read",
      labels: { ON: "Mark as Unread", OFF: "Mark as Read" },
      onActivate: handleMarkFicAsRead,
      onDeactivate: handleMarkFicAsUnread,
    });

    await addToggleButton({
      type: "ignored",
      labels: { ON: "Unignore", OFF: "Ignore" },
      onActivate: handleIgnoreFic,
      onDeactivate: handleUnignoreFic,
    });
  },
};
