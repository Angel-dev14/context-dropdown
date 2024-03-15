import {
  ChangeDetectorRef,
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
        filter(
          () =>
            this.option.subOptions != null &&
            this.option.subOptions.length > 0 &&
            !this.opened
        ),
        switchMap(() => timer(200).pipe(takeUntil(mouseLeave$))),
        tap(() => this.hoveredOption.emit(this.option))
      )
      .subscribe({
        next: () => {
          const viewRef =
            this._viewContainerRef.createComponent(ContextDropdownView);
          viewRef.instance.onOptionSelect = this.onOptionSelect;
          viewRef.instance.options = this.option.subOptions!!;
          viewRef.instance.depthLevel = this.depthLevel + 1;
          viewRef.instance.cumulativeWidth = this.cumulativeWidth;
          setTimeout(() => {
            const newPosition = this.getPosition({
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

  public getPosition(newMenuDimensions: Position): Position {
    const padding = 4;
    const currentMenuWidth = this.optionElement.nativeElement.offsetWidth;
    const currentMenuHeigth = this.optionElement.nativeElement.offsetHeight;
    let newPosition = { x: 0, y: 0 };

    const absolutePosition = this._calculateAbsolutePosition(
      this.optionElement.nativeElement
    );

    const availableSpace = {
      x: window.innerWidth - (absolutePosition.x + currentMenuWidth + padding),
      y: window.innerHeight - (absolutePosition.y + currentMenuHeigth),
    };

    if (availableSpace.x >= (newMenuDimensions.x + padding) * this.depthLevel) {
      // The reason we do checks is that otherwise the cumulative width
      // becomes big and we get a menu to the left when there is still space on the right
      newPosition.x = currentMenuWidth + padding;
    } else if (absolutePosition.x >= this.cumulativeWidth) {
      // In the case of the third option, we have a new menu and current menu width of 93 px
      // This causes the padding to not be correct which does not make sense
      // When we go minus 93px to the left, this should jump across the current option and then apply 4px of padding
      // In this specific case however 4 more pixels are needed but this is just a placeholder

      newPosition.x = -(
        newMenuDimensions.x +
        4 +
        (newMenuDimensions.x <= currentMenuWidth ? 4 : 0)
      );
    } else {
      // We default to the a menu on the right
      newPosition.x = currentMenuWidth + padding;
    }

    if (availableSpace.y < currentMenuHeigth * this.index) {
      newPosition.y = 0;
      console.log('Out of bounds heigth', newPosition.y, this.index);
    } else {
      newPosition.y =
        this.index * this.optionElement.nativeElement.offsetHeight;
    }
    // This handles atleast 3 submenus on small screens, might be unrealistic to target 4+ submenus without any overlap
    return newPosition;
  }

  public selectOption(option: Option): void {
    if (this.onOptionSelect) {
      this.onOptionSelect(option);
    }
  }

  private _targetsCurrentOption(event: PointerEvent): boolean {
    const target = event.target;
    return this._elementRef.nativeElement.contains(target);
  }

  private _calculateAbsolutePosition(element: HTMLElement): {
    x: number;
    y: number;
  } {
    let xPosition = 0;
    let yPosition = 0;

    // recursively calculates the entire distance of the target element from 0,0 to its position
    // needed to correctly check if the element is out of bounds
    while (element) {
      xPosition += element.offsetLeft - element.scrollLeft + element.clientLeft;
      yPosition += element.offsetTop - element.scrollTop + element.clientTop;
      element = element.offsetParent as HTMLElement;
    }

    return { x: xPosition, y: yPosition };
  }
}
