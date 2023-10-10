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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    TodoManagementPageRoutingModule
  ],
  declarations: [TodoManagementPage, TododPageModel],
  providers:[TaskManagementService],
  entryComponents:[TododPageModel]
})
export class TodoManagementPageModule {}
