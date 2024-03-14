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
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Subject } from 'rxjs';

const visiblity = 'visible';

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
export class ContextDropdownView implements OnInit, AfterViewInit {
  visibility = visiblity;
  hoveredOption: Option | null = null;
  closeRef = new Subject<Option>();

  @Input() x!: number;
  @Input() y!: number;
  @Input() options: Option[] = [];
  @Input() depthLevel: number = 1;
  @Input() cumulativeWidth: number = 0;
  @Input() onOptionSelect!: (option: Option) => void;

  @ViewChild('dropdown', { static: true })
  private _dropdownElement!: ElementRef<HTMLDivElement>;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      const currentWidth = this.dropdownElement.offsetWidth + 4;
      this.cumulativeWidth += currentWidth;
    });
  }

  hoverOption(option: Option) {
    this.hoveredOption = option;
    this.closeRef.next(this.hoveredOption);
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

  protected readonly close = close;
}
