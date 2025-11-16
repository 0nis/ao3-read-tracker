import { IGNORE_SETTINGS_ID, READ_SETTINGS_ID } from "../../constants/settings";
import { ButtonAction, WorkState } from "../../constants/enums";
import { addFormStyles } from "./form/style";
import {
  handleEditIgnoredFicInfo,
  handleEditReadFicInfo,
  handleGetSettings,
  handleIgnoreFic,
  handleMarkFicAsRead,
  handleMarkFicAsUnread,
  handleUnignoreFic,
} from "./handlers";
import { addButton } from "./navigation";

export const Work = {
  async init() {
    addFormStyles();

    const {
      [READ_SETTINGS_ID]: readSettings,
      [IGNORE_SETTINGS_ID]: ignoreSettings,
    } = await handleGetSettings();

    if (readSettings.simpleMode) {
      await addButton({
        mode: ButtonAction.TOGGLE as ButtonAction.TOGGLE,
        type: WorkState.READ,
        labels: { ON: "Mark as Unread", OFF: "Mark as Read" },
        onActivate: (id) => handleMarkFicAsRead({ id }),
        onDeactivate: handleMarkFicAsUnread,
      });
    } else {
      await addButton({
        mode: ButtonAction.CLICK as ButtonAction.CLICK,
        type: WorkState.READ,
        labels: { ON: "Edit Read Info", OFF: "Mark as Read" },
        onClick: (id) => handleEditReadFicInfo(id),
      });
    }

    if (ignoreSettings.simpleMode) {
      await addButton({
        mode: ButtonAction.TOGGLE as ButtonAction.TOGGLE,
        type: WorkState.IGNORED,
        labels: { ON: "Unignore", OFF: "Ignore" },
        onActivate: (id) => handleIgnoreFic({ id }),
        onDeactivate: handleUnignoreFic,
      });
    } else {
      await addButton({
        mode: ButtonAction.CLICK as ButtonAction.CLICK,
        type: WorkState.IGNORED,
        labels: { ON: "Edit Ignore Info", OFF: "Ignore" },
        onClick: (id) => handleEditIgnoredFicInfo(id),
      });
    }
  },
};
