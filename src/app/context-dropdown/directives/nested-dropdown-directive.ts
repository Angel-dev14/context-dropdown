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
import { Subscription, filter, fromEvent, map } from 'rxjs';
import { ContextDropdownView } from '../view/context-dropdown.view';
import { Position } from './context-dropdown.directive';

@Directive({
  selector: '[nested-dropdown]',
})
export class NestedDropdownDirective {
  opened = false;

  @Input() options: Option[] = [];

  @Output() optionSelected = new EventEmitter<Option>();

  constructor(
    private _elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    fromEvent(this._elementRef.nativeElement, 'mouseenter')
      .pipe(map((event) => event as PointerEvent))
      .subscribe({
        next: (event: PointerEvent) => {
          const componentRef =
            this._viewContainerRef.createComponent(ContextDropdownView);
          componentRef.instance.options = this.options;
          this._cdr.detectChanges();
          const dimensions: Position = {
            x: componentRef.instance.dropdownElement.offsetWidth,
            y: componentRef.instance.dropdownElement.offsetHeight,
          };

          const adjustedPosition = this._setPosition(event, dimensions);
          componentRef.instance.x = adjustedPosition.x;
          //componentRef.instance.y = adjustedPosition.y;

          this.opened = true;
        },
      });

    fromEvent(this._elementRef.nativeElement, 'mouseleave')
      .pipe(filter(() => this.isHoveringCurrentSubmenu()))
      .subscribe(() => this.closeSubMenu());
  }

  openSubMenu(): void {}

  closeSubMenu(): void {
    this._viewContainerRef.clear();
  }

  ngOnDestroy(): void {
    this.closeSubMenu();
  }

  private isHoveringCurrentSubmenu(): boolean {
    return false;
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
}
