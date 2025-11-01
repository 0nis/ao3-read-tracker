import {
  handleIgnoreFic,
  handleMarkFicAsRead,
  handleMarkFicAsUnread,
  handleUnignoreFic,
} from "./handlers";
import { addButtonToNav } from "../../utils/ui";
import { getIdFromUrl } from "../../utils/ao3";

function addReadButton() {
  const nav = document.querySelector("ul.work.navigation.actions");
  if (!nav) return;
  addButtonToNav(
    nav as HTMLElement,
    async (ev, isOn) => {
      ev.preventDefault();
      const ficId = getIdFromUrl();
      if (!ficId) return;
      if (isOn) await handleMarkFicAsUnread(ficId);
      else await handleMarkFicAsRead(ficId);
    },
    null,
    {
      ON: "Mark as Unread",
      OFF: "Mark as Read",
    },
    true
  );
}

function addIgnoreButton() {
  const nav = document.querySelector("ul.work.navigation.actions");
  if (!nav) return;
  addButtonToNav(
    nav as HTMLElement,
    async (ev, isOn) => {
      ev.preventDefault();
      const ficId = getIdFromUrl();
      if (!ficId) return;
      if (isOn) await handleUnignoreFic(ficId);
      else await handleIgnoreFic(ficId);
    },
    null,
    {
      ON: "Unignore",
      OFF: "Ignore",
    },
    true
  );
}

export function initializeNavigationButtons() {
  addReadButton();
  addIgnoreButton();
}
