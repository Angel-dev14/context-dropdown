import { Component, OnInit, Optional } from '@angular/core';
import { LoggerService } from '../../logger/logger.service';

@Component({
  selector: 'app-item-child-a',
  templateUrl: './item-child-a.component.html',
  styleUrl: './item-child-a.component.css'
})
export class ItemChildAComponent implements OnInit {

  constructor(
     private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.logger?.log('item child a')
  }

}
