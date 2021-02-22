import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { MatNativeDateModule } from '@angular/material/core';
import { GoalManagementPageRoutingModule } from './goal-management-routing.module';
import { GoalManagementPage } from './goal-management.page';

import { GoalPageModel } from './model/goal/goal.page';
import { DayManagementService } from '../../providers/day-management.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    GoalManagementPageRoutingModule
  ],
  declarations: [GoalManagementPage, GoalPageModel],
  providers:[DayManagementService],
  entryComponents:[GoalPageModel]
})
export class GoalManagementPageModule {}
