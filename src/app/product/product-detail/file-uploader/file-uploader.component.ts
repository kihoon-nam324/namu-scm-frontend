import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'scm-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {
  @Output() onFileSelect: EventEmitter<Object> = new EventEmitter();
  //@ViewChild('fileUpoader',{static: false}) fileUpoader: ElementRef<HTMLElement>;
  @ViewChild('fileUpoader', { static: false }) fileUpoader!: ElementRef<HTMLElement>;
  //public image: string = '';
  public imageName: string = '';
  //@Input() image: String;
  @Input() image!: String;

  constructor(
    private imageCompress: NgxImageCompressService
  ) { }

  ngOnInit(): void {
  }

  triggerClick() {
    let fileElement: HTMLElement = this.fileUpoader.nativeElement;
    fileElement.click();
  }

  selectFile(event: Event) {
    //const file      = (event.target as HTMLInputElement).files[0];
    const file      = (event.target as HTMLInputElement)?.files?.[0];
    //this.imageName  = file.name;
    
    if (file) {
      this.imageName  = file.name;
      const reader  = new FileReader();
      reader.onload = () => {
        this.compressImage(reader.result as string);
      };

      reader.readAsDataURL(file);
      this.onFileSelect.emit(file);
    }


    // Preview image
    // if (file) {
    //   const reader  = new FileReader();
    //   reader.onload = () => {
    //     this.image  = reader.result as string;
    //   };
    //   reader.readAsDataURL(file);
    //   this.onFileSelect.emit(file);
    // }
  }

  compressImage(image: string) {
    this.imageCompress.compressFile(image, -1, 500, 500).then(result => {
      this.image = result;
    });
  }
}
