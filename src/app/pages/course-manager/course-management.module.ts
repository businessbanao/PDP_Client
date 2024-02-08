import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { MatNativeDateModule } from '@angular/material/core';
import { CourseManagementPageRoutingModule } from './course-management-routing.module';
import { CourseManagerPage } from './course-manager.page';
import { ChapterPageModel } from './model/ChapterList/chapter.page';
import { TaskManagementService } from '../../providers/task-management.service';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { CKEditorModule } from 'ng2-ckeditor';
import { TagInputModule } from 'ngx-chips';
import { CourseManagementService } from '../../providers/course-management.service';
import { ChapterDetailPageModel } from './model/ChapterDetail/chapterDetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    CourseManagementPageRoutingModule,
    TagInputModule,
    CKEditorModule
    
  ],
  declarations: [CourseManagerPage, ChapterPageModel,ChapterDetailPageModel],
  providers:[CourseManagementService,Camera,File, WebView,
    FilePath],
  entryComponents:[ChapterPageModel,ChapterPageModel,ChapterDetailPageModel]
})
export class CourseManagementPageModule {}
