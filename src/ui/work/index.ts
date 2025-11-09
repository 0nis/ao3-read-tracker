import { IGNORE_SETTINGS_ID, READ_SETTINGS_ID } from "../../constants/settings";
import { handleGetSettings } from "./handlers";
import {
  handleIgnoreFic,
  handleMarkFicAsRead,
  handleMarkFicAsUnread,
  handleUnignoreFic,
} from "./handlers";
import { addButton } from "./navigation";

export const Work = {
  async init() {
    const {
      [READ_SETTINGS_ID]: readSettings,
      [IGNORE_SETTINGS_ID]: ignoreSettings,
    } = await handleGetSettings();

    if (readSettings.simpleMode) {
      await addButton({
        mode: "toggle",
        type: "read",
        labels: { ON: "Mark as Unread", OFF: "Mark as Read" },
        onActivate: handleMarkFicAsRead,
        onDeactivate: handleMarkFicAsUnread,
      });
    } else {
      await addButton({
        mode: "click",
        type: "read",
        labels: { ON: "Edit Read Info", OFF: "Mark as Read" },
        onClick: (id, title) => handleMarkFicAsRead(id, title, false),
      });
    }

    if (ignoreSettings.simpleMode) {
      await addButton({
        mode: "toggle",
        type: "ignored",
        labels: { ON: "Unignore", OFF: "Ignore" },
        onActivate: handleIgnoreFic,
        onDeactivate: handleUnignoreFic,
      });
    } else {
      await addButton({
        mode: "click",
        type: "ignored",
        labels: { ON: "Edit Ignore Info", OFF: "Ignore" },
        onClick: (id, title) => handleIgnoreFic(id, title, false),
      });
    }
  },
};
