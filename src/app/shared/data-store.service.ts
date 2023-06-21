import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { HttpClient } from '@angular/common/http';
import { NoCounterService } from './no-counter.service';
import { ScmDomain } from './scm-shared-util';
import { tap,take,map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Category } from '../category/category.model';
import { Product } from '../product/product.model';
import { Observable } from 'rxjs';

@Injectable()
export class DataStoreService {
  constructor(
    private http: HttpClient,
    private db: AngularFireDatabase,
    private counter: NoCounterService) {
  }

  //create(domain: ScmDomain, formData) {
  create(domain: ScmDomain, formData: Category | Product | FormData) {
    const controllerName = domain.charAt(0).toUpperCase() + domain.slice(1);
    return this.http.post(environment.apiBaseURI + controllerName, formData);
  }

  delete(domain: ScmDomain, no: number, productImage: any) {
    const controllerName = domain.charAt(0).toUpperCase() + domain.slice(1);

    if(domain === 'product'){
      return this.http.delete(environment.apiBaseURI + controllerName + `/${no}`, { params: { fileName : productImage }});
    } 
    return this.http.delete(environment.apiBaseURI + controllerName + `/${no}`);
  }

  findObject$<T>(domain: ScmDomain, no: number) {
    const controllerName = domain.charAt(0).toUpperCase() + domain.slice(1);
    return this.http.get(environment.apiBaseURI + controllerName + `/${no}`);
  }

  findListItemCount(domain: ScmDomain) {
    const controllerName = domain.charAt(0).toUpperCase() + domain.slice(1) + 'ListGetCountAll';
    //return this.http.get(environment.apiBaseURI + controllerName);
    return this.http.get(environment.apiBaseURI + controllerName)
    //.pipe(map((result) => result[0].count));
    .pipe(map((result : any) => result[0].count));
  }

  findObjectSnapshot(domain: ScmDomain, no: number) {
    return this._findObject(domain, no, true).snapshotChanges().pipe(take(1));
  }

  findList$<T>(domain: ScmDomain) {
    const controllerName = domain.charAt(0).toUpperCase() + domain.slice(1);
    return this.http.get(environment.apiBaseURI + controllerName);
  }

  findList$ByQuery<T>(domain: ScmDomain, queryKey: string, queryVal: any) {
    const controllerName = domain.charAt(0).toUpperCase() + domain.slice(1) + 'ListGetByQuery';
    
    return this.http.post(environment.apiBaseURI + controllerName, {
      queryOptionName : queryKey,
      queryOptionValue : queryVal
    });
  }

  //findList$ByPage(domain: ScmDomain, pageNoParam, pageSizeParam, totalCntParam) {
  findList$ByPage(domain: ScmDomain, pageNoParam: number, pageSizeParam: number, totalCntParam: number) {  
  //findList$ByPage(domain: ScmDomain, pageNoParam: number, pageSizeParam: number, totalCntParam: number) : Observable<Object>{  
    const offsetParam = totalCntParam - pageSizeParam * (pageNoParam - 1);

    return this._findListByOpt(domain, offsetParam, pageSizeParam);
  }

  //update(domain: ScmDomain, model: any) {
  update(domain: ScmDomain, formData: any) {
    const controllerName = domain.charAt(0).toUpperCase() + domain.slice(1);
    return this.http.put(environment.apiBaseURI + controllerName + '/' + formData.no, formData);
  }

  count(domain: ScmDomain) {
    return this.counter.get(domain);
  }

  private _findObject(domain: ScmDomain, no: number, isSnapshot: boolean) {
    if (isSnapshot) {
      return this.db.object(`/${domain}/${no}`);
    }
    return this.db.object(`/${domain}/${no}`);
  }

  private _findListByOpt(domain: ScmDomain, offsetParam: number, pageSizeParam: number) {
    const controllerName = domain.charAt(0).toUpperCase() + domain.slice(1) + 'ListGetByPage';

    return this.http.post(environment.apiBaseURI + controllerName, {
      offset: offsetParam,
      pageSize: pageSizeParam
    });
  }
}
