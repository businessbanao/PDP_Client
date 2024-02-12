import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { MatNativeDateModule } from '@angular/material/core';
import { TodoManagementPageRoutingModule } from './todo-management-routing.module';
import { TodoManagementPage } from './todo-management.page';

import { TododPageModel } from './model/todo/todo.page';
import { TaskManagementService } from '../../providers/task-management.service';
import { TimeManagementService } from "../../providers/time-management.service";
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    TodoManagementPageRoutingModule,
    NgxMaterialTimepickerModule
  ],
  declarations: [TodoManagementPage, TododPageModel],
  providers:[TaskManagementService,TimeManagementService],
  entryComponents:[TododPageModel]
})
export class TodoManagementPageModule {}
