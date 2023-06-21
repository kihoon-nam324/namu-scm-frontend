import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Category } from '../category.model';
import { DataStoreService } from '../../shared/data-store.service';
import { Observable } from 'rxjs';

@Injectable()
export class CategoryDetailResolverService implements Resolve<Category> {

  constructor(private database: DataStoreService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    //if ( route.queryParams.action === 'create' ) {
    //   return null;
    // }

    return this.database
    //.findObject$<Category>('category', route.params.no)
    .findObject$<Category>('category', route.params['no'])
    //.pipe(category => {
    .pipe((category:any) => {
      if (category) {
        return category;
      }

      this.router.navigate(['/category-list']);
      return null;
    });
  }
}
