import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Option } from '../../model/option';
import {
  filter,
  fromEvent,
  Subject,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { ContextDropdownView } from '../../view/context-dropdown.view';
import { Position } from '../../directives/context-dropdown.directive';

@Component({
  selector: 'custom-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css'],
})
export class OptionComponent implements OnInit {
  opened = false;

  @Input() option!: Option;
  @Input() index!: number;
  @Input() closeRef!: Subject<Option>;
  @Input() onOptionSelect!: (option: Option) => void;
  @Input() depthLevel!: number;
  @Input() cumulativeWidth!: number;
  @Input()
  set parentOption(value: Option | undefined) {
    this.option.parent = value;
  }

  @Output() hoveredOption = new EventEmitter<Option>();

  @ViewChild('optionElement') optionElement!: ElementRef<HTMLElement>;

  constructor(
    private _elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.closeRef
      .pipe(filter((option) => option.id != this.option.id))
      .subscribe({
        next: () => {
          this._viewContainerRef.clear();
          this.opened = false;

          this.optionElement.nativeElement.classList.remove('selected');
        },
      });

    const mouseOver$ = fromEvent(
      this._elementRef.nativeElement,
      'mouseover'
    ).pipe(
      filter((event) => this._targetsCurrentOption(event as PointerEvent))
    );

    const mouseLeave$ = fromEvent(this._elementRef.nativeElement, 'mouseleave');

    mouseOver$
      .pipe(
        // Even if it should get filtered, I still want options with no suboptions
        // to clear the previously opened nested menus
        switchMap(() => timer(250).pipe(takeUntil(mouseLeave$))),
        tap(() => this.hoveredOption.emit(this.option)),
        filter(
          () =>
            this.option.subOptions != null &&
            this.option.subOptions.length > 0 &&
            !this.opened
        )
      )
      .subscribe({
        next: () => {
          const viewRef =
            this._viewContainerRef.createComponent(ContextDropdownView);
          viewRef.instance.onOptionSelect = this.onOptionSelect;
          viewRef.instance.options = this.option.subOptions!!;
          viewRef.instance.depthLevel = this.depthLevel + 1;
          viewRef.instance.cumulativeWidth = this.cumulativeWidth;
          viewRef.instance.parentOption = this.option;

          /*  Using the cdr ref instead of the timeout here still resulted in the
          new dimensions returning as 1,0 so I opted for setTimeout detection trigger */
          setTimeout(() => {
            const newPosition = this._getPosition({
              x: viewRef.instance.dropdownElement.offsetWidth,
              y: viewRef.instance.dropdownElement.offsetHeight,
            });
            viewRef.instance.x = newPosition.x;
            viewRef.instance.y = newPosition.y;
            this.opened = true;
            this.optionElement.nativeElement.classList.add('selected');
          });
        },
      });
  }

  public selectOption(option: Option): void {
    if (this.onOptionSelect) {
      this.onOptionSelect(option);
    }
  }

  private _getPosition(newMenuDimensions: Position): Position {
    const padding = 8;
    const currentMenuWidth = this.optionElement.nativeElement.offsetWidth;
    const currentMenuHeigth = this.optionElement.nativeElement.offsetHeight;
    let newPosition = { x: 0, y: 0 };

    const absolutePosition = this._calculateAbsolutePosition(
      this.optionElement.nativeElement
    );
    const totalAvailableSpace =
      window.innerWidth - (absolutePosition.x + padding);

    const availableSpace = {
      x: window.innerWidth - (absolutePosition.x + currentMenuWidth + padding),
      y: window.innerHeight - (absolutePosition.y + currentMenuHeigth),
    };

    if (
      availableSpace.x >= (newMenuDimensions.x + padding) * this.depthLevel &&
      totalAvailableSpace >=
        this.cumulativeWidth + newMenuDimensions.x + padding
    ) {
      // The reason we do the second check is that otherwise the cumulative width
      // becomes big and we get a menu to the left when there is still space on the right
      newPosition.x = currentMenuWidth + padding;
    } else if (absolutePosition.x >= this.cumulativeWidth) {
      // When the current menu is bigger than the new menu, the positioning is correct
      // When the new menu is bigger, than it starts to overlap with the existing menu

      const widthDifference = newMenuDimensions.x - currentMenuWidth;

      const offsetX =
        newMenuDimensions.x <= currentMenuWidth
          ? newMenuDimensions.x + padding / 2
          : newMenuDimensions.x + padding * 2.5 - widthDifference;

      newPosition.x = -offsetX;
    } else {
      // We default to the a menu on the right
      newPosition.x = currentMenuWidth + padding;
    }

    // Positioning on the Y axis
    if (availableSpace.y < newMenuDimensions.y) {
      newPosition.y =
        this.optionElement.nativeElement.offsetHeight /
        this.option.subOptions?.length!!;
    } else {
      newPosition.y =
        this.index * this.optionElement.nativeElement.offsetHeight;
    }
    return newPosition;
  }

  private _targetsCurrentOption(event: PointerEvent): boolean {
    const target = event.target;
    return this._elementRef.nativeElement.contains(target);
  }

  private _calculateAbsolutePosition(element: HTMLElement): {
    x: number;
    y: number;
  } {
    const rect = element.getBoundingClientRect();

    return { x: rect.left, y: rect.top };
  }
}
