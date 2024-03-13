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
  delay,
  filter,
  fromEvent,
  of,
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
  @Input() option!: Option;
  @Input() index!: number;
  @Input() closeRef!: Subject<Option>;
  @Input() onOptionSelect!: (option: Option) => void;

  @Output() hoveredOption = new EventEmitter<Option>();

  @ViewChild('optionElement') optionElement!: ElementRef<HTMLElement>;

  opened = false;

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

          // If the marker is already set to red
          // On childless options, the css hover will color the border
          if (this.optionElement.nativeElement.classList.contains('selected')) {
            this.optionElement.nativeElement.classList.remove('selected');
          }
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
        switchMap(() => timer(400).pipe(takeUntil(mouseLeave$))),
        tap(() => this.hoveredOption.emit(this.option))
      )
      .subscribe({
        next: () => {
          const viewRef =
            this._viewContainerRef.createComponent(ContextDropdownView);
          viewRef.instance.onOptionSelect = this.onOptionSelect;
          const currentOption = this._elementRef.nativeElement as HTMLElement;
          viewRef.instance.x = currentOption.offsetWidth + 4;
          viewRef.instance.y = this.index * currentOption.offsetHeight;
          viewRef.instance.options = this.option.subOptions!!;
          this.opened = true;
          this.optionElement.nativeElement.classList.add('selected');
        },
      });
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
