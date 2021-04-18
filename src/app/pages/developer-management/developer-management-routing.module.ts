import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeveloperManagementPage } from './developer-management.page';

const routes: Routes = [
  {
    path: '',
    component: DeveloperManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeveloperManagementPageRoutingModule {}
