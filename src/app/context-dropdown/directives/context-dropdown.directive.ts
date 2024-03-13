import {
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { Subscription, filter, fromEvent, map, tap } from 'rxjs';
import { ContextDropdownView } from '../view/context-dropdown.view';
import { Option } from '../model/option';

export interface Position {
  x: number;
  y: number;
}

@Directive({
  selector: '[context-dropdown]',
})
export class ContextDropdownDirective implements OnInit {
  opened = false;
  optionSelectedVar: Option | null = null;
  componentRef: ComponentRef<ContextDropdownView> | undefined;

  private _selectedOptionSubscription: Subscription | null = null;

  @Input() options: Option[] = [];

  @Output() optionSelected = new EventEmitter<Option>();

  constructor(
    private _elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    private _ngZone: NgZone,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    fromEvent(this._elementRef.nativeElement, 'contextmenu')
      .pipe(map((event) => event as PointerEvent))
      .subscribe({
        next: (event: PointerEvent) => {
          event.preventDefault();
          // If we click while a menu is open, it should reopen at the new location
          if (this.opened) {
            this._closeMenu();
          }

          this.componentRef =
            this._viewContainerRef.createComponent(ContextDropdownView);
          this.componentRef.instance.onOptionSelect =
            this.handleOptionSelection.bind(this);

          this.componentRef.instance.options = this.options;
          this._cdr.detectChanges();

          const dimensions: Position = {
            x: this.componentRef.instance.dropdownElement.offsetWidth,
            y: this.componentRef.instance.dropdownElement.offsetHeight,
          };

          const adjustedPosition = this._setPosition(event, dimensions);
          this.componentRef.instance.x = adjustedPosition.x;
          this.componentRef.instance.y = adjustedPosition.y;

          this.opened = true;
        },
      });

    this._ngZone.runOutsideAngular(() => {
      fromEvent(document, 'contextmenu')
        .pipe(
          filter(
            (event) => !this.eventMatchesCurrentContext(event) && this.opened
          )
        )
        .subscribe({
          next: () => {
            this._ngZone.run(() => {
              this._closeMenu();
            });
          },
        });

      fromEvent(document, 'click')
        .pipe(
          filter(
            (event) => !this.eventMatchesCurrentDropdown(event) && this.opened
          )
        )
        .subscribe({
          next: () => {
            this._ngZone.run(() => {
              this._closeMenu();
            });
          },
        });
    });
  }

  public eventMatchesCurrentContext(event: Event) {
    const target = event.target as HTMLElement;
    return (this._elementRef.nativeElement as HTMLElement).contains(target);
  }

  public eventMatchesCurrentDropdown(event: Event) {
    const target = event.target as HTMLElement;
    if (!this.componentRef) {
      return false;
    } else {
      return (
        this.componentRef?.instance.dropdownElement as HTMLElement
      ).contains(target);
    }
  }

  public handleOptionSelection(option: Option): void {
    this.optionSelectedVar = option;
    if (!this.hasSubOptions()) {
      this._closeMenu();
      this.optionSelected.emit(option);
    }
  }

  public hasSubOptions(): boolean {
    return !!(
      this.optionSelectedVar &&
      this.optionSelectedVar.subOptions &&
      this.optionSelectedVar.subOptions.length > 0
    );
  }

  private _setPosition(event: PointerEvent, dimensions: Position): Position {
    let xPosition = event.pageX;
    let yPosition = event.pageY;

    if (window.innerHeight < event.clientY + dimensions.y) {
      yPosition -= dimensions.y;
    }

    if (window.innerWidth < event.clientX + dimensions.x) {
      xPosition -= dimensions.x;
    }

    return { x: xPosition, y: yPosition };
  }

  private _closeMenu() {
    if (this._selectedOptionSubscription) {
      this._selectedOptionSubscription.unsubscribe();
      this._selectedOptionSubscription = null;
    }

    this._viewContainerRef.clear();
    this.opened = false;
  }
}
