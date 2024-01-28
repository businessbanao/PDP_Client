import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseManagerPage } from './course-manager.page';


const routes: Routes = [
  {
    path: '',
    component: CourseManagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseManagementPageRoutingModule
 {}
