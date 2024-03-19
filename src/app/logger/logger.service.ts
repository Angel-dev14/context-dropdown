import { Injectable, OnInit } from '@angular/core';
import { Logger } from './logger';

@Injectable()
export class LoggerService implements Logger {

  id = Math.random();

  constructor() {
    console.log(this.id +' [LOGGER] created');
  }

    log(message: string): void {
        console.log(`${this.id} [LOGGER] ${message}`)
    }

}
