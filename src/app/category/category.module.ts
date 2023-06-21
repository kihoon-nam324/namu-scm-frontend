import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { CategoryManagementComponent } from './category-management/category-management.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryItemComponent } from './category-management/category-item/category-item.component';
import { CAT_LIST_PAGE_SIZE } from './category.tokens';
import { CurrentPageCategorySetService } from './category-management/currentpage-category-set.service';
import { CategoryBulkDeleteService } from './category-management/category-bulk-delete.service';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CategoryRoutingModule,
    NgbPaginationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [CategoryManagementComponent, CategoryDetailComponent, CategoryItemComponent],
  providers: [
    CurrentPageCategorySetService,
    CategoryBulkDeleteService,
    { provide: CAT_LIST_PAGE_SIZE, useValue: 3 }]
})
export class CategoryModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}