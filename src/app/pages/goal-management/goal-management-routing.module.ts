import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GoalManagementPage } from './goal-management.page';

const routes: Routes = [
  {
    path: '',
    component: GoalManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoalManagementPageRoutingModule {}
