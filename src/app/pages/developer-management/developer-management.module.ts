import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { MatNativeDateModule } from '@angular/material/core';
import { DeveloperManagementPageRoutingModule } from './developer-management-routing.module';
import { DeveloperManagementPage } from './developer-management.page';

import { AddEditModulePageModel } from './model/add-edit-module/add-edit-module.page';
import { DayManagementService } from '../../providers/day-management.service';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    DeveloperManagementPageRoutingModule,
    MatExpansionModule
  ],
  declarations: [DeveloperManagementPage, AddEditModulePageModel,],
  providers:[DayManagementService,Camera,File, WebView,
    FilePath],
  entryComponents:[AddEditModulePageModel]
})
export class DeveloperManagementPageModule {}
