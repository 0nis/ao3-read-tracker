import { AuthProvider } from "../shared/enums";
import { AnyAuthProvider } from "../shared/provider";

import { GoogleDeviceAuthProvider } from "../providers/google/device/provider";

const authProviders = {
  [AuthProvider.GOOGLE]: new GoogleDeviceAuthProvider(),
} satisfies Partial<Record<AuthProvider, AnyAuthProvider>>;

export function getAuthProvider(provider: AuthProvider): AnyAuthProvider {
  const authProvider = authProviders[provider];

  if (!authProvider)
    throw new Error(`Unsupported auth provider: ${String(provider)}`);

  return authProvider;
}

export function getAuthProviders(): Partial<
  Record<AuthProvider, AnyAuthProvider>
> {
  return authProviders;
}
