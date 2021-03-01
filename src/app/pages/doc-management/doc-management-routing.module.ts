import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocManagementPage } from './doc-management.page';

const routes: Routes = [
  {
    path: '',
    component: DocManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocManagementPageRoutingModule {}
