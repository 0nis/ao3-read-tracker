import { SessionStorage } from "./session";
import { Loader } from "../loader";
import {
  CUSTOM_PATHS,
  FALLBACK_PATH,
  LOADED_EVENT,
} from "../../constants/global";

const session = SessionStorage();

function isLoaderEntryRoute() {
  return CUSTOM_PATHS.includes(location.pathname);
}

function onLoaderEntry() {
  session.start();
  window.location.replace(FALLBACK_PATH);
}

function hydrateLoader() {
  const originalPath = session.consume();
  if (!originalPath) return;

  history.replaceState({}, "", originalPath);
  Loader.create();

  document.addEventListener(
    LOADED_EVENT,
    () => {
      Loader.destroy();
    },
    { once: true },
  );
}

(async function main() {
  if (isLoaderEntryRoute()) {
    onLoaderEntry();
    return;
  }
  hydrateLoader();
})();
