import { Component, OnInit, Optional, Self, SkipSelf } from '@angular/core';
import { LoggerService } from '../logger/logger.service';
import { LegacyLogger } from '../logger/legacy.logger';

@Component({
  selector: 'app-item-a',
  templateUrl: './item-a.component.html',
  providers: [],
  styleUrl: './item-a.component.css'
})
export class ItemAComponent implements OnInit {

  constructor(
    private logger: LoggerService,
  ) {}

  ngOnInit(): void {
        this.logger?.log('item a')
    }



}
