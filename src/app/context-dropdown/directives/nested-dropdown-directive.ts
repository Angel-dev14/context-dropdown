import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { Option } from '../model/option';
import {
  Subscription,
  delay,
  exhaustMap,
  filter,
  fromEvent,
  map,
  of,
  switchMap,
} from 'rxjs';
import { ContextDropdownView } from '../view/context-dropdown.view';
import { Position } from './context-dropdown.directive';

@Directive({
  selector: '[nested-dropdown]',
})
export class NestedDropdownDirective {
  opened = false;
  isHoveringOverSubmenu = false;
  @Input() options: Option[] = [];

  @Output() optionSelected = new EventEmitter<Option>();

  mouseEnterSub: Subscription | null = null;
  mouseLeaveSub: Subscription | null = null;

  constructor(
    private _elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    fromEvent(this._elementRef.nativeElement, 'mouseenter')
      .pipe(
        exhaustMap(() => of(event as PointerEvent).pipe(delay(200))),
        filter(() => !this.isHoveringOverSubmenu)
      )
      .subscribe({
        next: (event: PointerEvent) => {
          const componentRef =
            this._viewContainerRef.createComponent(ContextDropdownView);
          componentRef.instance.options = this.options;
          this._cdr.detectChanges();

          const adjustedPosition = this._setPosition(
            event,
            event.target as HTMLElement
          );
          componentRef.instance.x = adjustedPosition.x;
          componentRef.instance.y = adjustedPosition.y;

          this.isHoveringOverSubmenu = false;

          const submenuElement = componentRef.instance.dropdownElement;

          this.mouseEnterSub = fromEvent(
            submenuElement,
            'mouseenter'
          ).subscribe(() => {
            this.isHoveringOverSubmenu = true;
          });
          this.mouseLeaveSub = fromEvent(
            submenuElement,
            'mouseleave'
          ).subscribe(() => {
            this.isHoveringOverSubmenu = false;
          });
        },
      });

    fromEvent(this._elementRef.nativeElement, 'mouseleave')
      .pipe(filter(() => !this.isHoveringOverSubmenu))
      .subscribe({
        next: () => {
          this.closeSubMenu();
        },
      });
  }

  openSubMenu(): void {}

  closeSubMenu(): void {
    if (this.mouseEnterSub) this.mouseEnterSub.unsubscribe();
    if (this.mouseLeaveSub) this.mouseLeaveSub.unsubscribe();

    this._viewContainerRef.clear();
    this.opened = false;
    this.isHoveringOverSubmenu = false;
  }
  ngOnDestroy(): void {
    this.closeSubMenu();
  }

  private _setPosition(
    event: PointerEvent,
    eventTarget: HTMLElement
  ): Position {
    const targetRect = eventTarget.getBoundingClientRect();
    //console.log(event.target, targetRect);

    let xPosition = targetRect.width;
    let yPosition = targetRect.height;

    if (window.innerWidth < event.clientX + xPosition) {
      xPosition -= xPosition;
    }

    if (window.innerHeight < event.clientY + yPosition) {
      yPosition -= yPosition;
    }

    return { x: xPosition, y: yPosition };
  }
}
