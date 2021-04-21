import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AddEditDocPageModel } from './model/doc/add-edit-doc.page';
import { DocListPageModel } from './model/doc-list/doc-list.page';
import { AddEditFolderPageModel } from './model/folder/add-edit-folder.page';
import { ToastController } from '@ionic/angular';
import { DocManagementService } from '../../providers/doc-management.service';
import { AlertController } from "@ionic/angular";



@Component({
  selector: 'app-docManagement',
  templateUrl: './doc-management.page.html',
  styleUrls: ['./doc-management.page.scss'],
  providers: [DatePipe]
})

export class DocManagementPage implements OnInit {

  public folderList:any = [];
  respMsg:String;

  constructor(
    private _docManagementService: DocManagementService, 
    private datePipe: DatePipe, 
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    public alertController: AlertController,

    public modalController: ModalController) {
  }

  ngOnInit() {
    this.getDocFolders();
  }

  // get folders
  getDocFolders(){
    this._docManagementService.getDocFolders().subscribe((resp) => {
      this.folderList = resp.response;
      console.log(this.folderList);
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
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
       header: "",
       cssClass: "my-custom-class",
       buttons: [
         {
           text: "Create Folder",
           role: "destructive",
           icon: "key-outline",
           handler: () => {
             this.openAddEditFolderModal();
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
  async presentToast(msg){
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: "bottom",
      color:'success',
      animated: true,
    });
    toast.present();
  }

  // add doc model
  async openAddEditDocModal() {
    const modal = await this.modalController.create({
      component: AddEditDocPageModel,
      // componentProps:{
      //   folderList : this.folderList
      // }
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getDocFolders();
    });
    return await modal.present();
  }
  
  // open folder model
  async openAddEditFolderModal() {
    const modal = await this.modalController.create({
      component: AddEditFolderPageModel
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getDocFolders();
    });
    return await modal.present();
  }
  
  // edit folder model
  async editAddEditFolderModal(data: any) {
    const modal = await this.modalController.create({
      component: AddEditFolderPageModel,
      componentProps:{
        data : data
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getDocFolders();
    });
    return await modal.present();
  }

  // open doc list model
  async openDocListModal(folder_id:String, folder_name: String) {
    const modal = await this.modalController.create({
      component: DocListPageModel,
      componentProps:{
        folderId : folder_id,
        folderName : folder_name
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getDocFolders();
    });
      
    // });
    return await modal.present();
  }

  async openEditFolderModal(body) {
    const modal = await this.modalController.create({
  component: AddEditFolderPageModel,
  componentProps:{
    data:body
  }
});
modal.onDidDismiss().then((dataReturned) => {
  this.getDocFolders();
});
return await modal.present();
}


deleteFolderManagement(id) {
  this._docManagementService.deleteFolder(id).subscribe((data) => {
    this.getDocFolders();
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
        }
      }
    ]
  });

  await alert.present();
}






}
