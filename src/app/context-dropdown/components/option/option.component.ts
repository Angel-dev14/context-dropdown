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

const contextMenuWidth = 100;

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
          const currentOption = this.optionElement.nativeElement as HTMLElement;
          viewRef.instance.x = this.getPosition();
          viewRef.instance.y = this.index * currentOption.offsetHeight;
          this.opened = true;
          this.optionElement.nativeElement.classList.add('selected');
        },
      });
  }

  public getPosition(): number {
    const padding = 4;
    // If we remove the depthLevel multiplier here the menus will always overlap
    const totalRequiredSpaceRight =
      (contextMenuWidth + padding) * this.depthLevel;

    const absolutePosition = this._calculateAbsolutePosition(
      this.optionElement.nativeElement
    );

    const availableSpaceRight =
      window.innerWidth - (absolutePosition.x + contextMenuWidth + padding);

    if (availableSpaceRight >= totalRequiredSpaceRight) {
      return contextMenuWidth + padding;
    } else {
      if (absolutePosition.x >= totalRequiredSpaceRight) {
        return -(contextMenuWidth + padding);
      } else {
        return contextMenuWidth + padding;
      }
    }
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
