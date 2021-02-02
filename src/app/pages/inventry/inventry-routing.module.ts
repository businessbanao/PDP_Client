import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventryPage } from './components/inventry/inventry';



const routes: Routes = [

  { path: '', component: InventryPage },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventryPageRoutingModule { }
