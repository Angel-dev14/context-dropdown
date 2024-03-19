import { Logger } from './logger';
import { Injectable } from '@angular/core';

@Injectable()
export class LegacyLogger implements Logger {

  constructor() {
    console.log('[LEGACY LOGGER] created');
  }

  log(message: string): void {
    console.log(`[LEGACY LOGGER] ${message}`)
  }

}
