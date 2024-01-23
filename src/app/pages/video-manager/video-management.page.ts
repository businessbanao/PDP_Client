import { Component, OnInit } from "@angular/core";
import { EMIManagementService } from "../../providers/emi-management.service";
import { DatePipe } from "@angular/common";
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from "@ionic/angular";
import { VideoPageModel } from "./model/video/video.page";
import { VideoListPageModel } from "./model/video-list/video-list.page";
import { AddEditFolderPageModel } from "./model/folder/add-edit-folder.page";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { PopoverController, ToastController } from "@ionic/angular";
// import { VideoManagementService } from "../../providers/video-management.service";
import { VideoDetailPageModel } from "./model/video-details/video-detail.page";
import { VideoManagementService } from "../../providers/video-management.service";

@Component({
  selector: "app-videoManagement",
  templateUrl: "./video-management.page.html",
  styleUrls: ["./video-management.page.scss"],
  providers: [DatePipe],
})
export class VideoManagementPage implements OnInit {
  public videoFolderList: any = [];
  respMsg: String;
  public isEditMode: boolean;

  folderName: string;
  folderId: string;
  isModel: boolean;

  searchInstance: any = null;

  constructor(
    private _videoManagementService: VideoManagementService,
    private datePipe: DatePipe,
    public alertController: AlertController,

    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.getFolders(this.folderId);
  }

  // get folders
  getFolders(parentId: any) {
    console.log("called folderList");
    this._videoManagementService.getFolders(parentId).subscribe((resp) => {
      this.videoFolderList = resp.object.response;
      console.log(resp.object.response);
    });
  }

  searchVideos(q) {
    let owner = localStorage.getItem("adminId");
    this._videoManagementService.getSearchedVideo(q, owner).subscribe((resp) => {
      this.videoFolderList = resp.object.response;
      console.log(resp.object.response);
    });
  }

  // format date
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

  // show action options/sheet
  async presentActionSheet(data) {
    this.isEditMode = false;
    const actionSheet = await this.actionSheetController.create({
      header: "",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: `Edit Video`,
          role: "destructive",
          icon: "key-outline",
          handler: () => {
            this.openVideoModal(data);
          },
        },
        {
          text: "Delete Video",
          role: "destructive",
          icon: "key-outline",
          handler: () => {
            this.presentAlertConfirm(data._id);
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async presentActionSheetFolder(data) {
    this.isEditMode = false;
    const actionSheet = await this.actionSheetController.create({
      header: "",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: `Edit Folder`,
          role: "destructive",
          icon: "key-outline",
          handler: () => {
            this.openEditFolderModal(data);
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    await actionSheet.present();
  }

  // notification msg
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

  // add videos model
  async openVideoModal(data) {
    const modal = await this.modalController.create({
      component: VideoPageModel,
      componentProps: {
        folderId: this.folderId,
        data: data ? data : null,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getFolders(this.folderId);
    });
    return await modal.present();
  }

  // edit folder model
  async openAddEditFolderModal() {
    const modal = await this.modalController.create({
      component: AddEditFolderPageModel,
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getFolders(this.folderId);
    });
    return await modal.present();
  }

  // open folder model
  async editAddEditFolderModal(list) {
    const modal = await this.modalController.create({
      component: AddEditFolderPageModel,
      componentProps: {
        folderId: this.folderId ? this.folderId : null,
        data: list,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getFolders(this.folderId);
    });
    return await modal.present();
  }

  // open videos list model
  async openVideoListModal(folder_id: String, folder_name: String) {
    const modal = await this.modalController.create({
      component: VideoManagementPage,
      componentProps: {
        folderId: folder_id,
        folderName: folder_name,
        isModel: true,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getFolders(this.folderId);
    });

    // });
    return await modal.present();
  }

  async openEditFolderModal(body) {
    const modal = await this.modalController.create({
      component: AddEditFolderPageModel,
      componentProps: {
        data: body,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getFolders(this.folderId);
    });
    return await modal.present();
  }

  deleteVideo(id) {
    this._videoManagementService.deleteFolder(id).subscribe((data) => {
      this.getFolders(this.folderId);
      this.presentToast("Video Deleted");
    });
  }

  async presentAlertConfirm(id) {
    let self = this;
    const alert = await this.alertController.create({
      header: "Delete Video",
      message: "Are you sure you want to delete?",
      buttons: [
        {
          text: "Cancel",

          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Okay",
          handler: () => {
            self.deleteVideo(id);
          },
        },
      ],
    });

    await alert.present();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  searchTextChange(value) {
    console.log(value);

    clearTimeout(this.searchInstance);

    this.searchInstance = setTimeout(() => {
      this.searchVideos(value);
    }, 800);
  }

  async previewVideo(list) {
    const modal = await this.modalController.create({
      component: VideoDetailPageModel,
      componentProps: {
        video: list,
        folderName: this.folderName,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getFolders(this.folderId);
    });

    // });
    return await modal.present();
  }
}
