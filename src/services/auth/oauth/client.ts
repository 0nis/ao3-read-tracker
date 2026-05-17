import { createPKCE } from "./pkce";

export type OAuthConfig = {
  clientId: string;
  authUrl: string;
  tokenUrl: string;
  scope: string;
};

export class OAuthClient {
  constructor(private config: OAuthConfig) {}

  async authenticate(): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
  }> {
    const redirectUri = chrome.identity.getRedirectURL();
    const { verifier, challenge } = await createPKCE();

    const url = new URL(this.config.authUrl);

    url.searchParams.set("client_id", this.config.clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", this.config.scope);
    url.searchParams.set("code_challenge", challenge);
    url.searchParams.set("code_challenge_method", "S256");
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "consent");

    const finalUrl = await new Promise<string>((resolve, reject) => {
      chrome.identity.launchWebAuthFlow(
        { url: url.toString(), interactive: true },
        (responseUrl) => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
          else resolve(responseUrl!);
        },
      );
    });

    const code = new URL(finalUrl).searchParams.get("code");
    if (!code) throw new Error("OAuth failed: missing code");

    const tokenRes = await fetch(this.config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code_verifier: verifier,
      }),
    });

    if (!tokenRes.ok) throw new Error(await tokenRes.text());

    const data = await tokenRes.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  }
}
