import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';
import { Options } from '@angular/cli/src/command-builder/command-module';
import { Option } from '../model/option';

@Component({
  selector: 'context-dropdown-view',
  templateUrl: './context-dropdown.view.html',
  styleUrls: ['./context-dropdown.view.css']
})
export class ContextDropdownView implements OnInit, AfterViewInit {

  @Input(
  ) x!: number;
  @Input(
  ) y!: number;

  @Input() options!: Option[];

  constructor(
    private _elementRef: ElementRef,
  ) {}

  ngOnInit() {
  }


  get xCord() {
    return `${this.x}px`;
  }

  get yCord() {
    return `${this.y}px`;
  }

  get elementRef() {
    return this._elementRef;
  }

  ngAfterViewInit(): void {
    console.log(this.elementRef.nativeElement.childNodes[0].offsetHeight);
  }
}
