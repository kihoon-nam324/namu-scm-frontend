import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable  } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckedProductSetService } from '../checked-product-set.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { ModelBulkCreateModalComponent } from 'src/app/shared/model-bulk-create-modal/model-bulk-create-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'scm-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.css']
})
export class ButtonGroupComponent implements OnInit {
  //noneNo$: Observable<boolean>;
  noneNo$!: Observable<boolean>;
  @Output() onClicked: EventEmitter<string> = new EventEmitter();

  constructor(
    private router: Router,
    private prodSet: CheckedProductSetService,
    private modelBulkCreateModalService: NgbModal,
    private translate:TranslateService) {
  }

  ngOnInit() {
    this.mapNoneKeyObservable();
  }

  private mapNoneKeyObservable() {
    this.noneNo$ = this.prodSet.hasNo$.pipe(map(hasNo => !hasNo));
  }

  // openBulkCreateModal(): void {
  //   const modalCreateRef = this.modelBulkCreateModalService.open(ModelBulkCreateModalComponent);
  //   modalCreateRef.componentInstance.title = this.translate.instant('MESSAGE.PRODUCT');
  //   modalCreateRef.componentInstance.message = this.translate.instant('MESSAGE.PRODUCT_BULK_CREATE_MESSAGE');
  //   modalCreateRef.componentInstance.modelList = null;
  //   modalCreateRef.componentInstance.modelName = 'product';
  // }
}
