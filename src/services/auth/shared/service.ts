import { DeviceFlowStartResponse } from "../oauth/device/types";
import { DeviceFlowStatus } from "./enums";

export interface AuthService {
  authenticate(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
  disconnect(): Promise<void>;
}

export interface DeviceAuthService extends AuthService {
  startDeviceFlow(): Promise<DeviceFlowStartResponse>;
  pollDeviceFlow(): Promise<DeviceFlowStatus>;
}
