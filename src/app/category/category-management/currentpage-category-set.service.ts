import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { from } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CurrentPageCategorySetService {
  categoryNoSet = new Set();
  hasNo$: Observable<boolean>;
  private hasNoSubject: Subject<boolean> = new BehaviorSubject(false);

  constructor() {
    this.hasNo$ = this.hasNoSubject.asObservable();
  }

  initProdNos() {
    this.categoryNoSet = new Set();
    this._notifyExistence();
  }

  addNo(no: number) {
    this.categoryNoSet.add(no);
    this._notifyExistence();
  }

  removeNo(no: number) {
    this.categoryNoSet.delete(no);
    this._notifyExistence();
  }

  //nos$() {
  nos$(): Observable<number[]> {
    //return from(Array.from(this.categoryNoSet));
    return from(Array.from(this.categoryNoSet)) as Observable<number[]>;
  }

  private _notifyExistence() {
    const hasNo  = this.categoryNoSet.size > 0;
    this.hasNoSubject.next(hasNo);
  }
}
