import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'scm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email : string = '';
  password : string = '';

  constructor(
    private auth : AuthService,
    private toastr: ToastrService,
    private translate: TranslateService) { }

  ngOnInit(): void {
  }

  login() {
    if(this.email == '') {
      //alert('Please enter email');
      this.toastr.error(`${this.translate.instant('MESSAGE.PLEASE_ENTER_EMAIL')}`
      , `${this.translate.instant('MESSAGE.AUTHENTICATION_MANAGEMENT')}`);

      return;
    }

    if(this.password == '') {
      //alert('Please enter password');
      this.toastr.error(`${this.translate.instant('MESSAGE.PLEASE_ENTER_PASSWORD')}`
      , `${this.translate.instant('MESSAGE.AUTHENTICATION_MANAGEMENT')}`);
      return;
    }

    this.auth.login(this.email, this.password);
    
    this.email = '';
    this.password = '';
  }

  signInWithGoogle() {
    this.auth.googleSignIn();
  }
}
