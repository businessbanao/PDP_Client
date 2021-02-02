import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MatDialogModule} from '@angular/material/dialog'

import { InventryPageRoutingModule } from './inventry-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ShopService } from "../../providers/shop.services";
import {MatSelectModule} from '@angular/material/select';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { InventryPage } from "./components/inventry/inventry";
import {MatTabsModule} from '@angular/material/tabs';
import { DescriptionModelDialog } from "./components/inventry/inventry";
import { AccountPage} from './model/accounts/accounts'
import { LedgerPage } from "./model/ledger/ledger";
import { VendorPage } from "./model/vendor/vendor";
import { ManualInventryPage } from "./model/manual-inventry/manual-inventry";
import {MatStepperModule} from '@angular/material/stepper';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { VendorReportPage } from './model/vendor-report/vendor-report';
import { PreviewInventryPage } from './components/preview-inventry/preview-inventry';
import { StaffSalaryPage } from './model/staff-salary/staff-salary';
import { MonthlyReportPage } from './model/monthly-report/monthly-report';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventryPageRoutingModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTabsModule,
    MatDialogModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [
    InventryPage,
    DescriptionModelDialog,
    AccountPage,
    LedgerPage,
    ManualInventryPage,
    VendorPage,
    VendorReportPage,
    PreviewInventryPage,
    StaffSalaryPage,
    MonthlyReportPage
  ],
  providers: [ShopService,Camera,File],

  entryComponents: [
    DescriptionModelDialog,
    AccountPage,
    LedgerPage,
    ManualInventryPage,
    VendorPage,
    VendorReportPage,
    PreviewInventryPage,
    StaffSalaryPage,
    MonthlyReportPage
  ]
})
export class InventryPageModule { }
