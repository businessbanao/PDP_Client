import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { IonicModule } from "@ionic/angular";

import { MatNativeDateModule } from "@angular/material/core";
import { VideoManagementPageRoutingModule } from "./video-management-routing.module";
import { VideoManagementPage } from "./video-management.page";

import { AddEditFolderPageModel } from "./model/folder/add-edit-folder.page";
import { VideoPageModel } from "./model/video/video.page";
import { VideoListPageModel } from "./model/video-list/video-list.page";
import { VideoDetailPageModel } from "./model/video-details/video-detail.page";
import { TaskManagementService } from "../../providers/task-management.service";
import { Camera } from "@ionic-native/camera/ngx";
import { File } from "@ionic-native/file/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { FilePath } from "@ionic-native/file-path/ngx";
// import { CKEditorModule } from 'ng2-ckeditor';
import { TagInputModule } from "ngx-chips";
import { VideoManagementService } from "../../providers/video-management.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    VideoManagementPageRoutingModule,
    TagInputModule,
    // CKEditorModule
  ],
  declarations: [
    VideoManagementPage,
    VideoPageModel,
    AddEditFolderPageModel,
    VideoListPageModel,
    VideoDetailPageModel,
  ],
  providers: [TaskManagementService,VideoManagementService, Camera, File, WebView, FilePath],
  entryComponents: [
    VideoPageModel,
    AddEditFolderPageModel,
    VideoListPageModel,
    VideoDetailPageModel,
  ],
})
export class VideoManagementPageModule {}
