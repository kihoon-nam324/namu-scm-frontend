import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { ProductManagementComponent } from './product-management/product-management.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-management/product-list/product-list.component';
import { PROD_LIST_PAGE_SIZE } from './product.tokens';
import { ProductBulkUpdaterService } from './product-management/product-bulk-updater.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductRoutingModule } from './product-routing.module';
import { CheckedProductSetService } from './product-management/checked-product-set.service';
import { ButtonGroupComponent } from './product-management/button-group/button-group.component';
import { ProductStatusPipe } from './product-status.pipe';
import { ProductBulkDeleterService } from './product-management/product-bulk-deleter.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FileUploaderComponent } from './product-detail/file-uploader/file-uploader.component';
import { NgxImageCompressService } from 'ngx-image-compress';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    ProductRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    ProductManagementComponent, 
    ProductDetailComponent, 
    ProductListComponent, 
    ButtonGroupComponent, 
    ProductStatusPipe,
    FileUploaderComponent
  ],
  providers: [
    CheckedProductSetService,
    ProductBulkUpdaterService,
    ProductBulkDeleterService,
    NgxImageCompressService,
    {provide: PROD_LIST_PAGE_SIZE, useValue: 6},
  ]
})
export class ProductModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
