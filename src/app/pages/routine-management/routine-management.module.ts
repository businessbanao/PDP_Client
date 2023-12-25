import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { MatNativeDateModule } from '@angular/material/core';
import { RoutineManagementPageRoutingModule } from './routine-management-routing.module';
import { RoutineManagementPage } from './routine-management.page';

import { AddEditRoutineModel } from './model/addEditRoutine/addEditRoutine.page';
import { RoutineManagementService } from '../../providers/routine-management.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    RoutineManagementPageRoutingModule
  ],
  declarations: [RoutineManagementPage, AddEditRoutineModel],
  providers:[RoutineManagementService],
  entryComponents:[AddEditRoutineModel]
})
export class RoutineManagementPageModule {}
