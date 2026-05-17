import { OAuthClient } from "../oauth/client";
import { AuthService } from "../service";
import { OAuthStateStore } from "../storage/oauth";

import { LocalMemoryService } from "../../memory";
import { GOOGLE_CLIENT_ID } from "../../../constants/global";

export class GoogleAuth implements AuthService {
  private oauth: OAuthClient;
  private store: OAuthStateStore;

  constructor() {
    this.store = new OAuthStateStore("google", new LocalMemoryService());

    this.oauth = new OAuthClient({
      clientId: GOOGLE_CLIENT_ID,
      authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      scope: "https://www.googleapis.com/auth/drive.appdata",
    });
  }

  async authenticate(): Promise<void> {
    const result = await this.oauth.authenticate();

    this.store.set({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresAt: Date.now() + result.expiresIn * 1000,
    });
  }

  async isAuthenticated(): Promise<boolean> {
    const state = this.store.get();
    if (!state) return false;
    return Date.now() < state.expiresAt;
  }

  async disconnect(): Promise<void> {
    this.store.clear();
  }
}
