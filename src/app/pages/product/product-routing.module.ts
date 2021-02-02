import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductPage } from './components/product-list/product';
import { ProductDetailsPage } from './components/product-details/product-details';
import { ProductReviewsPage } from './components/product-reviews/product-reviews';
 
const routes: Routes = [
  {
    path: '', component: ProductPage,
  },
  { path: 'product-details/:id', component: ProductDetailsPage },
  { path: 'product-review/:id', component: ProductReviewsPage },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductPageRoutingModule { }
