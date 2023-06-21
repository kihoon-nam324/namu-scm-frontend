import { ScmBase } from '../shared/scm-base.model';
import { ScmSharedUtil } from '../shared/scm-shared-util';

export enum ProdStatus { WAIT_FOR_SALE, ON_SALE, NOT_FOR_SALE }
export declare type Products = Product[];

export class Product extends ScmBase {
    no: number;
    name: string;
    listPrice: number;
    status: ProdStatus;
    qty: number;
    desc?: string;
    catNo?: number;
    //productImage: File;
    productImage: string | null;
    //productImageUrl: string;
    productImageUrl!: string;
    

    constructor(no: number, status: ProdStatus) {
        //super(true, ScmSharedUtil.getCurrentDateTime(), '');
        super(1, ScmSharedUtil.getCurrentDateTime(), '');
        this.no = no;
        this.name = '';
        this.listPrice = 0;
        this.status = status;
        this.qty = 0;
        this.desc = '';
        this.catNo = 0;
        this.productImage = null;
    }
}
