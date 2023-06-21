import { Injectable, Inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CAT_LIST_PAGE_SIZE } from '../category.tokens';
import { DataStoreService } from '../../shared/data-store.service';
import { switchMap, tap } from 'rxjs/operators';

@Injectable()
export class CategoryListResolverService implements Resolve<any> {

  constructor(private database: DataStoreService,
              @Inject(CAT_LIST_PAGE_SIZE) private pageSize: number) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.database.findListItemCount('category')
    .pipe(switchMap(cnt => this.database.findList$ByPage('category', 1, this.pageSize, cnt)));
  }
}
