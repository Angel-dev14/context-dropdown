import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextDropdownView } from './view/context-dropdown.view';
import { ContextDropdownDirective } from './directives/context-dropdown.directive';
import { MatMenuModule } from '@angular/material/menu';

const views = [ContextDropdownView];

const directives = [ContextDropdownDirective];

@NgModule({
  declarations: [...views, ...directives],
  exports: [...views, ...directives],
  imports: [CommonModule, MatMenuModule],
})
export class ContextDropdownModule {}
