import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { FoodManagementPage } from "./food-management.page";

const routes: Routes = [
  {
    path: "",
    component: FoodManagementPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodManagementPageRoutingModule {}
