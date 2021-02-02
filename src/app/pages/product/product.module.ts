import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductPage } from './components/product-list/product';
import { ProductDetailsPage } from './components/product-details/product-details';
import { ProductReviewsPage } from './components/product-reviews/product-reviews';

import { ProductPageRoutingModule } from './product-routing.module';
import { AddProductPage } from "./modal/addProduct";
import { ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductPageRoutingModule,
    ReactiveFormsModule,
    MatTabsModule,

  ],
  declarations: [
    ProductPage,
    AddProductPage,
    ProductDetailsPage,
    ProductReviewsPage
  ],
  providers:[Camera,File, WebView,
    FilePath],
  entryComponents: [
    AddProductPage
  ]
})
export class ProductPageModule { }

