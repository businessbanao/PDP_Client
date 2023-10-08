import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { MatNativeDateModule } from '@angular/material/core';
import { DocManagementPageRoutingModule } from './doc-management-routing.module';
import { DocManagementPage } from './doc-management.page';

import { AddEditFolderPageModel } from './model/folder/add-edit-folder.page';
import { AddEditDocPageModel } from './model/doc/add-edit-doc.page';
import { DocListPageModel } from './model/doc-list/doc-list.page';
import { DocDetailPageModel } from './model/doc-details/doc-detail.page';
import { TaskManagementService } from '../../providers/task-management.service';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    DocManagementPageRoutingModule
  ],
  declarations: [DocManagementPage, AddEditDocPageModel, AddEditFolderPageModel, DocListPageModel, DocDetailPageModel],
  providers:[TaskManagementService,Camera,File, WebView,
    FilePath],
  entryComponents:[AddEditDocPageModel, AddEditFolderPageModel, DocListPageModel, DocDetailPageModel]
})
export class DocManagementPageModule {}
