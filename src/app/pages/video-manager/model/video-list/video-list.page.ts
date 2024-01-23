import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { VideoManagementService } from "../../../../providers/video-management.service";
import { ActivatedRoute } from "@angular/router";
import { VideoDetailPageModel } from "../video-details/video-detail.page";
import { VideoPageModel } from "../video/video.page";

@Component({
  selector: "app-video-list",
  templateUrl: "./video-list.page.html",
  styleUrls: ["./video-list.page.scss"],
})
export class VideoListPageModel implements OnInit {
  public folderId;
  public folderName;
  public videosList: any = [];
  public folderList: any[];

  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    private _formBuilder: FormBuilder,
    private _videoManagementService: VideoManagementService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getFolderVideos(this.folderId);
  }

  // add videos model
  async openVideoModal() {
    const modal = await this.modalController.create({
      component: VideoPageModel,
      componentProps: {
        folder_list: this.folderList,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getFolderVideos(this.folderId);
    });
    return await modal.present();
  }

  // get videos of provided folder_id
  getFolderVideos(folder_id: String) {
    this._videoManagementService
      .getFolderVideos(folder_id)
      .subscribe(async (resp) => {
        this.videosList = resp.response;
      });
  }

  // delete video with provided video_id
  deleteVideo(videoId) {
    let responseMsg: String;
    this._videoManagementService.deleteVideo(videoId).subscribe(async (resp) => {
      if (!resp.error) {
        this.getFolderVideos(this.folderId);
      }
      this.presentToast(resp.message);
    });
  }

  // show notification msg
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: "bottom",
      color: "success",
      animated: true,
    });
    toast.present();
  }

  // open edit video model
  async editVideo(data: any) {
    const modal = await this.modalController.create({
      component: VideoPageModel,
      componentProps: {
        data: data,
        folder_list: this.folderList,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getFolderVideos(this.folderId);
    });
    return await modal.present();
  }

  // open video detail model
  async openVideoDetailModal(data: any) {
    const modal = await this.modalController.create({
      component: VideoDetailPageModel,
      componentProps: {
        video: data,
        folderName: this.folderName,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getFolderVideos(this.folderId);
    });
    return await modal.present();
  }

  // date formatter
  dateFormater(inputDate) {
    let tempDate = new Date(inputDate);
    let date =
      tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate();
    let month =
      tempDate.getMonth() + 1
        ? "0" + (tempDate.getMonth() + 1)
        : tempDate.getMonth() + 1;
    let year = tempDate.getFullYear();
    return isNaN(tempDate.getTime()) ? "" : year + "-" + month + "-" + date;
  }
}
