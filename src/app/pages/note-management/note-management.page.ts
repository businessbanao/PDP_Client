import { Component, OnInit } from '@angular/core';
import { EMIManagementService } from '../../providers/emi-management.service';
import { DatePipe } from '@angular/common';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { NotePageModel } from './model/note/note.page';
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
    this.getNotes();
  }

  getNotes() {
    this._noteManagementService.getNotes(localStorage.getItem('adminId')).subscribe((resp) => {
      this.notesList = resp.response;
    });
  }

  deleteNote(noteId){
    let responseMsg:String;
    this._noteManagementService.deleteNote(noteId).subscribe(async resp => {
      this.presentToast("Note deleted successfully.");
      this.getNotes();
    });
  }

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

  editNote(data) {
    this.isEditMode = true;
    this.editEmiModal(data);
  }

  dateFormater(inputDate) {
    let tempDate = new Date(inputDate);
    let date = tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate();
    let month = (tempDate.getMonth() + 1) ? "0" + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1;
    let year = tempDate.getFullYear();
    return isNaN(tempDate.getTime()) ? "" : year + '-' + month + '-' + date; 
  }

  async openNoteModal() {
    const modal = await this.modalController.create({
      component: NotePageModel
    });
    modal.onDidDismiss().then((dataReturned) => {});
    return await modal.present();
  }
  
  async editEmiModal(data: any) {
    const modal = await this.modalController.create({
      component: NotePageModel,
      componentProps:{
        editMode : this.isEditMode,
        data : data
      }
    });
    modal.onDidDismiss().then((dataReturned) => {});
    return await modal.present();
  }
}
