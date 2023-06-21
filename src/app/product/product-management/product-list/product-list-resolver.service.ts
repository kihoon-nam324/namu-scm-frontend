import { Injectable, Inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { tap, switchMap, take } from 'rxjs/operators';
import { Products } from '../../product.model';
import { PROD_LIST_PAGE_SIZE } from '../../product.tokens';
import { DataStoreService } from '../../../shared/data-store.service';

@Injectable()
export class ProductListResolverService implements Resolve<any> {

  constructor(private database: DataStoreService,
              @Inject(PROD_LIST_PAGE_SIZE) private pageSize: number) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.database.findListItemCount('product')
    .pipe(switchMap(cnt => this.database.findList$ByPage('product', 1, this.pageSize, cnt)));
  }
}
