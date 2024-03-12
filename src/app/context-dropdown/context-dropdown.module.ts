import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextDropdownView } from './view/context-dropdown.view';
import { ContextDropdownDirective } from './directives/context-dropdown.directive';
import { NestedDropdownDirective } from './directives/nested-dropdown-directive';
import { MatIconModule } from '@angular/material/icon';
import { OptionComponent } from './components/option/option.component';

const components = [OptionComponent]

const views = [ContextDropdownView];

const directives = [ContextDropdownDirective, NestedDropdownDirective];

const modules = [CommonModule];

const materialModules = [MatIconModule]

@NgModule({
  declarations: [...views, ...directives, ...components],
  exports: [...views, ...directives],
  imports: [...modules, ...materialModules],
})
export class ContextDropdownModule {}
