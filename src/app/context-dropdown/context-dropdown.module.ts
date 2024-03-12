import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextDropdownView } from './view/context-dropdown.view';
import { ContextDropdownDirective } from './directives/context-dropdown.directive';
import { NestedDropdownDirective } from './directives/nested-dropdown-directive';

const views = [ContextDropdownView];

const directives = [ContextDropdownDirective, NestedDropdownDirective];

const modules = [CommonModule];

@NgModule({
  declarations: [...views, ...directives],
  exports: [...views, ...directives],
  imports: [...modules],
})
export class ContextDropdownModule {}
