import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SettingsPage } from "./settings";

const routes: Routes = [
  {
    path: "",
    component: SettingsPage,
    // redirectTo:'analytics',
    children: [

      {
        path: "product",
        // loadChildren: "../product/product.module#ProductPageModule",
        loadChildren: () => import('../product/product.module').then(m => m.ProductPageModule)
      },
      {

        path: "analytics",
        // loadChildren: "../analytics/analytics.module#AnalyticsPageModule",
        loadChildren: () => import('../analytics/analytics.module').then(m => m.AnalyticsPageModule)
      },

      {
        path: "customer",
        // loadChildren:
          // "../customer-management/customer-management.module#CustomerManagementPageModule",
          loadChildren: () => import('../customer-management/customer-management.module').then(m => m.CustomerManagementPageModule)
      },
      {
        path: "shop",
        // loadChildren: "../shop/shop.module#ShopPageModule",
        loadChildren: () => import('../shop/shop.module').then(m => m.ShopPageModule)
      },
      {
        path: "order",
        // loadChildren: "../orders/orders.module#OrderPageModule",
        loadChildren: () => import('../orders/orders.module').then(m => m.OrderPageModule)

      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
