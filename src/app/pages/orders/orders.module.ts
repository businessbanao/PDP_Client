import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { OrderListPage } from './components/order-list/order-list';
import { OrderDetailsPage } from './components/order-details/order-details';
import { Clipboard } from "@ionic-native/clipboard/ngx";
import { OrderPageRoutingModule } from './orders-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderPageRoutingModule
  ],
  declarations: [
    OrderListPage,
    OrderDetailsPage

  ],
  providers: [
    Clipboard,

  ]
})
export class OrderPageModule { }
