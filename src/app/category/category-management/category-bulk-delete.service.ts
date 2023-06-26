import { Injectable } from '@angular/core';
import { CurrentPageCategorySetService } from './currentpage-category-set.service';
import { Category } from '../category.model';
import { DataStoreService } from '../../shared/data-store.service';
import { Observable } from 'rxjs';
import { mergeMap, reduce, map, tap, take } from 'rxjs/operators';

export declare type DeleteResult = [boolean, number];

@Injectable()
export class CategoryBulkDeleteService {

  constructor(private database: DataStoreService, private categorySet: CurrentPageCategorySetService) { }

  public bulkDeleteStart() {
    const modifyCategoryFn = (category: Category) => {
      return category;
    };

    return this._bulkDelete(modifyCategoryFn);
  }

  private _bulkDelete(deleteFn: (Category: any) => Category) {
    const delete$ = this.categorySet.nos$()
      .pipe(mergeMap((no: number) => this.database.findObject$<Category>('category', no)))
      .pipe(take(1))
      .pipe(map(category => {
          if (category) { return category; }
          throw new Error('failed to fetch value');
        }
      ))
      .pipe(tap(deleteFn))
      .pipe(mergeMap(category =>
        this.database.delete('category', category.no, null).toPromise().then(() => [true, category.no]).catch((e) => [false, category.no])
      ));
    return this.handleBulkDelete$(delete$);
  }

  private handleBulkDelete$(delete$: Observable<any>) {

    //return delete$.pipe(reduce<any>((acc, r: DeleteResult) => {
    return delete$.pipe(reduce<any, any>((acc, r: DeleteResult) => {
      if ( r[0] ) {
        acc.success.push(r[1]);
      } else {
        acc.fail.push(r[1]);
      }
      return acc;
    }, {success: [], fail: []}))
        .pipe(tap(result => {
          if ( result.fail.length > 0 ) {
            throw new Error(`${result.fail.join(', ')}`);
          }
        }))
        .pipe(map(result => result.success));
  }
}
