import { Directive, ElementRef, Input, NgZone, OnInit, ViewContainerRef } from '@angular/core';
import { filter, fromEvent, map } from 'rxjs';
import { ContextDropdownView } from '../view/context-dropdown.view';
import { Option } from '../model/option';

@Directive({
  selector: '[context-dropdown]'
})
export class ContextDropdownDirective implements OnInit {

  opened = false;
  @Input() options: Option[] = [];

  constructor(
    private _elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    private _ngZone: NgZone
  ) {}

  ngOnInit() {
    fromEvent(this._elementRef.nativeElement, 'contextmenu').pipe(
      filter(() => !this.opened),
      map(event => event as PointerEvent)
    ).subscribe({
      next: (event: PointerEvent) => {
        event.preventDefault();
        const componentRef = this._viewContainerRef.createComponent(
          ContextDropdownView
        );
        console.log(event);
        let x = 0;
        let y = 0;
        const elementRef = componentRef.instance.elementRef;
        componentRef.instance.options = this.options;
        componentRef.changeDetectorRef.detectChanges();
        if (window.innerHeight < event.clientY + elementRef.nativeElement.childNodes[0].offsetHeight) {
          y = event.pageY - elementRef.nativeElement.childNodes[0].offsetHeight;
        } else {
          y = event.pageY;
        }
        if (window.innerWidth < event.clientX + elementRef.nativeElement.childNodes[0].offsetWidth) {
          x = event.pageX - elementRef.nativeElement.childNodes[0].offsetWidth;
        } else {
          x = event.pageX;
        }
        componentRef.instance.x = x;
        componentRef.instance.y = y;
        this.opened = true;
      }
    });

    fromEvent(this._elementRef.nativeElement, 'click').pipe(
      map(event => event as PointerEvent),
      filter(event => this.eventMatchesCurrentContext(event))
    ).subscribe({
      next: () => {
        this._viewContainerRef.clear();
        this.opened = false;
      }
    });

    this._ngZone.runOutsideAngular(() => {
      fromEvent(document, 'contextmenu').pipe(
        filter((event) => !this.eventMatchesCurrentContext(event) && this.opened)
      ).subscribe({
        next: () => {
          this._ngZone.run(() => {
            this._viewContainerRef.clear();
            this.opened = false;
          });
        }
      });

      fromEvent(document, 'click').pipe(
        filter(event => !this.eventMatchesCurrentContext(event) && this.opened)
      ).subscribe({
        next: () => {
          this._ngZone.run(() => {
            this._viewContainerRef.clear();
            this.opened = false;
          });
        }
      });

    });

  }

  eventMatchesCurrentContext(event: Event) {
    const target = event.target as HTMLElement;
    return (this._elementRef.nativeElement as HTMLElement).contains(target);
  }
}
