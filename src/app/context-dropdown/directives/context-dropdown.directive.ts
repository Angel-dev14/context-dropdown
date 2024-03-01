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
          const componentRef =
            this._viewContainerRef.createComponent(ContextDropdownView);
          console.log(event);
          componentRef.instance.options = this.options;
          componentRef.changeDetectorRef.detectChanges();
          let xPosition = event.pageX;
          let yPosition = event.pageY;
          const dropdownElementDimensions = {
            x: componentRef.instance.dropdownElement.offsetWidth,
            y: componentRef.instance.dropdownElement.offsetHeight,
          };
          if (
            window.innerHeight <
            event.clientY + dropdownElementDimensions.y
          ) {
            yPosition = event.pageY - dropdownElementDimensions.y;
          }
          if (window.innerWidth < event.clientX + dropdownElementDimensions.x) {
            xPosition = event.pageX - dropdownElementDimensions.x;
          }
          componentRef.instance.x = xPosition;
          componentRef.instance.y = yPosition;
          this.opened = true;
          this.selectedOptionSubscription =
            componentRef.instance.selectedOption.subscribe((option: Option) => {
              this.optionSelected.emit(option);
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
}
