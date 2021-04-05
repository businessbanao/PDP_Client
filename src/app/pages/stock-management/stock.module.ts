import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { MatNativeDateModule } from '@angular/material/core';
import { GitPageRoutingModule } from './stock-routing.module'; //change

import { StockPage } from './stock.page';
import { AccountService } from '../../providers/account.service';
import { FinanceService } from '../../providers/finance.service';
import { AddEditStockPageModel } from "./model/stock/add-edit-stock.page";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GitPageRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule
  ],
  declarations: [StockPage, AddEditStockPageModel],
  providers:[AccountService, FinanceService],
  entryComponents:[AddEditStockPageModel]
})
export class GitPageModule {}
