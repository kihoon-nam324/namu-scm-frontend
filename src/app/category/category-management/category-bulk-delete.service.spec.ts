import { TestBed, inject } from '@angular/core/testing';

import { CategoryBulkDeleteService } from './category-bulk-delete.service';

describe('CategoryBulkDeleteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryBulkDeleteService]
    });
  });

  it('should ...', inject([CategoryBulkDeleteService], (service: CategoryBulkDeleteService) => {
    expect(service).toBeTruthy();
  }));
});
