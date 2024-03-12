import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Option } from '../../model/option';
import { filter, fromEvent, Subject } from 'rxjs';
import { ContextDropdownView } from '../../view/context-dropdown.view';

@Component({
  selector: 'custom-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css']
})
export class OptionComponent implements OnInit {

  @Input() option!: Option;
  @Input() index!: number;
  @Input() closeRef!: Subject<Option>;

  @Output() hoveredOption = new EventEmitter<Option>();

  opened = false;

  constructor(
    private _elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef,
  ) {}

  ngOnInit(): void {

    this.closeRef.pipe(
      filter((option) => option.id != this.option.id)
    ).subscribe({
      next: () => {
        this._viewContainerRef.clear();
        this.opened = false;
      }
    })

    fromEvent(this._elementRef.nativeElement, 'mouseover').pipe(
      filter((event) => this._targetsCurrentOption(event as PointerEvent)),
      filter(() =>
        this.option.subOptions != null && this.option.subOptions.length > 0 && !this.opened
      )
    ).subscribe({
      next: () => {
        const viewRef = this._viewContainerRef.createComponent(ContextDropdownView);
        const currentOption = (this._elementRef.nativeElement as HTMLElement);
        viewRef.instance.x = currentOption.offsetWidth + 10;
        viewRef.instance.y = this.index * currentOption.offsetHeight;
        viewRef.instance.options = this.option.subOptions!!;
        this.opened = true;
        this.hoveredOption.emit(this.option);
      }
    });

  }

  private _targetsCurrentOption(event: PointerEvent): boolean {
    const target = event.target;
    console.log(target);
    console.log(this._elementRef.nativeElement.contains(target));
    return this._elementRef.nativeElement.contains(target);
    // return false;
  }
}
