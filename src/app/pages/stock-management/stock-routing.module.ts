import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockPage } from './stock.page';
import { TransectionDetailsPage  } from "./components/transection-details/transection-details";



const routes: Routes = [
  {
    path: '',
    component: StockPage
  },
  // { path: 'transection-details/:id', component: TransectionDetailsPage },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GitPageRoutingModule {}
