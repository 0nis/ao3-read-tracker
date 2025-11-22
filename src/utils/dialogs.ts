/**
 * Used for critical messages that need user attention
 */
export function showNotification(message: string): void {
  alert(message);
}

/**
 * Used when asking for user confirmation (e.g., when deleting something)
 */
export function showConfirm(message: string): Promise<boolean> {
  return Promise.resolve(confirm(message));
}
