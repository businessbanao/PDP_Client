import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DayManagementPage } from './day-management.page';

const routes: Routes = [
  {
    path: '',
    component: DayManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DayManagementPageRoutingModule {}
