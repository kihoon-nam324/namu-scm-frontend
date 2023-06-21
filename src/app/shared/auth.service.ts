import { Injectable } from '@angular/core';
import { AngularFireAuth } from  '@angular/fire/compat/auth'
import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth : AngularFireAuth, 
    private router : Router,
    private toastr: ToastrService,
    private translate: TranslateService) { }

  // login method
  login(email : string, password : string) {
    this.fireauth.signInWithEmailAndPassword(email,password).then( res => {
      localStorage.setItem('token','true');

      if(res.user?.emailVerified == true){
        localStorage.setItem('emailVerified', 'true');
        this.router.navigate(['dashboard']);
      } else {
        this.router.navigate(['/verify-email']);
      }
    }, err => {
      //alert(err.message);
      //alert("Login failed");
      this.toastr.error(`${this.translate.instant('MESSAGE.LOGIN_FAILED')}`
      , `${this.translate.instant('MESSAGE.AUTHENTICATION_MANAGEMENT')}`);
      this.router.navigate(['/login']);
    })
  }

  // register method
  register(email : string, password : string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then( res => {
      //alert('Registration Successful');
      this.toastr.success(`${this.translate.instant('MESSAGE.REGISTRATION_SUCCESSFUL')}`
      , `${this.translate.instant('MESSAGE.AUTHENTICATION_MANAGEMENT')}`);
      this.sendEmailVerification(res.user);
      //this.router.navigate(['/login']);
    }, err => {
      //alert(err.message);
      this.toastr.error(`${err.message}`
      , `${this.translate.instant('MESSAGE.AUTHENTICATION_MANAGEMENT')}`);
      this.router.navigate(['/register']);
    })
  }

  // sign out
  logout() {
    this.fireauth.signOut().then( () => {
      localStorage.removeItem('token');
      localStorage.removeItem('emailVerified');
      this.router.navigate(['/login']);
    }, err => {
      //alert(err.message);
      this.toastr.error(`${err.message}`
      , `${this.translate.instant('MESSAGE.AUTHENTICATION_MANAGEMENT')}`);
    })
  }

  // forgot password
  forgotPassword(email : string){
    this.fireauth.sendPasswordResetEmail(email).then(() => {
      this.router.navigate(['/verify-email']);
    }, err => { 
      //alert('Something went wrong');
      this.toastr.error(`${this.translate.instant('MESSAGE.SOMETHING_WENT_WRONG')}`
      , `${this.translate.instant('MESSAGE.AUTHENTICATION_MANAGEMENT')}`);
    })
  }

  // email verification
  sendEmailVerification(user : any) {
    user.sendEmailVerification().then((res : any) => {
      this.fireauth.signOut();
      localStorage.removeItem('token');
      this.router.navigate(['/verify-email']);
    }, (err: any) => {
      //alert('Something went wrong. Not able to send mail to your email');
      this.toastr.error(`${this.translate.instant('MESSAGE.NOT_ABLE_TO_SEND_EMAIL')}`
      , `${this.translate.instant('MESSAGE.AUTHENTICATION_MANAGEMENT')}`);
    })
  }

  // sign in with google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res => {
      this.router.navigate(['/dashboard']);
      localStorage.setItem('token', JSON.stringify(res.user?.uid));
    }, err => {
      alert(err.message);
    })
  }
}
