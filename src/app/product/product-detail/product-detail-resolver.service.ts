import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProdStatus } from '../product.model';
import { DataStoreService } from '../../shared/data-store.service';

import { Categories } from '../../category/category.model';

@Injectable()
export class ProductDetailResolverService implements Resolve<Product> {
  //usedCats: Categories;
  usedCats!: Categories;

  constructor(private database: DataStoreService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    //const objectSnapshot$ = this.database.findObject$<Product>('product', route.params.no);
    const objectSnapshot$ = this.database.findObject$<Product>('product', route.params['no']);
    const usedCat$ = this.database.findList$ByQuery('category', 'isUse', 1);

    //const action = route.queryParams.action;
    const action = route.queryParams['action'];
    if ( action === 'create' ) {
      usedCat$.pipe(map(cats => this.usedCats));
      return usedCat$.pipe(map(cats => [new Product(0, ProdStatus.WAIT_FOR_SALE), cats]));
    }

    return zip(objectSnapshot$, usedCat$).pipe(map(data => {
    if ( data[0] === null ) {
      this.router.navigate(['/product-list']);
      return null;
    }

    return data;
    }));
  }
}
