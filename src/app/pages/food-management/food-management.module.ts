import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { IonicModule } from "@ionic/angular";

import { MatNativeDateModule } from "@angular/material/core";
import { FoodManagementPageRoutingModule } from "./food-management-routing.module";
import { FoodManagementPage } from "./food-management.page";

import { FoodPageModel } from "./model/food/food.page";
import { TaskManagementService } from "../../providers/task-management.service";
import { Camera } from "@ionic-native/camera/ngx";
import { File } from "@ionic-native/file/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { FilePath } from "@ionic-native/file-path/ngx";
import { CKEditorModule } from 'ng2-ckeditor';
import { TagInputModule } from "ngx-chips";
import { FoodManagementService } from "../../providers/food-management.service";
import { FoodConsumptionPageModel } from "./model/foodConsuption/foodConsumption.page";
import { FoodConsumptionViewPageModel } from "./model/foodConsumptionView/foodConsumptionView.page";
import { FoodTab } from "./foodtab/FoodTab";

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
    CKEditorModule
  ],
  declarations: [FoodManagementPage,FoodPageModel,FoodConsumptionPageModel,FoodConsumptionViewPageModel,FoodTab],
  providers: [FoodManagementService, Camera, File, WebView, FilePath],
  entryComponents: [FoodPageModel,FoodConsumptionPageModel,FoodConsumptionViewPageModel],
})
export class FoodManagementPageModule {}
