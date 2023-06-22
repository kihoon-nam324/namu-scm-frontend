import { Component, Input, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ScmDomain } from '../scm-shared-util';
import { CurrentPageCategorySetService } from 'src/app/category/category-management/currentpage-category-set.service';
import { CategoryBulkDeleteService } from 'src/app/category/category-management/category-bulk-delete.service';
import { ProductBulkDeleterService } from 'src/app/product/product-management/product-bulk-deleter.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'scm-model-bulk-delete-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{title}}{{ 'BULK_DELETE_MODAL.DATA_BULK_DELETE' | translate }}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>{{message}}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-info btn-sm mr-2" (click)="bulkDelete(); activeModal.close('Close click')">{{ 'BULK_DELETE_MODAL.BULK_DELETE' | translate }}</button>
      <button type="button" class="btn btn-warning btn-sm mr-2" (click)="resetNoSet(); activeModal.close('Close click')">{{ 'BULK_DELETE_MODAL.CANCEL' | translate }}</button>
    </div>
  `,
  styleUrls: ['model-bulk-delete-modal.component.css']
})
export class ModelBulkDeleteModalComponent implements AfterViewInit {
  // @Input() title: string;
  // @Input() message: string;
  // @Input() modelList: any;
  // @Input() modelName: ScmDomain;
  @Input() title!: string;
  @Input() message!: string;
  @Input() modelList: any;
  @Input() modelName!: ScmDomain;

  constructor(
    public activeModal: NgbActiveModal,
    private currentPageCategorySet: CurrentPageCategorySetService,
    private categoryBulkDeleteService: CategoryBulkDeleteService,
    private productBulkDeleterService: ProductBulkDeleterService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      //backdrop.setAttribute('style', 'z-index: 20 !important'); // 변경할 z-index 값
      backdrop.setAttribute('style', 'z-index: 1001 !important'); // 변경할 z-index 값
    }
  }

  ngAfterViewInit() {
    switch (this.modelName) {
      case 'category':
        this.modelList.forEach((model: { no: number; }) => {
          this.currentPageCategorySet.addNo(model.no);
        });
        break;
      case 'product':
      default:
        break;
    }
  }

  //bulkDelete(): Observable<any> {
  bulkDelete() :void {  
    // if (this.modelName === 'category') {
    //   //this.categoryBulkDeleteService.bulkDeleteStart().subscribe(
    //   this.categoryBulkDeleteService.bulkDeleteStart().toPromise().then(  
    //     //(successIds) => {
    //     (successIds: any[]) => {
    //       this.resetNoSet();
    //       this.toastr.success(`${this.title}${this.translate.instant('BULK_DELETE_MODAL.BULK_DELETE_SUCCESS')}<br>ID: ${successIds.join(', ')}`
    //       , `[${this.title}${this.translate.instant('BULK_DELETE_MODAL.MANAGEMENT')}]`
    //       , {enableHtml: true});
    //       this.redirectToModelList();
    //     },
    //     (e: Error) => {
    //       this.resetNoSet();
    //       this.toastr.error(`${this.title}${this.translate.instant('BULK_DELETE_MODAL.BULK_DELETE_FAILURE')}<br>ID: ${e.message}`
    //       , `[${this.title}${this.translate.instant('BULK_DELETE_MODAL.MANAGEMENT')}]`
    //       , {enableHtml: true});
    //       this.redirectToModelList();
    //     }
    //   );
    // } else if (this.modelName === 'product') {
    //   //this.productBulkDeleterService.bulkDeleteStart().subscribe(
    //   this.productBulkDeleterService.bulkDeleteStart().toPromise().then( 
    //     (successIds) => {
    //       this.toastr.success(`${this.title}${this.translate.instant('BULK_DELETE_MODAL.BULK_DELETE_SUCCESS')}<br>ID: ${successIds.join(', ')}`
    //       , `[${this.title}${this.translate.instant('BULK_DELETE_MODAL.MANAGEMENT')}]`
    //       , {enableHtml: true});
    //       this.redirectToModelList();
    //     },
    //     (e: Error) => {
    //       this.toastr.error(`${this.title}${this.translate.instant('BULK_DELETE_MODAL.BULK_DELETE_FAILURE')}<br>ID: ${e.message}`
    //       , `[${this.title}${this.translate.instant('BULK_DELETE_MODAL.MANAGEMENT')}]`
    //       , {enableHtml: true});
    //       this.redirectToModelList();
    //     }
    //   );
    // }
  }

  resetNoSet(): void {
    if (this.modelName === 'category') {
      this.modelList.forEach((model: { no: number; }) => {
        this.currentPageCategorySet.removeNo(model.no);
      });
    }
  }

  redirectToModelList() {
    location.reload();
  }
}
