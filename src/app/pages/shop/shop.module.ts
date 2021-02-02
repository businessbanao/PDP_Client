import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShopPage } from './components/shop/shop';
import { ShopDetailsPage } from './components/details/details';
import { AddProductToShopPage } from './modal/addProductToShop/addProductToShop';
import { AddShopPage } from "./modal/addshop";
import { ShopPageRoutingModule } from './shop-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ShopService } from "../../providers/shop.services";
import {MatSelectModule} from '@angular/material/select';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopPageRoutingModule,
    ReactiveFormsModule,
    MatSelectModule,
    ToastModule
  ],
  declarations: [
    ShopPage,
    AddShopPage,
    ShopDetailsPage,
    AddProductToShopPage

  ],
  providers: [ShopService,Camera,File,MessageService],
  entryComponents: [
    AddShopPage,
    AddProductToShopPage

  ]
})
export class ShopPageModule { }
