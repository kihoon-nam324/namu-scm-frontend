import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { NoCounterService } from './no-counter.service';
import { DataStoreService } from './data-store.service';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { SpinnerService } from './loading-spinner/spinner.service';
import { CanDeactivateGuardService } from './can-deactivate-guard.service';
import { SessionAuthGuardService } from './session-auth-guard.service';
import { ModelDeleteModalComponent } from './model-delete-modal/model-delete-modal.component';
import { ModelBulkDeleteModalComponent } from './model-bulk-delete-modal/model-bulk-delete-modal.component';
//import { ModelBulkCreateModalComponent } from './model-bulk-create-modal/model-bulk-create-modal.component';
//import { ModelBulkCreateService } from './model-bulk-service/model-bulk-create.service';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
      FormsModule,
      CommonModule, 
      HttpClientModule, 
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),],
    providers: [
      NoCounterService,
      DataStoreService,
      SpinnerService,
      CanDeactivateGuardService,
      SessionAuthGuardService,
      //ModelBulkCreateService
    ],
    declarations: [
      LoadingSpinnerComponent, 
      ModelDeleteModalComponent, 
      ModelBulkDeleteModalComponent, 
      //ModelBulkCreateModalComponent, 
      ],
    // entryComponents: [
    //   ModelDeleteModalComponent, 
    //   ModelBulkDeleteModalComponent, 
    //   //ModelBulkCreateModalComponent
    // ],
    exports: [LoadingSpinnerComponent]
})
export class SharedModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
