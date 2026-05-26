export const ABBREVIATION: string = "EXT-RT";
export const EXTENSION_NAME: string = "AO3 Read Tracker";

export const DATABASE_NAME = "Ao3ReadTrackerDB";
export const DATABASE_VERSION: number = 2;

// TODO: Decide if we should move some of these to specific featuers instead, they aren't all global...

export const EXTENSION_DISABLED_KEY = `${ABBREVIATION.toLowerCase()}.disabled`;
export const PERSISTENT_STORAGE_KEY = `${ABBREVIATION.toLowerCase()}.persistent-storage`;

export const IS_DEV = process.env.NODE_ENV === "development";

export const AO3_WORK_BASE_URL = "https://archiveofourown.org/works";

export const MAX_GIF_SIZE = 500_000; // 500kb
export const IMAGE_PIXEL_HEIGHT = 128;
export const DEFAULT_SYMBOL_SIZE_EM = 1.2;

export const LOADED_EVENT = `${ABBREVIATION}:loaded`;
export const LOADER_STORAGE_KEYS = {
  ORIGINAL_PATH: `${ABBREVIATION}:original-path`,
};

export const SETTINGS_PAGE_PATH = "/extensions/read-tracker";
export const CUSTOM_PATHS = [SETTINGS_PAGE_PATH];
export const FALLBACK_PATH = "/";

export const GOOGLE_DEVICE_CLIENT_ID =
  process.env.GOOGLE_DEVICE_CLIENT_ID || "";
export const GOOGLE_DEVICE_CLIENT_SECRET =
  process.env.GOOGLE_DEVICE_CLIENT_SECRET || "";
