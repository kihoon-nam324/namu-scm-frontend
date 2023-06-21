import { Injectable } from '@angular/core';
import { CheckedProductSetService } from './checked-product-set.service';
import { Product } from '../product.model';
import { DataStoreService } from '../../shared/data-store.service';
import { Observable } from 'rxjs';
import { mergeMap, reduce, map, tap, take } from 'rxjs/operators';

export declare type DeleteResult = [boolean, number];

@Injectable()
export class ProductBulkDeleterService {

  constructor(private database: DataStoreService, private prodSet: CheckedProductSetService) { }

  public bulkDeleteStart() {
    const modifyProductFn = (prod: Product) => {
      return prod;
    };

    //return this._bulkDelete(modifyProductFn);
  }

  //private _bulkDelete(deleteFn: (Product) => Product) {
  
  // private _bulkDelete(deleteFn: (arg0: Product) => Product) {
  //   const delete$ = this.prodSet.nos$()
  //     .pipe(mergeMap((no: number) => this.database.findObject$<Product>('product', no)
  //     .pipe(take(1))))
  //     .pipe(map(product => {
  //       if (product) {
  //         return product;
  //       }
  //       throw new Error('failed to fetch value');
  //       }
  //     ))
  //     .pipe(tap(deleteFn))
  //     .pipe(mergeMap(prod =>
  //       this.database.delete('product', prod.no, prod.productImage).toPromise().then(() => [true, prod.no]).catch((e) => [false, prod.no])
  //     ));

  //   return this.handleBulkDelete$(delete$);
  // }

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
