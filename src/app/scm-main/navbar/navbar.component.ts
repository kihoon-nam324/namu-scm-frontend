import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
//import * as firebase from 'firebase/compat/app';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { DataStoreService } from '../../shared/data-store.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../product/product.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'scm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  //session$: Observable<boolean>;
  session$!: Observable<boolean>;
  sessionBtnName = 'NAVBAR.LOGIN';
  searchInput: any;

  constructor(
    public translate: TranslateService,
    private dataStoreService: DataStoreService,
    private toastr: ToastrService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) { 
  }

  switchLang(lang: string){
    this.translate.use(lang);
  }

  ngOnInit() {
    let emailVerified = localStorage.getItem('emailVerified');
  
    this.session$ = this.afAuth.authState.pipe(map(user => !!user));
    this.session$.subscribe(auth => this.sessionBtnName = auth && (emailVerified || emailVerified === "true") ? 'NAVBAR.LOGOUT' : 'NAVBAR.LOGIN');
  }

  checkSession() {
    this.session$.pipe(take(1)).subscribe(s => {
      if(s) {
        //this.afAuth.signOut();
        this.afAuth.signOut().then( () => {
          localStorage.removeItem('token');
          localStorage.removeItem('emailVerified');
          this.router.navigate(['/login']);
        }, err => {
          this.toastr.error(`${err.message}`
          , `${this.translate.instant('MESSAGE.AUTHENTICATION_MANAGEMENT')}`);
        })
      } else {
        this.router.navigate(['/login'])
      }
      //s ? this.afAuth.signOut() :  this.router.navigate(['/login'])
    });
     //this.afAuth.signInWithRedirect(new firebase.auth.GoogleAuthProvider()));
   
  }

  searchProduct(no: number) {
    this.dataStoreService.findObject$<Product>('product', no)
      .subscribe(obj => {
        debugger;
        if (obj) {
          this.router.navigate(['product-list', 'product', no], { queryParams: { action: 'edit' } });
        } else  {
          this.toastr.warning(`${this.translate.instant('MESSAGE.PRODUCT_CANNOT_FIND_MESSAGE')}`);
        }
      });
  }
}
