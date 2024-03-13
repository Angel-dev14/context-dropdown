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
  @Input() parentPosition!: { x: number; y: number };

  @Output() hoveredOption = new EventEmitter<Option>();

  @ViewChild('optionElement') optionElement!: ElementRef<HTMLElement>;

  constructor(
    private _elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    private _cdr: ChangeDetectorRef
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
          const currentOption = this.optionElement.nativeElement as HTMLElement;
          setTimeout(() => {
            const dimensions = {
              x: viewRef.instance.dropdownElement.offsetWidth,
              y: viewRef.instance.dropdownElement.offsetHeight,
            };
            const position = this.getPosition(dimensions);
            viewRef.instance.x = position.x;
            viewRef.instance.y = this.index * currentOption.offsetHeight;
            this.opened = true;
            this.optionElement.nativeElement.classList.add('selected');
          });
        },
      });
  }

  public getPosition(newDropdownDimensions: { x: number; y: number }) {
    let { x, y } = { x: this.parentPosition.x, y: this.parentPosition.y };
    console.log(
      ` windowWidth : ${window.innerWidth} x: ${x} option width:${this.optionElement.nativeElement.offsetWidth}`
    );
    if (
      window.innerWidth <
      x +
        (newDropdownDimensions.x + 4) +
        this.optionElement.nativeElement.offsetWidth
    ) {
      x -=
        newDropdownDimensions.x +
        (x +
          (newDropdownDimensions.x <=
          this.optionElement.nativeElement.offsetWidth
            ? 8
            : 4));
      console.log('Out of bounds', x);
    } else {
      x = this.optionElement.nativeElement.offsetWidth + 4;
    }

    return {
      x: x,
      y: y,
    };
  }

  public selectOption(option: Option) {
    if (this.onOptionSelect) {
      this.onOptionSelect(option);
    }
  }

  private _targetsCurrentOption(event: PointerEvent): boolean {
    const target = event.target;
    return this._elementRef.nativeElement.contains(target);
  }
}
