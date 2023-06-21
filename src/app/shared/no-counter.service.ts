import { Injectable, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScmDomain } from './scm-shared-util';

@Injectable()
export class NoCounterService {

  constructor(private db: AngularFireDatabase) { }

  get(domain: ScmDomain): Observable<number> {
    return this._getNumber$(domain).snapshotChanges()
      .pipe(map(action => action.payload.exportVal()|| 1));
  }

  // incAndGet(domain: ScmDomain): Observable<number> {
  //   const id$ = new EventEmitter<number>();

  //   //const onComplete = (err, comitted, dataSnapshot) => {
  //   const onComplete = (err: any, comitted: any, dataSnapshot: { val: () => number | undefined; }) => {
  //     if (err) { throw new Error(`failed to increase number`); }

  //     if (comitted) {
  //       id$.emit(dataSnapshot.val());
  //       id$.complete();
  //     }
  //   };
  //   this.db.object(`/numbers/${domain}`).query.ref.transaction(num => (num || 0) + 1, onComplete);
  //   return id$;
  // }

  private _getNumber$(domain: ScmDomain) {
    return this.db.object(`/numbers/${domain}`);
  }
}
