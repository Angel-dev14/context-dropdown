import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { Option } from '../../model/option';
import { filter, fromEvent, Subject, tap } from 'rxjs';
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
        },
      });

    fromEvent(this._elementRef.nativeElement, 'mouseover')
      .pipe(
        filter((event) => this._targetsCurrentOption(event as PointerEvent)),
        // If there are no suboptions we should just clear anyway
        // When we update the hoveredOption, this will cause the closeRef to be updated
        // Which will make sure that the other submenus are closed
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
          const currentOption = this._elementRef.nativeElement as HTMLElement;
          viewRef.instance.x = currentOption.offsetWidth + 4;
          viewRef.instance.y = this.index * currentOption.offsetHeight;
          viewRef.instance.options = this.option.subOptions!!;
          this.opened = true;
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
