import { Directive, ElementRef, OnInit, ViewContainerRef } from '@angular/core';
import { filter, fromEvent, map, takeWhile } from 'rxjs';
import { ContextDropdownView } from '../view/context-dropdown.view';
import { fakeAsync } from '@angular/core/testing';

@Directive({
  selector: '[context-dropdown]'
})
export class ContextDropdownDirective implements OnInit {

  opened = false;

  constructor(
    private _elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef,
  ) {}

  ngOnInit() {
    console.log(this._elementRef);
    fromEvent(this._elementRef.nativeElement,'contextmenu').pipe(
      filter(() => !this.opened),
      map(event => event as PointerEvent),
    ).subscribe({
      next: (event: PointerEvent) => {
        event.preventDefault();
        const componentRef = this._viewContainerRef.createComponent(
          ContextDropdownView,
        );
        componentRef.instance.x = event.clientX;
        componentRef.instance.y = event.clientY;
        this.opened = true;
      }
    });

    fromEvent(document, 'contextmenu').pipe(
      filter((event) => !this.eventMatchesCurrentContext(event))
    ).subscribe({
      next: (value) => {
        this._viewContainerRef.clear();
        this.opened = false;
      }
    })

    fromEvent(document, 'click').pipe(
     // filter(event => event.target.c )
    ).subscribe({
      next: value => {
        console.log(value.target);

        this._viewContainerRef.clear();
        this.opened = false;
      }
    })
  }

  eventMatchesCurrentContext(event: Event) {
    const target = event.target as HTMLElement;
    return (this._elementRef.nativeElement as HTMLElement).contains(target)
  }
}
