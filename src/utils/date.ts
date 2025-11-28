/**
 * Converts a timestamp to a formatted date string (YYYY/MM/DD)
 * (I chose this date format to prevent confusion between MM/DD and DD/MM, forgive me)
 */
export const getFormattedDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

/**
 * Formats a timestamp to a localized time string (HH:MM)
 */
export const getFormattedTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

/**
 * Formats a timestamp to a full localized date string (e.g., June 15, 2023)
 */
export const getFormattedDateAsFullText = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Formats a timestamp to a string suitable for filenames (YYYY-MM-DD_HH-MM)
 */
export const getFormattedDateTimeForFilename = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}_${hours}-${minutes}`;
};
