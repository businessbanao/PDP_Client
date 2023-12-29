import { Component, OnInit } from '@angular/core';
import { EMIManagementService } from '../../providers/emi-management.service';
import { DatePipe } from '@angular/common';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { NotePageModel } from './model/note/note.page';
import { NoteListPageModel } from './model/note-list/note-list.page';
import { AddEditFolderPageModel } from './model/folder/add-edit-folder.page';
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { PopoverController, ToastController } from '@ionic/angular';
import { NoteManagementService } from '../../providers/note-management.service';


@Component({
  selector: 'app-noteManagement',
  templateUrl: './note-management.page.html',
  styleUrls: ['./note-management.page.scss'],
  providers: [DatePipe]
})

export class NoteManagementPage implements OnInit {

  public noteFolderList: any = [];
  respMsg: String;
  public isEditMode: boolean;

  folderName: string;
  folderId: string;
  isModel: boolean;


  constructor(
    private _noteManagementService: NoteManagementService,
    private datePipe: DatePipe,
    public alertController: AlertController,

    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    public modalController: ModalController) {
  }

  ngOnInit() {
    this.getFolders(this.folderId);
  }

  // get folders
  getFolders(parentId: any) {
    console.log("called folderList")
    this._noteManagementService.getFolders(parentId).subscribe((resp) => {
      this.noteFolderList = resp.object.response;
      console.log(resp.object.response);
    });
  }

  // format date
  dateFormater(inputDate) {
    let tempDate = new Date(inputDate);
    let date = tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate();
    let month = (tempDate.getMonth() + 1) ? "0" + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1;
    let year = tempDate.getFullYear();
    return isNaN(tempDate.getTime()) ? "" : year + '-' + month + '-' + date;
  }

  // show action options/sheet
  async presentActionSheet(data) {
    this.isEditMode = false;
    const actionSheet = await this.actionSheetController.create({
      header: "",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Edit Note",
          role: "destructive",
          icon: "key-outline",
          handler: () => {
            this.openNoteModal(data);
          },
        },
        {
          text: "Delete Note",
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

  // notification msg
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: "bottom",
      color: 'success',
      animated: true,
    });
    toast.present();
  }

  // add notes model
  async openNoteModal(data) {
    const modal = await this.modalController.create({
      component: NotePageModel,
      componentProps: {
        folderId: this.folderId,
        data: data ? data :null
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getFolders(this.folderId);
    });
    return await modal.present();
  }

  // edit folder model
  async openAddEditFolderModal() {
    const modal = await this.modalController.create({
      component: AddEditFolderPageModel
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getFolders(this.folderId);
    });
    return await modal.present();
  }

  // open folder model
  async editAddEditFolderModal() {
    const modal = await this.modalController.create({
      component: AddEditFolderPageModel,
      componentProps: {
        folderId: this.folderId ? this.folderId : null
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getFolders(this.folderId);
    });
    return await modal.present();
  }

  // open notes list model
  async openNoteListModal(folder_id: String, folder_name: String) {
    const modal = await this.modalController.create({
      component: NoteManagementPage,
      componentProps: {
        folderId: folder_id,
        folderName: folder_name,
        isModel: true

      }
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
        data: body
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getFolders(null);
    });
    return await modal.present();
  }


  deleteFolderManagement(id) {
    this._noteManagementService.deleteFolder(id).subscribe((data) => {
      this.getFolders(id);
      this.presentToast("Folder Deleted");
    });
  }
 
  async presentAlertConfirm(id) {
    let self = this;
    const alert = await this.alertController.create({
      header: 'Delete Folder',
      message: "Are you sure you want to delete?",
      buttons: [
        {
          text: 'Cancel',

          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Okay',
          handler: () => {
            self.deleteFolderManagement(id)
            this.getFolders(null);
          }
        }
      ]
    });

    await alert.present();
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  previewNote(list){
     // open model for show content
  }

}
