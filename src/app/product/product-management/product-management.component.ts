import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ProductBulkUpdaterService } from './product-bulk-updater.service';
import { ProductListComponent } from './product-list/product-list.component';
import { ToastrService } from 'ngx-toastr';
import { PROD_LIST_PAGE_SIZE } from '../product.tokens';
import { DataStoreService } from 'src/app/shared/data-store.service';
import { ModelBulkDeleteModalComponent } from 'src/app/shared/model-bulk-delete-modal/model-bulk-delete-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'scm-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  totalItemCnt: number = 0;
  pageNo = 1;
  pageSize: number;
  //clickedHandler: {sell: () => void, stop: () => void, delete: () => void};
  clickedHandler!: any | { sell: () => void; stop: () => void; delete: () => void; };
  //@ViewChild(ProductListComponent, { static: true} ) productListComponent: ProductListComponent;
  @ViewChild(ProductListComponent, { static: true }) productListComponent!: ProductListComponent;

  constructor(
              private database: DataStoreService,
              private productBulkUpdater: ProductBulkUpdaterService,
              private modelBulkDeleteModalService: NgbModal,
              private toastr: ToastrService,
              @Inject(PROD_LIST_PAGE_SIZE) pageSize: number,
              private translate:TranslateService) {
    this.pageSize = pageSize;

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.database.findListItemCount('product').subscribe((cnt : number) => this.totalItemCnt = cnt);
    this.setBtnClickHandler();
  }

  //pageNoChanged(pageNo) {
  pageNoChanged(pageNo: number) {
    this.pageNo = pageNo;
    //this.productListComponent.pageNoChanged(this.pageNo);
    this.productListComponent.pageNoChanged(this.pageNo);
  }

  //pageSizeChanged(pageSize) {
  pageSizeChanged(pageSize: string | number) {
    this.pageSize = +pageSize;
    this.productListComponent.pageSizeChanged(this.pageSize);
  }

  clickedBtn(btnEvent: string) {
    //this.clickedHandler[btnEvent]();
    this.clickedHandler[btnEvent]();
  }

  private setBtnClickHandler() {
    const clickedSell = () => {
      this.productBulkUpdater.updateProductsToSell()
        .subscribe(
          (successIds) => {
            this.productListComponent.getPagedList();
            this.toastr.success(`${this.translate.instant('PRODUCT_MANAGEMENT.PRODUCT_SELL_MODIFY_SUCCESS')}<br>ID: ${successIds.join(', ')}`
            , `${this.translate.instant('PRODUCT_MANAGEMENT.PRODUCT_MANAGEMENT')}`
            , {enableHtml: true});
          },
          (e: Error) => {
            this.toastr.error(`${this.translate.instant('PRODUCT_MANAGEMENT.PRODUCT_SELL_MODIFY_FAILURE')}<br>ID: ${e.message}`
            , `${this.translate.instant('PRODUCT_MANAGEMENT.PRODUCT_MANAGEMENT')}`
            , {enableHtml: true});
          }
        );
    };


    const clickedStop = () => {
      this.productBulkUpdater.updateProductsToStop()
        .subscribe(
          (successIds) => {
            this.productListComponent.getPagedList();
            this.toastr.success(`${this.translate.instant('PRODUCT_MANAGEMENT.PRODUCT_SELL_STOP_MODIFY_SUCCESS')}<br>ID: ${successIds.join(', ')}`
            , `${this.translate.instant('PRODUCT_MANAGEMENT.PRODUCT_MANAGEMENT')}`
            , {enableHtml: true});
          },
          (e: Error) => {
            this.toastr.error(`${this.translate.instant('PRODUCT_MANAGEMENT.PRODUCT_SELL_STOP_MODIFY_FAILURE')}<br>ID: ${e.message}`
            , `${this.translate.instant('PRODUCT_MANAGEMENT.PRODUCT_MANAGEMENT')}`
            , {enableHtml: true});
          }
        );
    };
    const clickedDelete = () => {
      this.openBulkDeleteModal();
    };

    this.clickedHandler = {
      sell: clickedSell,
      stop: clickedStop,
      delete: clickedDelete
    };
  }

  openBulkDeleteModal() {
    const modalRef = this.modelBulkDeleteModalService.open(ModelBulkDeleteModalComponent);
    modalRef.componentInstance.title = this.translate.instant('PRODUCT_MANAGEMENT.PRODUCT');
    modalRef.componentInstance.message = this.translate.instant('PRODUCT_MANAGEMENT.PRODUCT_MODAL_DELETE_MESSAGE');
    modalRef.componentInstance.modelList = null;
    modalRef.componentInstance.modelName = 'product';
  }
}
