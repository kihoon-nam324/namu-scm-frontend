import { ToastrService } from 'ngx-toastr';
import { Injectable } from "@angular/core";

@Injectable()
export class CustomToastrOptions extends ToastrService {
  // enableHTML: true;
  // positionClass: 'toastr-top-center';
  enableHTML!: true;
  positionClass!: 'toastr-top-center';
}
