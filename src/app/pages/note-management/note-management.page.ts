import { Component, OnInit } from '@angular/core';
import { EMIManagementService } from '../../providers/emi-management.service';
import { DatePipe } from '@angular/common';
import { ActionSheetController, ModalController } from '@ionic/angular';
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

  public folderList:any = [];
  public notesList:any = [];
  respMsg:String;
  public isEditMode: boolean;
  emiForm: FormGroup;

  constructor(
    private _noteManagementService: NoteManagementService, 
    private datePipe: DatePipe, 
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    public modalController: ModalController) {
  }

  ngOnInit() {
    this.getFolders();
  }

  // get folders
  getFolders(){
    this._noteManagementService.getFolders().subscribe((resp) => {
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
    this.isEditMode = false;
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

  // add notes model
  async openNoteModal() {
    const modal = await this.modalController.create({
      component: NotePageModel,
      componentProps:{
        filder_list : this.folderList
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getNotes();
    });
    return await modal.present();
  }
  
  // edit folder model
  async openAddEditFolderModal() {
    const modal = await this.modalController.create({
      component: AddEditFolderPageModel
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getFolders();
    });
    return await modal.present();
  }
  
  // open folder model
  async editAddEditFolderModal(data: any) {
    const modal = await this.modalController.create({
      component: AddEditFolderPageModel,
      componentProps:{
        data : data
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
<<<<<<< HEAD
      this.getFolders();
    });
    return await modal.present();
  }

  // open notes list model
  async openNoteListModal(folder_id:String, folder_name: String) {
    const modal = await this.modalController.create({
      component: NoteListPageModel,
      componentProps:{
        folderId : folder_id,
        folderName : folder_name
      }
    });
    modal.onDidDismiss().then((dataReturned) => {});
=======
      this.getNotes();
    });
>>>>>>> 60c07ac1ef05ff3a2b6b6bde18f2379c6802b2d0
    return await modal.present();
  }
}
