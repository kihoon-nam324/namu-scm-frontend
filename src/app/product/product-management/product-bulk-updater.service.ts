import { Injectable } from '@angular/core';
import { CheckedProductSetService } from './checked-product-set.service';
import { Product, ProdStatus } from '../product.model';
import { DataStoreService } from '../../shared/data-store.service';
import { Observable, pipe } from 'rxjs';
import { mergeMap, reduce, map, tap, take } from 'rxjs/operators';
import { ScmSharedUtil } from 'src/app/shared/scm-shared-util';

export declare type UpdateResult = [boolean, number];

@Injectable()
export class ProductBulkUpdaterService {

  constructor(private database: DataStoreService, private prodSet: CheckedProductSetService) { }

  updateProductsToSell() {
    return this.updateStatus(ProdStatus.ON_SALE);
  }

  updateProductsToStop() {
    return this.updateStatus(ProdStatus.NOT_FOR_SALE);
  }

  private updateStatus(status: ProdStatus) {
    const modifyProductFn = (prod: Product) => {
      prod.status = status;
      prod.updatedTime = ScmSharedUtil.getCurrentDateTime();
      return prod;
    };

    return this._bulkUpdate(modifyProductFn);
  }

  //private _bulkUpdate(updateFn: (Product) => Product) {
  
  private _bulkUpdate(updateFn: (Product: any) => Product) {
    // const update$ = this.prodSet.nos$()
    // .pipe(
    //   mergeMap((no: number) =>
    //     this.database.findObject$<Product>('product', no).pipe(take(1))
    //   ),
    //   map((product: Product) => {
    //     if (product) { return product; }
    //     throw new Error('failed to fetch value');
    //   }),
    //   tap(updateFn),
    //   mergeMap((prod: Product) =>
    //     this.database
    //       .update('product', prod)
    //       .then(() => [true, prod.no])
    //       .catch((e) => [false, prod.no])
    //   )
    // );

    // return this.handleBulkUpdate$(update$);


    // const update$ = this.prodSet.nos$()
    //   //.pipe(mergeMap((no: number) => this.database.findObject$<Product>('product', no)
    //   .pipe(mergeMap((no: number) => this.database.findObject$<Product>('product', no)
    //   .pipe(take(1))))
    //   //.pipe(map(product => {
    //   .pipe(map(product => {
    //     if (product) {
    //       return product;
    //     }

    //     throw new Error('failed to fetch value');

    //     }
    //   ))
    //   .pipe(tap(updateFn))
    //   .pipe(mergeMap(prod =>
    //     this.database.update('product', prod).toPromise().then(() => [true, prod.no]).catch((e) => [false, prod.no])
    //   ));

    // return this.handleBulkUpdate$(update$);
  }

  private handleBulkUpdate$(update$: Observable<any>) {

    //return update$.pipe(reduce<any>((acc, r: UpdateResult) => {
    return update$.pipe(reduce<any, any>((acc, r: UpdateResult) => {
      if ( r[0] ) {
        acc.success.push(r[1])
      } else {
        acc.fail.push(r[1]);
      }
      return acc;
  //}, {success: [], fail: []}))
    }, {success:[], fail:[]}))
     // .pipe(tap(result => {
      .pipe(tap((result) => {
        if ( result.fail.length > 0 ) {
          throw new Error(`${result.fail.join(', ')}`);
        }
      }))
      .pipe(map(result => result.success));
  }
}
