import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutineManagementPage } from './routine-management.page';

const routes: Routes = [
  {
    path: '',
    component: RoutineManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutineManagementPageRoutingModule {}
