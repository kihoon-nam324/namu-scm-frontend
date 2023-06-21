import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { from } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CheckedProductSetService {
  prodNoSet = new Set();
  hasNo$: Observable<boolean>;
  private hasNoSubject: Subject<boolean> = new BehaviorSubject(false);

  constructor() {
    this.hasNo$ = this.hasNoSubject.asObservable();
  }

  initProdNos() {
    this.prodNoSet = new Set();
    this._notifyExistence();
  }

  addNo(no: number) {
    this.prodNoSet.add(no);
    this._notifyExistence();
  }

  removeNo(no: number) {
    this.prodNoSet.delete(no);
    this._notifyExistence();
  }

  nos$() {
    return from(Array.from(this.prodNoSet));
  }

  private _notifyExistence() {
    const hasNo  = this.prodNoSet.size > 0;
    this.hasNoSubject.next(hasNo);
  }
}
