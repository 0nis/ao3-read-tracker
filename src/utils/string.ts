export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Example: "this_is_a_string" -> "This Is A String" */
export function toSentenceCase(str: string): string {
  return str
    .replace(/_/g, " ") // replace underscores
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2") // insert space before camelCase capitals
    .replace(/\s+/g, " ") // collapse multiple spaces
    .toLowerCase()
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize first letter of each word
}

/** Example: "thisIsAString" -> "this-is-a-string" */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2") // insert hyphen before camelCase capitals
    .replace(/[\s_]/g, "-") // replace spaces and underscores
    .toLowerCase();
}

export function replacePlaceholders(
  text: string,
  replacements: Record<string, string>
) {
  return Object.entries(replacements).reduce((acc, [key, value]) => {
    const pattern = new RegExp(`%${key}%`, "g");
    return acc.replace(pattern, value);
  }, text);
}
