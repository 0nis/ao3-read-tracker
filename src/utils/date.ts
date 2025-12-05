/**
 * Converts a timestamp to a formatted date string (YYYY-MM-DD)
 * Uses {@link getLocalDateString}, but is separated to make potential future refactors easier.
 */
export const getFormattedDate = (
  timestamp: number | undefined,
  separator: string = "-"
): string => {
  return formatDateSafely(timestamp, (ts: number) => {
    return getLocalDateString(new Date(ts), separator);
  });
};

/**
 * Formats a timestamp to a full localized date string (e.g., June 15, 2023)
 * Used for display where the date is central to the information being shown
 */
export const getFormattedDateAsFullText = (
  timestamp: number | undefined,
  monthTextLength: "long" | "short" = "long"
): string => {
  return formatDateSafely(timestamp, (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: monthTextLength,
      day: "numeric",
    });
  });
};

/** Formats a timestamp to a localized time string (HH:MM) */
export const getFormattedTime = (timestamp: number | undefined): string => {
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

/**
 * Safely converts a timestamp to an ISO 8601 string
 * Used for the dateTime attribute in <time> elements
 */
export const timestampToISOString = (timestamp: number | undefined): string => {
  return formatDateSafely(
    timestamp,
    (ts: number) => {
      return new Date(ts).toISOString();
    },
    ""
  );
};

/**
 * Converts a Date object to a local date string (YYYY-MM-DD)
 * Used for date input fields & short date display
 */
export const getLocalDateString = (
  date: Date,
  separator: string = "-"
): string => {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part) => String(part).padStart(2, "0"))
    .join(separator);
};

/**
 * Converts a Date object to a local date-time string (YYYY-MM-DDTHH:MM)
 * Used for datetime-local input fields
 */
export const getLocalDateTimeString = (date: Date): string => {
  const datePart = getLocalDateString(date);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${datePart}T${hours}:${minutes}`;
};

/**
 * Formats a timestamp to a local YYYY-MM-DD_HH-MM
 * Used for filenames
 */
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
  timestamp: number | undefined,
  formatter: (ts: number) => string,
  fallback: string = "[Invalid Date]"
): string => {
  if (timestamp === undefined || isNaN(timestamp) || timestamp < 0)
    return fallback;
  try {
    return formatter(timestamp);
  } catch {
    return fallback;
  }
};
