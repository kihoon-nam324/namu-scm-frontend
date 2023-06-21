export class ScmBase {
  //isUse: boolean;
  //isUse: number;
  isUse!: number;
  // createdTime: string;
  // updatedTime: string;
  createdTime!: string;
  updatedTime!: string;

  //constructor(isUse: boolean, createdTime: string, updatedTime: string) {
  constructor(isUse: number, createdTime: string, updatedTime: string) {
    this.isUse = isUse;
    this.createdTime = createdTime;
    this.updatedTime = updatedTime;
  }
}