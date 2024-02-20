import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'context-dropdown-view',
  templateUrl: './context-dropdown.view.html',
  styleUrls: ['./context-dropdown.view.css']
})
export class ContextDropdownView implements OnInit {

  @Input(
  ) x!: number;
  @Input(
  ) y!: number;

  ngOnInit() {
  }


  get xCord() {
    return `${this.x}px`;
  }

  get yCord() {
    return `${this.y}px`;
  }
}
