import { AbstractControl } from '@angular/forms';


export class NumberRangeValidator {
  static min(min: number) {
    //return (control: AbstractControl): {[key: string]: any} => {
    return (control: AbstractControl): {[key: string]: any} | null => {
      // return control.value >= min ? null : {min: `${min} 以上の値を入力ください`};
      return control.value >= min ? null : {min: `${min} 이상의 값을 입력해주세요`};
    };
  }

  static max(max: number) {
    //return (control: AbstractControl): {[key: string]: any} => {
      return (control: AbstractControl): {[key: string]: any} | null => {
      // return control.value <= max ? null : {max: `${max} 以下の値を入力ください`};
      return control.value <= max ? null : {max: `${max} 이하의 값을 입력해주세요`};
    }
  }
}
