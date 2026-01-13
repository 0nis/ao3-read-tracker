export const VERSION: number = 1;

export const DATABASE_NAME = "Ao3ReadTrackerDB";
export const DATABASE_VERSION = VERSION;

export const SETTINGS_PAGE_URL = "/extensions/read-tracker";

export const MAX_GIF_SIZE = 500_000; // 500kb
export const IMAGE_PIXEL_HEIGHT = 128;
export const EMOJI_SCALE = 0.83; // Emojis render ~20% larger than text in most fonts

export const IS_DEV = process.env.NODE_ENV === "development";

export const ABBREVIATION: string = "EXT-RT";

export const EXTENSION_DISABLED_KEY = `${ABBREVIATION}_DISABLED`;
