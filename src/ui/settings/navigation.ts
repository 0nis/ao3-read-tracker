import { addButtonToNav } from "../../utils/ui";

export function addSettingsButton(open: () => void): void {
  const nav = document.querySelector("ul.primary.navigation.actions");
  if (!nav) return;
  addButtonToNav(
    nav as HTMLElement,
    async (ev) => {
      ev.preventDefault();
      open();
    },
    "⚙️ Read Tracker",
    null,
    false
  );
}
