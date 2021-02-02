import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuPage } from './menu';
import { MenuPageRoutingModule } from './menu-routing.module';
import { CategoryPage } from "./components/category/category";
import { SubCategoryPage } from "./components/subCategory/subCategory";
import { mainMenuPage } from "./modal/mainMenu/mainMenu";
import { AddCategoryPage } from "./modal/category/addCategory";
import { ReactiveFormsModule } from '@angular/forms';
import { AddSubCategoryPage } from "./modal/subCategory/addSubCategory";
import { MatSelectModule } from '@angular/material/select';
import { ViewMenuPage } from "./components/View Menu/viewMenu";
import { Camera } from '@ionic-native/camera/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPageRoutingModule,
    ReactiveFormsModule,
    MatSelectModule,

  ],
  declarations: [
    MenuPage,
    CategoryPage,
    SubCategoryPage,
    mainMenuPage,
    AddCategoryPage,
    AddSubCategoryPage,
    ViewMenuPage

  ],
  providers : [Camera],
  entryComponents: [AddCategoryPage, AddSubCategoryPage ,mainMenuPage
  ]
})
export class MenuPageModule { }
