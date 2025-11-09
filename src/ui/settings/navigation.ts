import { Router } from "../router";

export function addSettingsButtonToNav(url: string): void {
  const nav = document.querySelector("ul.primary.navigation.actions");
  if (!nav) return;

  const li = document.createElement("li");
  const button = document.createElement("a");
  button.href = "#";
  button.textContent = "⚙️ Read Tracker";

  button.addEventListener("click", (ev) => {
    ev.preventDefault();
    Router.navigate(url);
  });

  li.appendChild(button);
  nav.appendChild(li);
}
