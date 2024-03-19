import { InjectionToken } from '@angular/core';

export interface AppConfig {
  color: string
}

export const DefaultAppConfig: AppConfig = {
  color: 'blue'
}

export const APP_CONFIG_TOKEN = new InjectionToken<AppConfig>("APP_CONFIG", {
  factory: () => DefaultAppConfig
});

