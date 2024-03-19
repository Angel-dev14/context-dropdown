import { Injector, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ContextDropdownModule } from './context-dropdown/context-dropdown.module';
import { RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ItemAComponent } from './item-a/item-a.component';
import { ItemChildAComponent } from './item-a/item-child-a/item-child-a.component';
import { LoggerService } from './logger/logger.service';
import { CustomDirective } from './custom.directive';
import { LegacyLogger } from './logger/legacy.logger';
import { APP_CONFIG_TOKEN } from './config/app-config';

const materialComponents = [MatMenuModule, MatMenuTrigger, MatButtonModule];
const modules = [CommonModule, ContextDropdownModule, BrowserModule];

@NgModule({
  declarations: [
    AppComponent,
    ItemAComponent,
    ItemChildAComponent,
  ],
  providers: [
    {
      provide: APP_CONFIG_TOKEN,
      useFactory: (injector: Injector) => {
        injector.get(LoggerService).log('grey')
        return {
          color: 'grey'
        }
      },deps: [Injector]
    },
    LegacyLogger,
    {
      provide: LoggerService,
      useExisting: LegacyLogger
    },

  ],
  imports: [
    ...modules, ...materialComponents, RouterOutlet, CommonModule, CustomDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
