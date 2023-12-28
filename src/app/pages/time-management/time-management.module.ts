import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { MatNativeDateModule } from '@angular/material/core';
import { TimeManagementPageRoutingModule } from './time-management-routing.module';
import { TimeManagementPage } from './time-management.page';

import { TimePageModel } from './model/time/time.page';
import { TimeManagementService } from '../../providers/time-management.service';
import { Time24to12Format } from './pipe/time24to12.pipe';
import { TaskManagementService } from '../../providers/task-management.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    TimeManagementPageRoutingModule,
  ],
  declarations: [TimeManagementPage, TimePageModel,Time24to12Format],
  providers:[TimeManagementService,TaskManagementService],
  entryComponents:[TimePageModel]
})
export class TimeManagementPageModule {}
