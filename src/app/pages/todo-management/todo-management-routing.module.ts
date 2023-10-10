import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodoManagementPage } from './todo-management.page';

const routes: Routes = [
  {
    path: '',
    component: TodoManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodoManagementPageRoutingModule {}
