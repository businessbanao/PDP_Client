import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoteManagementPage } from './note-management.page';

const routes: Routes = [
  {
    path: '',
    component: NoteManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoteManagementPageRoutingModule {}
