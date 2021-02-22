import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { MatNativeDateModule } from '@angular/material/core';
import { EMIManagementPageRoutingModule } from './emi-management-routing.module';
import { EMIManagementPage } from './emi-management.page';

import { EMIPageModel } from './model/emi/emi.page';
import { DayManagementService } from '../../providers/day-management.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    EMIManagementPageRoutingModule
  ],
  declarations: [EMIManagementPage, EMIPageModel],
  providers:[DayManagementService],
  entryComponents:[EMIPageModel]
})
export class EMIManagementPageModule {}
