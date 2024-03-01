import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Option } from '../model/option';

@Component({
  selector: 'context-dropdown-view',
  templateUrl: './context-dropdown.view.html',
  styleUrls: ['./context-dropdown.view.css'],
})
export class ContextDropdownView implements OnInit, AfterViewInit {
  @Input() x!: number;
  @Input() y!: number;

  @Input() options!: Option[];
  @ViewChild('dropdown') private _dropdownElement!: ElementRef<HTMLDivElement>;
  @Output() selectedOption = new EventEmitter<Option>();

  constructor() {}

  ngOnInit() {}

  selectOption(option: Option) {
    this.selectedOption.emit(option);
  }

  get xCord() {
    return `${this.x}px`;
  }

  get yCord() {
    return `${this.y}px`;
  }

  get dropdownElement() {
    return this._dropdownElement.nativeElement;
  }

  ngAfterViewInit(): void {}
}
