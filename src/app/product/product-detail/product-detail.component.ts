import { Component, OnInit, ViewChild } from '@angular/core';
import { Product, ProdStatus } from '../product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap, switchMap, filter } from 'rxjs/operators';
import { Categories } from '../../category/category.model';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActionMode, ScmSharedUtil } from '../../shared/scm-shared-util';
import { NumberRangeValidator } from '../../shared/custom-validators';
import { DataStoreService } from '../../shared/data-store.service';
import { CanComponentDeactivate } from '../../shared/can-deactivate-guard.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'scm-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, CanComponentDeactivate {
  // subTitle: string;
  // actionMode: ActionMode;
  // productForm: FormGroup;
  // usedCats: Categories;
  // private prodNo: number;
  // private totalItemCnt;
  subTitle!: string;
  actionMode: ActionMode = "create";
  productForm!: FormGroup;
  usedCats!: Categories;
  private prodNo!: number;
  private totalItemCnt!: number;
  

  submitted = false;

  isPhotoError = false;
  //productImage: File;
  productImage: string = '';
  uploadError: string = '';
  //productImageUrl: string;
  productImageUrl: string = '';
  //origProductImage: File;
  origProductImage: string = '';
  formData = new FormData();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private database: DataStoreService,
              private fb: FormBuilder,
              private toastr: ToastrService,
              private translate: TranslateService,
              private http: HttpClient) {
    this.initForm();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.route.queryParams.pipe(
      filter(q => q['action'] !== undefined),
      //tap(q => this._setActionMode(q)),
      tap((q: any) => this._setActionMode(q)),
      //switchMap(q => this.route.data.pipe(map((data: { detail: any }) => ({ ...data, queryParams: q })))),
      switchMap(q => this.route.data.pipe(map((data: any) => ({ ...data, queryParams: q })),
      )),
      //.pipe(map((data: {detail: any}) => data.detail))
      //map((data: {detail: any}) => data.detail)
      map((data: any) => data.detail)
      ).subscribe(data => {
        //.subscribe((data : any) => {
        const prod: Product = data[0];
        this.prodNo = prod.no;
        prod.createdTime = prod.createdTime.replace('T', ' ');
        this.productImageUrl = prod.productImageUrl;
        //this.productImage = prod.productImage;
        this.productImage = prod.productImage ? prod.productImage : '';
        //this.origProductImage = prod.productImage;
        this.origProductImage = prod.productImage ? prod.productImage : '';

        if ( this.actionMode === 'edit' ) {
          //prod.updatedTime = (prod.updatedTime === '0001-01-01T00:00:00') ? null : prod.updatedTime.replace('T', ' ');
          prod.updatedTime = (prod.updatedTime === '0001-01-01T00:00:00') ? '': prod.updatedTime.replace('T', ' ');
        }
        this.productForm.patchValue(prod);
    
        this.usedCats = data[1];
      });
    this.database.count('product').subscribe(cnt => this.totalItemCnt = cnt);


//this.route.queryParams.pipe(filter(q => q.action !== undefined))
//     this.route.queryParams.pipe(filter(q => q['action'] !== undefined))
//       .pipe(tap(q => this._setActionMode(q)))
//       .pipe(switchMap(q => this.route.data))
//       //.pipe(map((data: {detail: any}) => data.detail))
//       .pipe(map((data: {detail: any}) => data.detail))
//       .subscribe(data => {
//         //.subscribe((data : any) => {
//         const prod: Product = data[0];
//         this.prodNo = prod.no;
//         prod.createdTime = prod.createdTime.replace('T', ' ');
//         this.productImageUrl = prod.productImageUrl;
//         //this.productImage = prod.productImage;
//         this.productImage = prod.productImage ? prod.productImage : '';
//         //this.origProductImage = prod.productImage;
//         this.origProductImage = prod.productImage ? prod.productImage : '';

//         if ( this.actionMode === 'edit' ) {
//           //prod.updatedTime = (prod.updatedTime === '0001-01-01T00:00:00') ? null : prod.updatedTime.replace('T', ' ');
//           prod.updatedTime = (prod.updatedTime === '0001-01-01T00:00:00') ? '': prod.updatedTime.replace('T', ' ');
//         }
//         this.productForm.patchValue(prod);
    
//         this.usedCats = data[1];
//       });
//     this.database.count('product').subscribe(cnt => this.totalItemCnt = cnt);
  }

  canDeactivate() {
    if ( this.submitted || this.productForm.pristine ) { return true; }
    return confirm(this.translate.instant('MESSAGE.CLOSE_CONFIRM_MESSAGE'));
  }

  submit(): void {
    if(!this.productForm.valid) {
      //return false;
      return;
    }
    
    //if (this.productForm.get('productImage').invalid) {
    if (this.productForm.get('productImage')!.invalid) {
      this.isPhotoError = true;
    }
    
    const product: Product = this.productForm.value;

    if(product.catNo === 0){
      alert(this.translate.instant('PRODUCT_DETAIL.WARN_SELECT_CATEGORY'));
      return;
    }

    product.catNo = product.catNo? +product.catNo : undefined;
    if (product.productImageUrl === undefined) {
      product.productImageUrl = this.productImageUrl;
    }

    if ( this.actionMode === 'create' ) {
      product.createdTime = ScmSharedUtil.getCurrentDateTime();
      product.updatedTime = '0001-01-01T00:00:00';
      this.setFormData(product);

      //this.database.create('product', product).subscribe(this._onSuccess(), this._onError());
      this.database.create('product', this.formData).subscribe(this._onSuccess(), this._onError());
      return;
    }

    product.createdTime = product.createdTime.replace(' ', 'T');
    product.updatedTime = ScmSharedUtil.getCurrentDateTime();
    this.setFormData(product);

    //this.database.update('product', product).subscribe(this._onSuccess(), this._onError());
    this.database.update('product', this.formData).subscribe(this._onSuccess(), this._onError());
  }

  setFormData(product: Product){
    this.formData.append('no',product.no.toString());
    this.formData.append('name',product.name);
    this.formData.append('listPrice',product.listPrice.toString());
    this.formData.append('status',product.status.toString());
    //this.formData.append('catNo',product.catNo.toString());
    this.formData.append('catNo',product.catNo ? product.catNo.toString() : '');
    this.formData.append('isUse',product.isUse.toString());
    this.formData.append('qty',product.qty.toString());
    //this.formData.append('productImage',product.productImage);
    this.formData.append('productImage',product.productImage ? product.productImage : '');
    this.formData.append('productImageUrl', product.productImageUrl);
    this.formData.append('origProductImage',this.origProductImage);
    //this.formData.append('desc',product.desc);
    this.formData.append('desc',product.desc? product.desc : '');
    this.formData.append('createdTime',product.createdTime);
    this.formData.append('updatedTime',product.updatedTime);
  }
  
  //onFileSelect(file: Event) {
  onFileSelect(file: any) {  
    //this.productForm.patchValue({ productImage: file });
    this.productForm.patchValue({ productImage: file });
    //this.productForm.get('productImage').updateValueAndValidity();
    this.productForm.get('productImage')!.updateValueAndValidity();
  }

  cancel() {
    this.redirectToProductList();
  }

  isFirstItem() {
    return this.prodNo === 1;
  }

  isLastItem() {
    return this.prodNo === this.totalItemCnt;
  }

  goPrevItem() {
    this.router.navigate(['product-list', 'product', this.prodNo - 1]);
  }

  goNextItem() {
    this.router.navigate(['product-list', 'product', this.prodNo + 1]);
  }

  initForm() {
    this.productForm = this.fb.group({
      no: [0],
      name: ['', Validators.required],
      listPrice: [0,
        Validators.compose([
          Validators.required,
          NumberRangeValidator.min(1000),
          NumberRangeValidator.max(1000000),
          Validators.pattern('[1-9]\\d*')
        ])],
      status: [ProdStatus.NOT_FOR_SALE],
      catNo: ['0', Validators.required],
      //isUse: [true, Validators.required],
      isUse: [1, Validators.required],
      qty: [0,
        Validators.compose([
          Validators.required,
          NumberRangeValidator.min(1),
          NumberRangeValidator.max(1000),
          Validators.pattern('[1-9]\\d*')
        ])
      ],
      desc: ['',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(1000)
        ])
      ],
      productImage: ['', Validators.compose([Validators.required])],
      productImageURL: [],
      createdTime: [],
      updatedTime: [],
    });
  }

  private _setActionMode(q: { action: string; }) {
    //this.actionMode = q.action;
    this.actionMode = q.action as ActionMode;
    switch (this.actionMode) {
      case 'create':
        this.subTitle = this.translate.instant('PRODUCT_DETAIL.CREATE');
        break;
      case 'edit':
        this.subTitle = this.translate.instant('PRODUCT_DETAIL.UPDATE');
        break;
      case 'read':
      default:
        this.subTitle = this.translate.instant('PRODUCT_DETAIL.DETAIL');
        break;
    }
  }

  private redirectToProductList() {
    this.router.navigate(['product-list']);
  }

  private _onSuccess() {
    return () => {
      this.toastr.success(`${this.translate.instant('PRODUCT_DETAIL.PRODUCT')} ${this.translate.instant(this.subTitle)} ${this.translate.instant('PRODUCT_DETAIL.FINISH')}`
      , `${this.translate.instant('PRODUCT_DETAIL.PRODUCT_MANAGEMENT_SUCCESS')}`);
      this.submitted = true;
      this.redirectToProductList();
    };
  }

  private _onError() {
    //return (e) => {
    return (e: any) => {
      this.toastr.error(`${this.translate.instant('PRODUCT_DETAIL.PRODUCT')} ${this.subTitle} ${this.translate.instant('PRODUCT_DETAIL.FAILURE')}`
      , `${this.translate.instant('PRODUCT_DETAIL.PRODUCT_MANAGEMENT_FAILURE')}`);
      this.redirectToProductList();
    };
  }
}
function subscribe(arg0: (data: any) => void) {
  throw new Error('Function not implemented.');
}

