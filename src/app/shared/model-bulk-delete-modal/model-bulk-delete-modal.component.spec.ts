import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModelBulkDeleteModalComponent } from './model-bulk-delete-modal.component';

describe('ModelBulkDeleteModalComponent', () => {
  let component: ModelBulkDeleteModalComponent;
  let fixture: ComponentFixture<ModelBulkDeleteModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelBulkDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelBulkDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
