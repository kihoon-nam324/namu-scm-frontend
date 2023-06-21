import { TestBed, inject } from '@angular/core/testing';

import { CurrentPageCategorySetService } from './currentpage-category-set.service';

describe('CurrentCategorySetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentPageCategorySetService]
    });
  });

  it('should ...', inject([CurrentPageCategorySetService], (service: CurrentPageCategorySetService) => {
    expect(service).toBeTruthy();
  }));
});
