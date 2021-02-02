import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderDetailsPage } from './components/order-details/order-details';
import { OrderListPage } from './components/order-list/order-list';

const routes: Routes = [
  {
    path: '',
    component: OrderListPage
  },
  {
    path: 'order-details/:id',
    component: OrderDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderPageRoutingModule { }
