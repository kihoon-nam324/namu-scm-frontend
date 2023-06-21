import { Component, OnInit, Input } from '@angular/core';
import { Category } from '../../category.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelDeleteModalComponent } from 'src/app/shared/model-delete-modal/model-delete-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'scm-category-item',
  templateUrl: 'category-item.component.html',
  styleUrls: ['category-item.component.css']
})
export class CategoryItemComponent implements OnInit {
  //@Input() category: Category;
  @Input() category!: Category;

  constructor(private modelDeleteModalService: NgbModal,
    private translate:TranslateService) { }

  ngOnInit() {
  }

  //openDeleteModal(category) {
  openDeleteModal(category: any) {
    const modalRef = this.modelDeleteModalService.open(ModelDeleteModalComponent);
    modalRef.componentInstance.title = this.translate.instant('MESSAGE.CATEGORY');
    modalRef.componentInstance.message = this.translate.instant('MESSAGE.CONFRIM_DELETE_MESSAGE');
    modalRef.componentInstance.model = category;
    modalRef.componentInstance.modelName = 'category';
  }
}
