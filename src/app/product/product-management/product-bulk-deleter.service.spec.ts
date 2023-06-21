import { TestBed, inject } from '@angular/core/testing';

import { ProductBulkDeleterService } from './product-bulk-Deleter.service';

describe('ProductBulkDeleterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductBulkDeleterService]
    });
  });

  it('should ...', inject([ProductBulkDeleterService], (service: ProductBulkDeleterService) => {
    expect(service).toBeTruthy();
  }));
});
