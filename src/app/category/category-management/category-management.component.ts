import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Categories, Category } from '../category.model';
import { DataStoreService } from '../../shared/data-store.service';
import { CAT_LIST_PAGE_SIZE } from '../category.tokens';
import { tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelBulkDeleteModalComponent } from 'src/app/shared/model-bulk-delete-modal/model-bulk-delete-modal.component';
//import { ModelBulkCreateModalComponent } from 'src/app/shared/model-bulk-create-modal/model-bulk-create-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'scm-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  //categories: Categories;
  categories!: Categories;
  totalItemCnt = 0;
  pageSize: number;
  pageNo = 1;
  currCategoryList: any;

  constructor(private route: ActivatedRoute,
              private database: DataStoreService,
              private modelBulkDeleteModalService: NgbModal,
              private modelBulkCreateModalService: NgbModal,
              @Inject(CAT_LIST_PAGE_SIZE) pageSize: number,
              private translate: TranslateService) {
    this.pageSize = pageSize;
  }

  ngOnInit() {
    this.database.findListItemCount('category').subscribe((cnt: number) => this.totalItemCnt = cnt);
    this.fetchResolvedData();
  }

  //pageNoChanged(pageNo) {
  pageNoChanged(pageNo: number) {
    this.pageNo = pageNo;
    this.getPagedList();
  }

  getPagedList() {
    this.database.findList$ByPage('category', this.pageNo, this.pageSize, this.totalItemCnt)
      //.pipe(tap((list: Categories) => list.sort((p1, p2) => p2.no - p1.no)))
      .pipe(tap((list: any) => list.sort((p1: Category, p2: Category) => p2.no - p1.no)))
      .subscribe(cats => {
        this.categories = cats;
      });
  }

  private fetchResolvedData() {
    const resolvedData = this.route.snapshot.data as { list: Categories };
    this.categories = resolvedData.list;
  }

  openBulkDeleteModal() {
    const modalRef = this.modelBulkDeleteModalService.open(ModelBulkDeleteModalComponent);
    modalRef.componentInstance.title = this.translate.instant('CATEGORY_MANAGEMENT.CATEGORY');
    modalRef.componentInstance.message = this.translate.instant('CATEGORY_MANAGEMENT.CATEGORY_MODAL_DELETE_MESSAGE');
    modalRef.componentInstance.modelList = this.categories;
    modalRef.componentInstance.modelName = 'category';
  }

  // openBulkCreateModal(): void {
  //   const modalCreateRef = this.modelBulkCreateModalService.open(ModelBulkCreateModalComponent);
  //   modalCreateRef.componentInstance.title = this.translate.instant('CATEGORY_MANAGEMENT.CATEGORY');
  //   modalCreateRef.componentInstance.message = this.translate.instant('CATEGORY_MANAGEMENT.CATEGORY_MODAL_BULK_CREATE_MESSAGE');
  //   modalCreateRef.componentInstance.modelList = null;
  //   modalCreateRef.componentInstance.modelName = 'category';
  // }
}
