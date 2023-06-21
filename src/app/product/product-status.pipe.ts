import { Pipe, PipeTransform } from '@angular/core';
import { ProdStatus } from './product.model';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'productStatus'
})
export class ProductStatusPipe implements PipeTransform {
  //private labelMap;
  private labelMap: any;

  constructor(
    private translate: TranslateService
  ) {
    this.labelMap = {};
    this.labelMap[ProdStatus.WAIT_FOR_SALE] = this.translate.instant('PRODUCT_LIST.SELL_WAIT');
    this.labelMap[ProdStatus.ON_SALE] = this.translate.instant('PRODUCT_LIST.SELL_PROCESS');
    this.labelMap[ProdStatus.NOT_FOR_SALE] = this.translate.instant('PRODUCT_LIST.SELL_STOP');
  }

  transform(value: ProdStatus, args?: any): any {
    if (value !== undefined && this.labelMap.hasOwnProperty(value)) {
      return this.labelMap[value];
    }

    return '-';
  }
}
