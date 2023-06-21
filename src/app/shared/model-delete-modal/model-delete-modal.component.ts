import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataStoreService } from 'src/app/shared/data-store.service';
import { ToastrService } from 'ngx-toastr';
import { ScmDomain } from '../scm-shared-util';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'scm-delete-modal-window',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{title}}{{ 'DELETE_MODAL.ITEM_DELETE' | translate }}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>{{message}}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="delete(model); activeModal.close('Close click')">{{ 'DELETE_MODAL.DELETE' | translate }}</button>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">{{ 'DELETE_MODAL.CANCEL' | translate }}</button>
    </div>
  `,
  styleUrls: ['model-delete-modal.component.css']
})
export class ModelDeleteModalComponent {
  // @Input() title: string;
  // @Input() message: string;
  // @Input() model: any;
  // @Input() modelName: ScmDomain;

  @Input() title: string | undefined;
  @Input() message: string | undefined;
  @Input() model: any;
  @Input() modelName!: ScmDomain;

  constructor(
    public activeModal: NgbActiveModal,
    private database: DataStoreService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  delete(model: any): void {
    this.database.delete(this.modelName, this.model.no, this.model.productImage).subscribe(this._onSuccess(), this._onError());
  }

  private redirectToModelList() {
    location.reload();
  }

  private _onSuccess() {
    return () => {
      this.toastr.success(`${this.title} ${this.translate.instant('DELETE_MODAL.ITEM_NUMBER')}${this.model.no} ${this.translate.instant('DELETE_MODAL.DELETE_SUCCESS')}`
          , `[${this.title}${this.translate.instant('DELETE_MODAL.MANAGEMENT')}]`
          , {enableHtml: true});
      this.redirectToModelList();
    };
  }

  private _onError() {
    //return e => {
    return () => {
      this.toastr.error(`${this.title} ${this.translate.instant('DELETE_MODAL.ITEM_NUMBER')}${this.model.no} ${this.translate.instant('DELETE_MODAL.DELETE_FAILURE')}`
          , `[${this.title}${this.translate.instant('DELETE_MODAL.MANAGEMENT')}]`
          , {enableHtml: true});
      this.redirectToModelList();
    };
  }
}
