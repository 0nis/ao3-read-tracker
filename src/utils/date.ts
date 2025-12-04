/** Converts a timestamp to a formatted date string (YYYY-MM-DD) */
export const getFormattedDate = (
  timestamp: number,
  separator: string = "-"
): string => {
  return formatDateSafely(timestamp, (ts: number) => {
    return getLocalDateString(new Date(ts)).replace(/-/g, separator);
  });
};

/** Formats a timestamp to a localized time string (HH:MM) */
export const getFormattedTime = (timestamp: number): string => {
  return formatDateSafely(
    timestamp,
    (ts: number) => {
      const date = new Date(ts);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    "[Invalid Time]"
  );
};

/** Formats a timestamp to a full localized date string (e.g., June 15, 2023) */
export const getFormattedDateAsFullText = (timestamp: number): string => {
  return formatDateSafely(timestamp, (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });
};

export const timestampToISOString = (timestamp: number): string => {
  return formatDateSafely(
    timestamp,
    (ts: number) => {
      return new Date(ts).toISOString();
    },
    ""
  );
};

export const getLocalDateString = (date: Date): string => {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part) => String(part).padStart(2, "0"))
    .join("-");
};

export const getLocalDateTimeString = (date: Date): string => {
  const datePart = getLocalDateString(date);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${datePart}T${hours}:${minutes}`;
};

/** Formats a timestamp to a string suitable for filenames (YYYY-MM-DD_HH-MM)*/
export const getFormattedDateTimeForFilename = (timestamp: number): string => {
  return formatDateSafely(
    timestamp,
    (ts: number) => {
      const date = new Date(ts);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}_${hours}-${minutes}`;
    },
    "invalid-datetime"
  );
};

const formatDateSafely = (
  timestamp: number,
  formatter: (ts: number) => string,
  fallback: string = "[Invalid Date]"
): string => {
  if (isNaN(timestamp) || timestamp < 0) return fallback;
  try {
    return formatter(timestamp);
  } catch {
    return fallback;
  }
};
