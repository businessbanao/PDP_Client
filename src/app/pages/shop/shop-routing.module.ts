import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopPage } from './components/shop/shop';
import { ShopDetailsPage } from './components/details/details';



const routes: Routes = [
  {
    path: '', component: ShopPage,
  },
  { path: 'details/:id', component: ShopDetailsPage },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopPageRoutingModule { }
