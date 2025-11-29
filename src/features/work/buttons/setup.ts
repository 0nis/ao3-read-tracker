import { settingsCache } from "../../../services/cache/settings";
import {
  modifyMarkForLaterButton,
  setupIgnoreButton,
  setupReadButton,
} from "./buttons";

export async function setupWorkButtons() {
  const { readSettings, ignoreSettings, generalSettings } =
    await settingsCache.get();

  if (generalSettings?.replaceMarkForLaterText) {
    modifyMarkForLaterButton(generalSettings?.markForLaterReplacementLabel);
  }

  setupReadButton(
    readSettings?.simpleModeEnabled,
    generalSettings?.buttonPlacement
  );
  setupIgnoreButton(
    ignoreSettings?.simpleModeEnabled,
    generalSettings?.buttonPlacement
  );
}
