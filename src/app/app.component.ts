import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { NotificacaoService } from 'src/services/notificacao.service';
import {DndDropEvent, DropEffect} from "ngx-drag-drop";

class FileEdit {
  name?:   string;
  type?:   string;
  url?:    SafeUrl;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'File Drop';

  constructor( private sanitizer: DomSanitizer,private notificacaoService: NotificacaoService){

  }

  OnInit(): void{

  }

  public files: NgxFileDropEntry[] = [];
  public file: any[] = [];

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

            let novoArray = new FileEdit();

            for (let index = 0; index < array.length; index++) {
              const element = array[index];

              novoArray.name = element.name;
              novoArray.type = element.type;

            }

            novoArray.url = url;

            console.log(novoArray)
            this.file.push(novoArray)

            // Here you can access the real file
            console.log(droppedFile.relativePath, file);

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
            console.log(error)
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }

    // setTimeout(() => {
    //   this.notificacaoService.showSnackBar(errors, 'OK', 'background-padrao-snackbar', 'left', 'top', 2000);
    // }, 2000);
  }

  public fileOver(event: any){
    console.log(event);
  }

  public fileLeave(event: any){
    console.log(event);
  }

  generatorUrl(file: any){
    try {
      if(file.type == ""){
        throw "Erro: Formato/type do documento '"+ file.name + "' é inválido."
      }
      var blob = new Blob([file], { type: file.type });
      var url = window.URL.createObjectURL(blob);
      // window.open(url);
      // console.log(blob);
      return this.sanitizer.bypassSecurityTrustUrl(url);
    } catch (error) {
      throw error
    }

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

  limparGaleria(){
    this.files = [];
    this.file = [];

  }



  onDragged( item:any, list:any[], effect:DropEffect ) {

    if( effect === "move" ) {

      const index = list.indexOf( item );
      list.splice( index, 1 );
    }
  }

  onDrop( event:DndDropEvent, list?:any[] ) {

    if( list
      && (event.dropEffect === "copy"
        || event.dropEffect === "move") ) {

      let index = event.index;

      if( typeof index === "undefined" ) {

        index = list.length;
      }

      list.splice( index, 0, event.data );
    }
  }

}
