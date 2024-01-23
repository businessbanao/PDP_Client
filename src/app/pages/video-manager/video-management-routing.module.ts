import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { VideoManagementPage } from "./video-management.page";

const routes: Routes = [
  {
    path: "",
    component: VideoManagementPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoManagementPageRoutingModule {}
