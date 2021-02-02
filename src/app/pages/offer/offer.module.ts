import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { OfferPageRoutingModule } from './offer-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ShopService } from "../../providers/shop.services";
import {MatSelectModule} from '@angular/material/select';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { OfferPage } from "./components/offer/offer";
import {MatTabsModule} from '@angular/material/tabs';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfferPageRoutingModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
        MatInputModule
  ],
  declarations: [
    OfferPage
  ],
  providers: [ShopService,Camera,File],
  entryComponents: [

  ]
})
export class OfferPageModule { }
