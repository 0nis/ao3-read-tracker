import { AuthProviderType } from "../shared/enums";

export interface AuthProviderConfig {
  supportsDeviceFlow?: boolean;
  supportsRedirectFlow?: boolean;
}

export const AUTH_PROVIDER_CONFIG = {
  [AuthProviderType.GOOGLE]: {
    supportsDeviceFlow: true,
    supportsRedirectFlow: false,
  },
} satisfies Record<AuthProviderType, AuthProviderConfig>;

export function getAuthProviderConfig(
  provider: AuthProviderType,
): AuthProviderConfig {
  const config = AUTH_PROVIDER_CONFIG[provider];

  if (!config)
    throw new Error(`Unsupported auth provider: ${String(provider)}`);

  return config;
}
