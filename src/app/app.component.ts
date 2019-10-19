import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';
import { browser } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private loggingService: LoggingService, 
    public translate: TranslateService) {
      translate.addLangs(['en', 'sr']);
      translate.setDefaultLang('en');
      // const browserLang = translate.getBrowserLang();
      // translate.use(browserLang.match(/en|sr/) ? browserLang : 'en');
    }
  loadedFeature = 'recipe';

  ngOnInit() {
    this.authService.autoLogin();
  }


}
