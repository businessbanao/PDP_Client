import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfferPage } from './components/offer/offer';



const routes: Routes = [

  { path: '', component: OfferPage },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferPageRoutingModule { }
