import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { Option } from '../model/option';
import { Subscription } from 'rxjs';
import { Position } from './context-dropdown.directive';

@Directive({
  selector: '[nested-dropdown]',
})
export class NestedDropdownDirective implements OnInit, OnDestroy {
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

  ngOnInit(): void {}

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

  ngOnDestroy(): void {}
}
