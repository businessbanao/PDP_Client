import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { IonicModule } from "@ionic/angular";

import { MatNativeDateModule } from "@angular/material/core";
import { FoodManagementPageRoutingModule } from "./credential-management-routing.module";
import { CredentialManagementPage } from "./credential-management.page";

import { AddEditCredentialPageModel } from "./model/credential/credential.page";
import { Camera } from "@ionic-native/camera/ngx";
import { File } from "@ionic-native/file/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { FilePath } from "@ionic-native/file-path/ngx";
// import { CKEditorModule } from 'ng2-ckeditor';
import { TagInputModule } from "ngx-chips";
import { CredentialManagementService } from "../../providers/credential-management.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    FoodManagementPageRoutingModule,
    TagInputModule,
    // CKEditorModule
  ],
  declarations: [CredentialManagementPage, AddEditCredentialPageModel],
  providers: [CredentialManagementService, Camera, File, WebView, FilePath],
  entryComponents: [AddEditCredentialPageModel],
})
export class CredentialManagementPageModule {}
