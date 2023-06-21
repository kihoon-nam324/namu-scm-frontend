import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../category.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScmSharedUtil, ActionMode } from '../../shared/scm-shared-util';
import { ActivatedRoute, Router } from '@angular/router';
import { DataStoreService } from '../../shared/data-store.service';
import { switchMap, map, tap, filter } from 'rxjs/operators';
import { CanComponentDeactivate } from '../../shared/can-deactivate-guard.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'scm-category-detail',
  templateUrl: 'category-detail.component.html',
  styleUrls: ['category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit, CanComponentDeactivate {
  // subTitle: string;
  // actionMode: ActionMode;
  // categoryForm: FormGroup;
  subTitle!: string;
  actionMode!: ActionMode;
  categoryForm!: FormGroup;
  private submitted = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private database: DataStoreService,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private translate: TranslateService
              ) {
    this.initForm();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.ngOnInit();
    });
  }

  ngOnInit() {
    //this.route.queryParams.pipe(filter(q => q.action !== undefined))
    this.route.queryParams.pipe(filter(q => q['action'] !== undefined))
      .pipe(tap(q => this._setActionMode(q)))
      .pipe(switchMap(q => this.route.data))
      //.pipe(filter((data: {category: Category}) => data.category !== null))
      .pipe(filter((data: any) => data.category !== null))
      .pipe(map((data: {category: Category}) => data.category))
      .subscribe((cat) => {
        cat.createdTime = cat.createdTime.replace('T', ' ');

        if ( this.actionMode === 'edit' ) {
          //cat.updatedTime = (cat.updatedTime === '0001-01-01T00:00:00') ? null : cat.updatedTime.replace('T', ' ');
          cat.updatedTime = (cat.updatedTime === '0001-01-01T00:00:00') ? '' : cat.updatedTime.replace('T', ' ');
        }

        this.actionMode === 'read' ? this.resetForm(cat) : this.categoryForm.patchValue(cat);
      });
  }

  canDeactivate() {
    if (this.submitted || this.categoryForm.pristine) { return true; }
    return confirm(this.translate.instant('MESSAGE.CLOSE_CONFIRM_MESSAGE'));
  }

  submit() {
    const category: Category = this.categoryForm.value;
    

    if ( this.actionMode === 'create' ) {
      category.createdTime = ScmSharedUtil.getCurrentDateTime();
      category.updatedTime = '0001-01-01T00:00:00';

      this.database.create('category', category).subscribe(this._onSuccess(), this._onError());
      return;
    }

    category.createdTime = category.createdTime.replace(' ', 'T');
    category.updatedTime = ScmSharedUtil.getCurrentDateTime();

    this.database.update('category', category).subscribe(this._onSuccess(), this._onError());
  }

  cancel() {
    this.redirectToCategoryList();
  }

  initForm() {
    this.categoryForm = this.fb.group({
      no: [0],
      name: ['', Validators.required],
      desc: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
      //isUse: [true, Validators.required],
      isUse: [1, Validators.required],
      createdTime: [],
      updatedTime: []
    });
  }

  resetForm(cat: Category) {
    this.categoryForm.reset({
      no: {value: cat.no, disabled: true},
      name: {value: cat.name, disabled: true},
      desc: {value: cat.desc, disabled: true},
      isUse: {value: cat.isUse, disabled: true},
      createdTime: {value: cat.createdTime.replace('T', ' '), disabled: true},
      updatedTime: {value: cat.updatedTime === '0001-01-01T00:00:00' ? [] : cat.updatedTime.replace('T', ' '), disabled: true}
    });
  }

  private _setActionMode(q: { [x: string]: any; action?: any; }) {
    this.actionMode = q.action;

    switch (this.actionMode) {
      case 'create':
        this.subTitle = this.translate.instant('CATEGORY_DETAIL.CREATE');
        break;
      case 'edit':
        this.subTitle = this.translate.instant('CATEGORY_DETAIL.UPDATE');
        break;
      case 'read':
      default:
        this.subTitle = this.translate.instant('CATEGORY_DETAIL.DETAIL');
    }
  }

  private redirectToCategoryList() {
    this.router.navigate(['category-list']);
  }

  private _onSuccess() {
    return () => {
      this.toastr.success(`${this.translate.instant('CATEGORY_DETAIL.CATEGORY')} ${this.subTitle} ${this.translate.instant('CATEGORY_DETAIL.COMPLETE')}`
      , `${this.translate.instant('CATEGORY_DETAIL.CATEGORY_MANAGEMENT')}`);
      this.submitted = true;
      this.redirectToCategoryList();
    };
  }

  private _onError() {
    //return e => {
    return (e: any) => {
      this.toastr.error(`${this.translate.instant('CATEGORY_DETAIL.CATEGORY')} ${this.subTitle} ${this.translate.instant('CATEGORY_DETAIL.FAILURE')}`
      , `${this.translate.instant('CATEGORY_DETAIL.CATEGORY_MANAGEMENT')}`);
      this.redirectToCategoryList();
    };
  }
}
