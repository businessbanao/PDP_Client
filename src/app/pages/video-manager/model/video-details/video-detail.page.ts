import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";

import { ActivatedRoute } from "@angular/router";
import { VideoPageModel } from "../video/video.page";
import { VideoManagementService } from "../../../../providers/video-management.service";

@Component({
  selector: "app-video-detail",
  templateUrl: "./video-detail.page.html",
  styleUrls: ["./video-detail.page.scss"],
})
export class VideoDetailPageModel implements OnInit {
  public video;
  public folderName;

  constructor(
    public modalController: ModalController,
    public toast: ToastController,
    private _formBuilder: FormBuilder,
    private _videoManagementService: VideoManagementService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {}

  async closeModal() {
    await this.modalController.dismiss();
  }

  // open edit video model
  async editVideo(data: any) {
    const modal = await this.modalController.create({
      component: VideoPageModel,
      componentProps: {
        data: data,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {});
    return await modal.present();
  }
}
