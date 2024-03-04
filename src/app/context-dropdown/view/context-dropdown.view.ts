import {
  AfterViewChecked,
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
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'context-dropdown-view',
  templateUrl: './context-dropdown.view.html',
  styleUrls: ['./context-dropdown.view.css'],
  animations: [
    trigger('dropdownVisibility', [
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'scaleY(1)',
        })
      ),
      transition('void => visible', [
        style({ opacity: 0, transform: 'scaleY(0.8)' }),
        animate('200ms ease-out'),
      ]),
    ]),
  ],
})
export class ContextDropdownView implements OnInit {
  @Input() x!: number;
  @Input() y!: number;

  @Input() options!: Option[];
  @ViewChild('dropdown') private _dropdownElement!: ElementRef<HTMLDivElement>;
  @Output() selectedOption = new EventEmitter<Option>();

  visibility = 'visible';

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
}
