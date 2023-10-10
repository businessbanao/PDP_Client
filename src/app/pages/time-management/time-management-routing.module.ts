import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeManagementPage } from './time-management.page';

const routes: Routes = [
  {
    path: '',
    component: TimeManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeManagementPageRoutingModule {}
