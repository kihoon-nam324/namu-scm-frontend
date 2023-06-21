import { Injectable } from '@angular/core';
import { DataStoreService } from '../data-store.service';
import { Observable, from } from 'rxjs';
import { reduce, map, tap, concatMap } from 'rxjs/operators';
import { ScmSharedUtil, ScmDomain } from 'src/app/shared/scm-shared-util';
import { Category } from 'src/app/category/category.model';
import { Product } from 'src/app/product/product.model';
import { TranslateService } from '@ngx-translate/core';

export declare type CreateResult = [boolean, number];

@Injectable()
export class ModelBulkCreateService {
  model$;
  succeedCnt = 0;
  failedCnt = 0;

  constructor(
    private database: DataStoreService,
    private translate: TranslateService
    ) { }

  public updateData(modelName: ScmDomain, modelList: any[]) {
    let tmpCategory: Category;
    let tmpProduct: Product;
    const tmpModelList = [];

    if (modelName === 'category') {
      modelList.forEach((model) => {
        tmpCategory = {
          no: Number(0),
          name: model.name,
          desc: model.desc,
          //isUse: Boolean(JSON.parse(model.isUse)),
          //isUse: model.isUse,
          isUse: +model.isUse,
          createdTime: ScmSharedUtil.getCurrentDateTime(),
          updatedTime: '0001-01-01T00:00:00'
        };

        tmpModelList.push(tmpCategory);
      });
    } else if (modelName === 'product') {
      modelList.forEach((model) => {
        tmpProduct = {
          no: Number(0),
          name: model.name,
          listPrice: +model.listPrice,
          //isUse: Boolean(JSON.parse(model.isUse)),
          //isUse: model.isUse,
          isUse: +model.isUse,
          status: +model.status,
          qty: +model.qty,
          desc: model.desc,
          catNo: Number(model.catNo),
          productImage: model.productImage,
          productImageUrl: model.productImageUrl,
          createdTime: ScmSharedUtil.getCurrentDateTime(),
          updatedTime: '0001-01-01T00:00:00'
        };

        tmpModelList.push(tmpProduct);
      });
    }
    
    return this._bulkCreate(modelName, tmpModelList);
  }

  private _bulkCreate(modelName: ScmDomain, modelList: any[]) {
    this.model$ = from(Array.from(modelList));

    if (modelName === 'category') {
      const categoryCreate$ = this.model$
      .pipe(concatMap((category: Category) =>
        this.database.create(modelName, category).toPromise().then(() => [true]).catch((e) => [false])));
      return this.handleBulkCreate$(categoryCreate$);
    } else if (modelName === 'product') {
      const productCreate$ = this.model$
        .pipe(concatMap((product: Product) =>
          this.database.create(modelName, product).toPromise().then(() => [true]).catch((e) => [false])));
      return this.handleBulkCreate$(productCreate$);
    }
  }

  private handleBulkCreate$(create$: Observable<any[]>) {

    return create$.pipe(reduce<any>((acc, r: CreateResult) => {
      if ( r[0] ) {
        this.succeedCnt++;
      } else {
        this.failedCnt++;
      }
      return acc;
    }, {success: [], fail: []}))
        .pipe(tap(() => {
          if ( this.failedCnt > 0 ) {
            throw new Error(`${this.failedCnt}${this.translate.instant('MESSAGE.ADD_FAILURE_MESSAGE')}`);
          }
        }))
        .pipe(map(() => `${this.succeedCnt}${this.translate.instant('MESSAGE.ADD_SUCCESS_MESSAGE')}`));
    }
}
