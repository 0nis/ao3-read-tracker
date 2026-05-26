/** Stored in extension storage */
export type OAuthStoredState = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  refreshTokenExpiresAt?: number;
  scope?: string;
  tokenType?: string;
};

export type OAuthTokenResponse = {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  refreshTokenExpiresIn?: number;
  scope?: string;
  tokenType?: string;
};
