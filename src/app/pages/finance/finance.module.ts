import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

// import { BrowserModule } from '@angular/platform-browser';
import { NgDatepickerModule } from 'ng2-datepicker';

import { MatNativeDateModule } from '@angular/material/core';
import { FinancePageRoutingModule } from './finance-routing.module';

import { FinancePage } from './finance.page';
import { AccountService } from '../../providers/account.service';
import { FinanceService } from '../../providers/finance.service';
import { AccountPageModel } from "./model/account/account.page";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinancePageRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    // BrowserModule,
   
  ],
  declarations: [FinancePage, AccountPageModel],
  providers:[AccountService, FinanceService],
  entryComponents:[AccountPageModel]
})
export class FinancePageModule {}
