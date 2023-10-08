import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { MatNativeDateModule } from '@angular/material/core';
import { FinancePageRoutingModule } from './finance-routing.module';

import { FinancePage } from './finance.page';
import { AccountService } from '../../providers/account.service';
import { FinanceService } from '../../providers/finance.service';
import { AccountPageModel } from "./model/account/account.page";
import { LedgerPageModel } from './model/ledger/ledger.page';
import { AccountLedgerPageModel } from './model/account_ledger/account_ledger.page';
import { Camera } from '@ionic-native/camera/ngx';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinancePageRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatExpansionModule
  ],
  declarations: [FinancePage, AccountPageModel, LedgerPageModel, AccountLedgerPageModel],
  providers:[AccountService, FinanceService, Camera],
  entryComponents:[AccountPageModel, LedgerPageModel, AccountLedgerPageModel]
})
export class FinancePageModule {}
