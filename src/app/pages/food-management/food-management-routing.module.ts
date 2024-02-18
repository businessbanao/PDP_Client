import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { FoodManagementPage } from "./food-management.page";
import { FoodTab } from "./foodtab/FoodTab";

const routes: Routes = [
  {
    path: "",
    component: FoodManagementPage
  },
  {
    path: "nutrition",
    component: FoodTab
  },
  // {
  //   path: "",
  //   component: FoodTab
  // },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodManagementPageRoutingModule {}
