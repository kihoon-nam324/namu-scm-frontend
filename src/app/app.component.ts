import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from './shared/loading-spinner/spinner.service';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'scm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private toastr: ToastrService,
              router: Router,
              spinner: SpinnerService,
              translate:TranslateService) {
    router.events.subscribe(e => this.handleRouteEvent(spinner, e));
    translate.addLangs(['kr','jp']);
    translate.setDefaultLang('kr');
    translate.use('kr')
  }

  handleRouteEvent(spinner: SpinnerService, e: RouterEvent): void {
    if ( e instanceof NavigationStart ) { spinner.start(); }

    const isNavigationEnd = e instanceof NavigationEnd ||
      e instanceof NavigationCancel || e instanceof NavigationError;

    if ( isNavigationEnd ) { spinner.stop(); }
  }
}
