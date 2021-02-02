import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerPage } from './components/customer/customer';
import { CustomerDetailsPage } from "./components/customer-details/customer-details";

const routes: Routes = [
  {
    path: '', component: CustomerPage,
  },
  { path: 'customer-details/:id', component: CustomerDetailsPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerManagementPageRoutingModule { }
