import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextDropdownView } from './view/context-dropdown.view';
import { ContextDropdownDirective } from './directives/context-dropdown.directive';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

const views = [ContextDropdownView];

const directives = [ContextDropdownDirective];

@NgModule({
  declarations: [...views, ...directives],
  exports: [...views, ...directives],
  imports: [MatMenuModule, MatButtonModule, CommonModule],
})
export class ContextDropdownModule {}
