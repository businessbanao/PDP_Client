import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CredentialManagementPage } from "./credential-management.page";

const routes: Routes = [
  {
    path: "",
    component: CredentialManagementPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodManagementPageRoutingModule {}
