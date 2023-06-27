import { Injectable } from '@angular/core';
import { AngularFireAuth } from  '@angular/fire/compat/auth'
import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';
import { Router, NavigationExtras } from '@angular/router';
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
      if(res.user?.emailVerified == true){
        localStorage.setItem('token', JSON.stringify(res.user?.uid));
        //this.router.navigate(['dashboard']);
        this.router.navigate(['/']).then(() => { 
          window.location.reload(); 
        });
      } else {
        this.router.navigate(['/']);
      }
    }, err => {
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
      this.toastr.error(`${err.message}`
      , `${this.translate.instant('MESSAGE.AUTHENTICATION_MANAGEMENT')}`);
      this.router.navigate(['/register']);
    })
  }

  // sign out
  logout() {
    this.fireauth.signOut().then( () => {
      localStorage.removeItem('token');
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
      this.toastr.error(`${this.translate.instant('MESSAGE.NOT_ABLE_TO_SEND_EMAIL')}`
      , `${this.translate.instant('MESSAGE.AUTHENTICATION_MANAGEMENT')}`);
    })
  }

  // sign in with google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res => {
      localStorage.setItem('token', JSON.stringify(res.user?.uid));
      this.router.navigate(['/']).then(() => { 
        window.location.reload(); 
      });
    }, err => {
      alert(err.message);
    })
  }
}
