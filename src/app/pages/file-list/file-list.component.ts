
import { Component, OnInit } from '@angular/core';
import { NotificacaoService } from '../../../services/notificacao.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { ImageCompressService, ResizeOptions, ImageUtilityService, IImage, SourceImage } from  'ng2-image-compress';

import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

class FileEdit {
  name?:         string;
  type?:         string;
  url?:          SafeUrl;
  file?:         File;
  sizeFile?:     string;
  compress?:     [];
  sizeCompress?: string
}


@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {

  title = 'List File';

  selectedImage: any;
  processedImages: any = [];
  showTitle: boolean = false;

  public files: NgxFileDropEntry[] = [];
  public file: any[] = [];
  public fileCompress: any[] = [];

  movies = [
    'Episode I - The Phantom Menace',
    'Episode II - Attack of the Clones',
    'Episode III - Revenge of the Sith',
    'Episode IV - A New Hope',
    'Episode V - The Empire Strikes Back',
    'Episode VI - Return of the Jedi',
    'Episode VII - The Force Awakens',
    'Episode VIII - The Last Jedi',
    'Episode IX - The Rise of Skywalker',
  ];

  constructor(private sanitizer: DomSanitizer,private notificacaoService: NotificacaoService,private imgCompressService: ImageCompressService) { }

  ngOnInit(): void {
    // console.log(this.movies)
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    // this.file = [];
    let errors: any[] = [];

    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          try {

            const url = this.generatorUrl(file);
            let array = [file];
            // console.log(array)

            let novoArray = new FileEdit();

            for (let index = 0; index < array.length; index++) {
              const element = array[index];

              novoArray.name = element.name;
              novoArray.type = element.type;
              novoArray.file = element;
              novoArray.compress = [];
            }

            novoArray.url = url;

            // console.log(novoArray)
            this.file.push(novoArray)
            // this.onChange([file])
            this.fileCompress.push(file);

            novoArray.sizeFile = this.sizeFile(novoArray.file?.size);
            novoArray.sizeCompress = " - ";

            this.processedImages.push(novoArray);
            // console.log("this.fileCompress",this.fileCompress)
            // console.log("this.processedImages",this.processedImages)


            // Here you can access the real file
            // console.log(droppedFile.relativePath, file);

            /**
            // You could upload it like this:
            const formData = new FormData()
            formData.append('logo', file, relativePath)

            // Headers
            const headers = new HttpHeaders({
              'security-token': 'mytoken'
            })

            this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
            .subscribe(data => {
              // Sanitized logo returned from backend
            })
            **/
          } catch (error: any) {
            errors.push(error)
            // this.notificacaoService.showSnackBar([error], 'OK', 'background-padrao-snackbar', 'left', 'top', 100);
            // console.log(error)
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        // console.log(droppedFile.relativePath, fileEntry);
      }
    }

    // setTimeout(() => {
    //   this.notificacaoService.showSnackBar(errors, 'OK', 'background-padrao-snackbar', 'left', 'top', 2000);
    // }, 2000);
  }

  public fileOver(event: any){
    // console.log(event);
  }

  public fileLeave(event: any){
    // console.log(event);
  }

  generatorUrl(file: any){
    try {
      if(file.type == ""){
        throw "Erro: Formato/type do documento '"+ file.name + "' é inválido."
      }
      var blob = new Blob([file], { type: file.type });
      var url = window.URL.createObjectURL(blob);
      // window.open(url);
      // // console.log(blob);
      return this.sanitizer.bypassSecurityTrustUrl(url);
    } catch (error) {
      throw error
    }

  }

  onChange(fileInput: any, i: any) {
    let fileList: FileList;

    let images: Array<IImage> = [];

    let option: ResizeOptions = new ResizeOptions();

    if(fileInput[0].type == "image/png"){
      // let option: ResizeOptions  = { Resize_Max_Height  : 1080 , Resize_Max_Width : 1920, Resize_Quality : 70 , Resize_Type : 'png'  }
      option.Resize_Max_Height = 1080;
      option.Resize_Max_Width = 1920;
      option.Resize_Quality = 50;
      option.Resize_Type = 'png';
    }else{
      // let option: ResizeOptions  = { Resize_Max_Height  : 1080 , Resize_Max_Width : 1920, Resize_Quality : 70 }
      option.Resize_Max_Height = 1080;
      option.Resize_Max_Width = 1920;
      option.Resize_Quality = 60;
    }

   ImageCompressService.filesToCompressedImageSourceEx(fileInput, option ).then(observableImages => {
      observableImages.subscribe((image) => {
        var teste = image;
        images.push(image);

        let index = this.processedImages.indexOf(i);
        if (index > -1) {
          this.processedImages.splice(index, 1);
        }

        this.processedImages[i].compress.push(image);

        const img = this.processedImages[i].compress[0].compressedImage.imageDataUrl;

        var Buffer = require('buffer/').Buffer;
        const bf = Buffer.from(img.substring(img.indexOf(',') + 1));

        this.processedImages[i].sizeCompress = this.sizeFile(bf.length);

        // // console.log("this.processedImages ",this.processedImages[0].imageDataUrl.match(/:(.+\/.+);/)[1]);
        // console.log("this.processedImages ",this.processedImages);

        // const src = image.imageDataUrl;
        // const base64str = src.split('base64,')[1];
        // const decoded = btoa(base64str);
        // // console.log("FileSize: " + decoded.length);

      }, (error) => {
        // console.log("Error while converting");
      }, () => {
                // this.processedImages = images;
                this.showTitle = true;
      });
    });

    // or you can pass File[]
    // let files: File[] = Array.from(fileInput.target.files);

    // ImageCompressService.filesArrayToCompressedImageSourceEx(files, option).then(observableImages => {
    //   observableImages.subscribe((image) => {
    //     images.push(image);
    //   }, (error) => {
    //     // console.log("Error while converting");
    //   }, () => {
    //             this.processedImages = images;
    //             this.showTitle = true;
    //   });
    // });


  }

  redutorDeNome(nome: string, qtd: number) {
    var EndNome: string = nome;
    var StartNome: string = nome;
    try{

      if (nome.length > qtd) {
        EndNome = nome.substr(nome.length - (qtd / 2 - 1), qtd / 2);
        StartNome = nome.substr(0, qtd / 2 - 2);
        nome = StartNome.trim() + " ... " + EndNome.trim();
      }
    }catch{

    }
    return nome;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.processedImages, event.previousIndex, event.currentIndex);
    // console.log(this.processedImages)
  }

  deleteItem(item: any,i: any){

    let index = this.processedImages.indexOf(item);
    if (index > -1) {
      this.processedImages.splice(index, 1);
    }
  }

  compress(item: any,i: any){
    let obj = [];
    let index = this.processedImages.indexOf(item);

    obj.push(item.file);
    this.onChange(obj,index);

  }

  sizeFile(bytes: any, decimals = 2){

    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    // console.log(`${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`);
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

}
