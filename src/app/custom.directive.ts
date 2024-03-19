import { Directive, Host } from '@angular/core';
import { LoggerService } from './logger/logger.service';

@Directive({
  selector: '[appCustom]',
  standalone: true,
  providers: []
})
export class CustomDirective {


}
