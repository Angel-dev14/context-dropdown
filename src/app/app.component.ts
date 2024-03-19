import { Component, Inject, OnInit } from '@angular/core';
import { LoggerService } from './logger/logger.service';
import { APP_CONFIG_TOKEN, AppConfig } from './config/app-config';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [],
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {

  constructor(
    private loggerService: LoggerService,
    @Inject(APP_CONFIG_TOKEN) private appConfig: AppConfig,
  ) {}

  ngOnInit(): void {
    // console.log(this.loggerService)
    // if(!this.loggerService) {
    //   console.log('logger is undefined')
    // }
        this.loggerService.log('app component init')
    }


    get bColor() {
    return this.appConfig.color;
    }

}
