import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './spinner.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'scm-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent implements OnInit {
  // loading: boolean;
  loading: boolean | undefined;

  constructor(spinner: SpinnerService) {
    spinner.getLoading$()
      .subscribe(l => this.loading = l);
  }

  ngOnInit() {}
}
