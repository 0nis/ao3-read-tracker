export function sendRuntimeMessage<TResponse>(
  message: unknown,
): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      const err = chrome.runtime.lastError;

      if (err) {
        reject(new Error(err.message));
        return;
      }

      resolve(response as TResponse);
    });
  });
}
