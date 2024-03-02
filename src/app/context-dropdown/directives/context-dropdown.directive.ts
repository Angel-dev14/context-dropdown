import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { Subscription, filter, fromEvent, map } from 'rxjs';
import { ContextDropdownView } from '../view/context-dropdown.view';
import { Option } from '../model/option';

@Directive({
  selector: '[context-dropdown]',
})
export class ContextDropdownDirective implements OnInit {
  opened = false;
  @Input() options: Option[] = [];
  @Output() optionSelected = new EventEmitter<Option>();
  private selectedOptionSubscription: Subscription | null = null;

  constructor(
    private _elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    private _ngZone: NgZone
  ) {}

  ngOnInit() {
    fromEvent(this._elementRef.nativeElement, 'contextmenu')
      .pipe(
        filter(() => !this.opened),
        map((event) => event as PointerEvent)
      )
      .subscribe({
        next: (event: PointerEvent) => {
          event.preventDefault();
          // Initial timeout to delay the component creation
          // Removing this initial setTimeout causes the component to be created and positioned
          // at (0, 0) and then jumps to the correct coordinates if out of bounds
          // setTimeout triggers change detection for the entire app, detectChanges() only for the component + children
          setTimeout(() => {
            const componentRef =
              this._viewContainerRef.createComponent(ContextDropdownView);
            const dimensions = { x: 0, y: 0 };

            const { x, y } = this.setPosition(event, dimensions);
            componentRef.instance.options = this.options;
            componentRef.instance.x = x;
            componentRef.instance.y = y;

            setTimeout(() => {
              dimensions.x = componentRef.instance.dropdownElement.offsetWidth;
              dimensions.y = componentRef.instance.dropdownElement.offsetHeight;

              const adjustedPosition = this.setPosition(event, dimensions);
              componentRef.instance.x = adjustedPosition.x;
              componentRef.instance.y = adjustedPosition.y;
            });

            this.opened = true;
            this.selectedOptionSubscription =
              componentRef.instance.selectedOption.subscribe(
                (option: Option) => {
                  this.optionSelected.emit(option);
                }
              );
          });
        },
      });

    fromEvent(this._elementRef.nativeElement, 'click')
      .pipe(
        map((event) => event as PointerEvent),
        filter((event) => this.eventMatchesCurrentContext(event))
      )
      .subscribe({
        next: () => {
          this.closeMenu();
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
              this.closeMenu();
            });
          },
        });

      fromEvent(document, 'click')
        .pipe(
          filter(
            (event) => !this.eventMatchesCurrentContext(event) && this.opened
          )
        )
        .subscribe({
          next: () => {
            this._ngZone.run(() => {
              this.closeMenu();
            });
          },
        });
    });
  }

  eventMatchesCurrentContext(event: Event) {
    const target = event.target as HTMLElement;
    return (this._elementRef.nativeElement as HTMLElement).contains(target);
  }

  private closeMenu() {
    if (this.selectedOptionSubscription) {
      this.selectedOptionSubscription.unsubscribe();
      this.selectedOptionSubscription = null;
    }
    this._viewContainerRef.clear();
    this.opened = false;
  }

  private setPosition(
    event: PointerEvent,
    dimensions: { x: number; y: number }
  ): { x: number; y: number } {
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
