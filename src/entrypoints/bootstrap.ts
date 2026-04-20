import { SessionStorage } from "../services/session";
import { Loader } from "../utils/ui/loaders/page/loader";
import {
  CUSTOM_PATHS,
  FALLBACK_PATH,
  LOADED_EVENT,
  LOADER_STORAGE_KEYS,
} from "../constants/global";

const session = SessionStorage();

function isLoaderEntryRoute() {
  return CUSTOM_PATHS.includes(location.pathname);
}

function onLoaderEntry() {
  session.set({
    key: LOADER_STORAGE_KEYS.ORIGINAL_PATH,
    value: location.pathname + location.search + location.hash,
  });
  window.location.replace(FALLBACK_PATH);
}

function hydrateLoader() {
  const originalPath = session.consume(LOADER_STORAGE_KEYS.ORIGINAL_PATH);
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
