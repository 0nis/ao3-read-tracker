import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "../../../../constants/global";
import { AuthProvider } from "../../shared/enums";
import { DeviceFlowClientConfig } from "../../oauth/device/types";

export const GOOGLE_DEVICE_CODE_URL =
  "https://oauth2.googleapis.com/device/code";
export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const GOOGLE_REVOKE_URL = "https://oauth2.googleapis.com/revoke";
export const GOOGLE_DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";

export const GOOGLE_DEVICE_OAUTH_CONFIG: DeviceFlowClientConfig = {
  provider: AuthProvider.GOOGLE,
  deviceCodeUrl: GOOGLE_DEVICE_CODE_URL,
  tokenUrl: GOOGLE_TOKEN_URL,
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  scope: GOOGLE_DRIVE_SCOPE,
};
