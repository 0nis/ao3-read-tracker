import { LOADER_STORAGE_KEYS } from "../../constants/global";

export const SessionStorage = () => {
  return {
    start() {
      sessionStorage.setItem(LOADER_STORAGE_KEYS.ACTIVE, "1");
      sessionStorage.setItem(
        LOADER_STORAGE_KEYS.ORIGINAL_PATH,
        location.pathname + location.search + location.hash,
      );
    },

    consume() {
      const active = sessionStorage.getItem(LOADER_STORAGE_KEYS.ACTIVE) === "1";
      const original = sessionStorage.getItem(
        LOADER_STORAGE_KEYS.ORIGINAL_PATH,
      );

      sessionStorage.removeItem(LOADER_STORAGE_KEYS.ACTIVE);
      sessionStorage.removeItem(LOADER_STORAGE_KEYS.ORIGINAL_PATH);

      return active ? original : null;
    },
  };
};
