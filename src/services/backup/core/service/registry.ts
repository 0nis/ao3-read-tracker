import { BackupRuntimeProxy } from "../proxy";
import { BackupProviderType } from "../../../../enums/backups";

export class BackupProviderRegistry {
  private readonly proxies = new Map<BackupProviderType, BackupRuntimeProxy>();

  getProxy(providerType: BackupProviderType): BackupRuntimeProxy {
    let proxy = this.proxies.get(providerType);

    if (!proxy) {
      proxy = new BackupRuntimeProxy(providerType);
      this.proxies.set(providerType, proxy);
    }

    return proxy;
  }
}
