import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { MatNativeDateModule } from '@angular/material/core';
import { DayManagementPageRoutingModule } from './day-management-routing.module';
import { DayManagementPage } from './day-management.page';

import { TaskPageModel } from './model/task/task.page';
import { DayManagementService } from '../../providers/day-management.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    DayManagementPageRoutingModule
  ],
  declarations: [DayManagementPage, TaskPageModel],
  providers:[DayManagementService],
  entryComponents:[TaskPageModel]
})
export class DayManagementPageModule {}
