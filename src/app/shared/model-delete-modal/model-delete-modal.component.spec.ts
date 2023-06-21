import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModelDeleteModalComponent } from './model-delete-modal.component';

describe('ModelDeleteModalComponent', () => {
  let component: ModelDeleteModalComponent;
  let fixture: ComponentFixture<ModelDeleteModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
