function base64UrlEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function sha256(input: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
}

function randomString(length = 64): string {
  const array = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(array, (b) => ("0" + b.toString(16)).slice(-2)).join("");
}

export async function createPKCE() {
  const verifier = randomString(64);
  const challenge = base64UrlEncode(await sha256(verifier));

  return { verifier, challenge };
}
