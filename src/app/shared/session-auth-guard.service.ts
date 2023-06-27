import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { take,map,tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class SessionAuthGuardService {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private afAuth: AngularFireAuth,
    private translate: TranslateService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let emailVerified = localStorage.getItem('emailVerified');
    let token = localStorage.getItem('token');

    //if ( if (token === "false" || (emailVerified === null || emailVerified === "false")) { || emailVerified === "false") {
    if ((token === "false" || emailVerified === "false")) {  
      this.toastr.error(`${this.translate.instant('MESSAGE.TRY_LOGIN')}`
          , `${this.translate.instant('MESSAGE.ERROR')}`);
          this.router.navigate(['/']);
    }

    return this.afAuth.authState
      .pipe(take(1))
      .pipe(map(user => !!user))
      .pipe(tap(authenticated => {
        if (!authenticated) {
          // this.toastr.error('ログインしてください', '[エラー]');
          // this.toastr.error('로그인하세요', '[에러]');
          this.toastr.error(`${this.translate.instant('MESSAGE.TRY_LOGIN')}`
          , `${this.translate.instant('MESSAGE.ERROR')}`);
          this.router.navigate(['/']);
        }
      }));
  }
}
