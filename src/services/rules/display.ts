import { DisplayMode } from "../../enums/settings";
import { SettingsData } from "../../types/settings";
import { IgnoredWork, ReadWork } from "../../types/works";

type DisplayRule = {
  name: string;
  shouldApply: () => boolean;
  getMode: () => DisplayMode;
};

export function collectDisplayRules(
  settings: SettingsData,
  read?: ReadWork,
  ignored?: IgnoredWork
): DisplayRule[] {
  return [
    {
      name: "ignored",
      shouldApply: () => !!ignored,
      getMode: () => settings.ignoreSettings.defaultDisplayMode,
    },
    {
      name: "still reading",
      shouldApply: () => !!read?.isReading,
      getMode: () => settings.readSettings.stillReadingDisplayMode,
    },
    {
      name: "reread worthy",
      shouldApply: () => !!read?.rereadWorthy,
      getMode: () => settings.readSettings.rereadWorthyDisplayMode,
    },
    {
      name: "read (default)",
      shouldApply: () => !!read,
      getMode: () => settings.readSettings.defaultDisplayMode,
    },
  ];
}
