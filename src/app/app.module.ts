import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxFileDropModule } from 'ngx-file-drop';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DndModule } from 'ngx-drag-drop';

import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTabsModule } from "@angular/material/tabs";
import { CdkAccordionModule } from '@angular/cdk/accordion';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { ImageCompressService,ResizeOptions,ImageUtilityService } from 'ng2-image-compress';
import { FileListComponent } from './pages/file-list/file-list.component';
import { FileDragAndDropComponent } from './pages/file-drag-and-drop/file-drag-and-drop.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    FileListComponent,
    FileDragAndDropComponent,
    NavBarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxFileDropModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    DndModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    MatSlideToggleModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    DragDropModule,
    CdkAccordionModule
  ],
  providers: [ImageCompressService,ResizeOptions],
  bootstrap: [AppComponent]
})
export class AppModule { }
