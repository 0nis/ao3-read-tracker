import { DeviceFlowStartResponse } from "../../oauth/device/types";
import { DeviceFlowStatus } from "../../shared/enums";

export interface AuthService {
  isAuthenticated(): Promise<boolean>;
  disconnect(): Promise<void>;
}

export interface DeviceAuthService extends AuthService {
  startDeviceFlow(): Promise<DeviceFlowStartResponse>;
  pollDeviceFlow(): Promise<DeviceFlowStatus>;
}
