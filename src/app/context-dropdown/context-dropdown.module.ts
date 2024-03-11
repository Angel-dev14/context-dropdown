import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextDropdownView } from './view/context-dropdown.view';
import { ContextDropdownDirective } from './directives/context-dropdown.directive';

const views = [ContextDropdownView];

const directives = [ContextDropdownDirective];

const modules = [CommonModule];

@NgModule({
  declarations: [...views, ...directives],
  exports: [...views, ...directives],
  imports: [...modules],
})
export class ContextDropdownModule {}
