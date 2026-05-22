import { sendRuntimeMessage } from "../../helpers";
import { DeviceAuthService } from "../../../shared/service";
import {
  AuthMessageType,
  AuthProvider,
  DeviceFlowStatus,
} from "../../../shared/enums";
import {
  AuthDisconnectResponse,
  AuthPollResponse,
  AuthStatusResponse,
} from "../../../shared/types";
import { DeviceFlowStartResponse } from "../../../oauth/device/types";

export class GoogleDeviceAuth implements DeviceAuthService {
  async startDeviceFlow(): Promise<DeviceFlowStartResponse> {
    return await sendRuntimeMessage<DeviceFlowStartResponse>({
      type: AuthMessageType.START_DEVICE_FLOW,
      provider: AuthProvider.GOOGLE,
    });
  }

  async pollDeviceFlow(): Promise<DeviceFlowStatus> {
    const response = await sendRuntimeMessage<AuthPollResponse>({
      type: AuthMessageType.POLL_DEVICE_FLOW,
      provider: AuthProvider.GOOGLE,
    });
    if (!response.ok) throw new Error(response.error);

    return response.status;
  }

  async isAuthenticated(): Promise<boolean> {
    const response = await sendRuntimeMessage<AuthStatusResponse>({
      type: AuthMessageType.STATUS,
      provider: AuthProvider.GOOGLE,
    });
    if (!response.ok) throw new Error(response.error);

    return response.authenticated;
  }

  async disconnect(): Promise<void> {
    const response = await sendRuntimeMessage<AuthDisconnectResponse>({
      type: AuthMessageType.DISCONNECT,
      provider: AuthProvider.GOOGLE,
    });
    if (!response.ok) throw new Error(response.error);
  }
}
