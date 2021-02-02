import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SearchPage } from './components/product-list/search';
import { SearchPageRoutingModule } from './search-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    ReactiveFormsModule,
    MatTabsModule
  ],
  declarations: [
    SearchPage
  ],
  entryComponents: [
  ]
})
export class SearchPageModule { }

