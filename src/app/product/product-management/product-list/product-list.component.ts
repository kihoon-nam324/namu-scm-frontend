import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { Products, Product } from '../../product.model';
import { range } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute  } from '@angular/router';
import { PROD_LIST_PAGE_SIZE } from '../../product.tokens';
import { DataStoreService } from '../../../shared/data-store.service';
import { CheckedProductSetService } from '../checked-product-set.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelDeleteModalComponent } from 'src/app/shared/model-delete-modal/model-delete-modal.component';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'scm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageNoChanged(pageNo: number) {
    throw new Error('Method not implemented.');
  }
  @Input() totalItemCnt = 0;
  pageNo = 1;
  pageSize: number;
  //products: Products;
  products!: Products;
  //checkedStatus: boolean[];
  checkedStatus: boolean[] = [];

  constructor(private route: ActivatedRoute,
              private prodSet: CheckedProductSetService,
              private database: DataStoreService,
              private deleteModalWindowService: NgbModal,
              @Inject(PROD_LIST_PAGE_SIZE) pageSize: number,
              private translate: TranslateService) {
    this.pageSize = pageSize;

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.fetchResolvedData();
    this.initCheckedProducts();
  }

  ngOnDestroy() {
    this.prodSet.initProdNos();
  }

  //ageNoChanged(pageNo) {
  ageNoChanged(pageNo: number) {
    this.pageNo = pageNo;
    this.initCheckedProducts();
    this.getPagedList();
  }

  //pageSizeChanged(pageSize) {
  pageSizeChanged(pageSize: number) {
    this.pageSize = +pageSize;
    this.initCheckedProducts();
    this.getPagedList();
  }

  toggleAllItem() {
    if ( this.isCheckedAnyOne() ) {
      this.prodSet.initProdNos();
    } else {
      this.products.map(p => p.no)
        .forEach(no => this.prodSet.addNo(no));
    }

    this.setAllProductsCheckedStatusTo(!this.isCheckedAnyOne());
  }

  //checkProduct(isChecked: boolean, idx: number, no: number) {
  checkProduct(target: EventTarget | null, idx: number, no: number) {  
    const input = target as HTMLInputElement;
    if (input.checked) {
      this.checkedStatus[idx] = true;
    }
    
    //this.checkedStatus[idx] = isChecked;

    if ( this.checkedStatus[idx] ) {
      this.prodSet.addNo(no);
    } else {
      this.prodSet.removeNo(no);
    }
  }

  isCheckedAnyOne() {
    return this.checkedStatus.reduce((acc, cur) => cur || acc, false);
  }

  getPagedList() {
    this.database.findList$ByPage('product', this.pageNo, this.pageSize, this.totalItemCnt)
      //.pipe(map((list: Products) => list.sort((p1, p2) => p2.no - p1.no)))
      .pipe(map((list: any) => list.sort((p1: Product, p2: Product) => p2.no - p1.no)))
      .subscribe(list => this.products = list);
  }

  private fetchResolvedData() {
    const resolvedData = this.route.snapshot.data as {list: Products};
    this.products = resolvedData.list;
  }

  private initCheckedProducts() {
    this.prodSet.initProdNos();
    this.setAllProductsCheckedStatusTo(false);
  }

  private setAllProductsCheckedStatusTo(v: boolean) {
    this.checkedStatus = [];

    const curItem = this.pageSize > this.totalItemCnt ? this.totalItemCnt : this.pageSize;
    range(0, curItem).subscribe(i => this.checkedStatus[i] = v);
  }

  openDeleteModal(product: Product) {
    const modalRef = this.deleteModalWindowService.open(ModelDeleteModalComponent);
    //modalRef.componentInstance.title = '商品';
    modalRef.componentInstance.title = this.translate.instant('MESSAGE.PRODUCT');
    //modalRef.componentInstance.message = '元に戻すことはできません。削除しますか？';
    modalRef.componentInstance.message = this.translate.instant('MESSAGE.CONFRIM_DELETE_MESSAGE');
    modalRef.componentInstance.model = product;
    modalRef.componentInstance.modelName = 'product';
  }
}
