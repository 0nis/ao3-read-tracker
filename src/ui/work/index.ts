import {
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_IGNORE_SETTINGS,
  DEFAULT_READ_SETTINGS,
} from "../../constants/settings";
import {
  modifyMarkForLaterButton,
  setupIgnoreButton,
  setupReadButton,
} from "./buttons";
import { addFormStyles } from "./form/style";
import { handleGetSettings } from "./handlers";

export const Work = {
  async init() {
    addFormStyles();

    const { readSettings, ignoreSettings, generalSettings } =
      await handleGetSettings();

    if (generalSettings?.replaceMarkForLaterText) {
      modifyMarkForLaterButton(
        generalSettings?.markForLaterReplacementLabel ??
          DEFAULT_GENERAL_SETTINGS.markForLaterReplacementLabel
      );
    }

    setupReadButton(
      readSettings?.simpleModeEnabled ??
        DEFAULT_READ_SETTINGS.simpleModeEnabled,
      generalSettings?.buttonPlacement ??
        DEFAULT_GENERAL_SETTINGS.buttonPlacement
    );
    setupIgnoreButton(
      ignoreSettings?.simpleModeEnabled ??
        DEFAULT_IGNORE_SETTINGS.simpleModeEnabled,
      generalSettings?.buttonPlacement ??
        DEFAULT_GENERAL_SETTINGS.buttonPlacement
    );
  },
};
