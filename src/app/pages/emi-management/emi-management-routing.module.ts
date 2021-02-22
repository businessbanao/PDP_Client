import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EMIManagementPage } from './emi-management.page';

const routes: Routes = [
  {
    path: '',
    component: EMIManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EMIManagementPageRoutingModule {}
