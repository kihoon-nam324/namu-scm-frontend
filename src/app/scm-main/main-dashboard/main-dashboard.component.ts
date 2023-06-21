import { Component, OnInit, ChangeDetectorRef, SimpleChanges} from '@angular/core';
import { DataStoreService } from '../../shared/data-store.service';
import { ProdStatus, Product } from '../../product/product.model';
import { Category, Categories } from '../../category/category.model';
import { zip, from, Observable, of, throwError } from 'rxjs';
import { map, tap, take, mergeMap, filter, concatMap, finalize } from 'rxjs/operators';
import { SpinnerService } from '../../shared/loading-spinner/spinner.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'scm-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainDashboardComponent implements OnInit {
  fetchBarChartData = false;
  barData!: any[];
  barChartLabel1!: string;
  barChartLabel2!: string;
  barChartLabel3!: string;
  barChartLabels!: string[];
  barChartOptions: any;
  productLabel: any;

  fetchPieChartData = false;
  pieDataSets!: any[];
  pieData!: number[];
  pieChartLabels!: string[];
  barChartType: any;
  // pieChartOptions: ChartOptions<'pie'> = {
  //   responsive: false,
  // };

  constructor(private database: DataStoreService, 
    private spinner: SpinnerService,
    private translate:TranslateService) {
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        if(this.fetchBarChartData === false && this.fetchPieChartData === false){
          if(this.translate.currentLang === 'kr'){
            this.barChartLabels = ['판매대기', '판매중', '판매중지'];
            this.productLabel = ['상품'];
          } else if(this.translate.currentLang === 'jp') {
            this.barChartLabels = ['販売待機', '販売中', '販売中止'];
            this.productLabel = ['商品'];
          }
          
          return;
        }else{
          this.ngOnInit(); 
        }
      });
  }

  ngOnInit() {
    this.barData = [];
    this.pieData = [];
    this.pieChartLabels = [];
    this.pieDataSets = [];
    this.resetChartLabel();
    this.makeBarChart();
    this.makePieChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['translate']) {
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        // 언어 변경 감지 시 컴포넌트를 다시 랜더링합니다.
        this.ngOnInit();
      });
    }
  }

  resetChartLabel() {
    this.barChartLabel1 = this.translate.instant('MAIN_DASHBOARD.SELL_WAIT');
    this.barChartLabel2 = this.translate.instant('MAIN_DASHBOARD.SELL_PROCESS');
    this.barChartLabel3 = this.translate.instant('MAIN_DASHBOARD.SELL_STOP');
    //this.barChartLabels = [this.barChartLabel1, this.barChartLabel2, this.barChartLabel3]
    this.barChartLabels = [this.barChartLabel1, this.barChartLabel2, this.barChartLabel3]
    this.productLabel = [this.translate.instant('MAIN_DASHBOARD.PRODUCT')];
  }

  private makeBarChart() {
    this.spinner.start();

    // const waitForSale$ = this.database.findList$ByQuery('product', 'status', ProdStatus.WAIT_FOR_SALE)
    //   .pipe(map((r: any[]) => r.length));
    const waitForSale$ = this.database.findList$ByQuery('product', 'status', ProdStatus.WAIT_FOR_SALE)
      .pipe(map((r: any) => r.length));
    // const onSale$ = this.database.findList$ByQuery('product', 'status', ProdStatus.ON_SALE)
    //   .pipe(map((r: any[]) => r.length));
    const onSale$ = this.database.findList$ByQuery('product', 'status', ProdStatus.ON_SALE)
      .pipe(map((r: any) => r.length));
    // const notForSale$ = this.database.findList$ByQuery('product', 'status', ProdStatus.NOT_FOR_SALE)
    //   .pipe(map((r: any[]) => r.length));
    const notForSale$ = this.database.findList$ByQuery('product', 'status', ProdStatus.NOT_FOR_SALE)
    .pipe(map((r: any) => r.length));

    zip(waitForSale$, onSale$, notForSale$)
      .pipe(tap(statData => this.makeBarChartDataset(statData)))
      .pipe(tap(statData => this.makeBarChartOptions(statData)))
      .subscribe(() => {
        this.spinner.stop();
        this.fetchBarChartData = true;
      });
  }

  private makeBarChartDataset(statData: number[]) {
    this.barData.push({ data: [statData[0]], label: this.barChartLabels[0] });
    this.barData.push({ data: [statData[1]], label: this.barChartLabels[1] });
    this.barData.push({ data: [statData[2]], label: this.barChartLabels[2] });
  }

  private makeBarChartOptions(statData: number[]) {
    const maxNum = statData.reduce(function(a, b) {
      return Math.max(a, b);
    });

    this.barChartOptions = { scales: { xAxes: [{ ticks: { max: maxNum, min: 0, stepSize: 1 } }] } };
  }

  private makePieChart() {
    this.spinner.start();
    this.database.findList$<Category>('category')
      .pipe(take(1))
      .pipe(mergeMap((res: any) => from(res).pipe(map((cat: any) => cat))))
      .pipe(filter((cat: Category) => cat.isUse === 1))
      .pipe(mergeMap(cat =>
        this.database.findList$ByQuery('product', 'catNo', cat.no)
          .pipe(map((products: any) => [cat, products.length]))
      ))
      .pipe(tap((result: any) => {
        this.pieData.push(result[1]);
        this.pieChartLabels.push(result[0].name);
      }))
      .subscribe({
        complete: () => {
          this.pieDataSets = [ { data : this.pieData } ];

          this.spinner.stop();
          this.fetchPieChartData = true;
        }
      });

      // .subscribe(null, null, () => {
      //   this.spinner.stop();
      //   this.fetchPieChartData = true;
      // });
  }
}
