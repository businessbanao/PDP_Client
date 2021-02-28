import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { NoteManagementService } from '../../../../providers/note-management.service';
import { ActivatedRoute } from "@angular/router";
import { NoteDetailPageModel } from '../note-details/note-detail.page';
import { NotePageModel } from "../note/note.page";

@Component({
  selector: "app-note-list",
  templateUrl: "./note-list.page.html",
  styleUrls: ["./note-list.page.scss"],
})
export class NoteListPageModel implements OnInit {
  
  public folderId;
  public folderName;
  public notesList:any = [];
  
  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    private _formBuilder: FormBuilder,
    private _noteManagementService:NoteManagementService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.getFolderNotes(this.folderId);
  }
  
  async closeModal() {
    await this.modalController.dismiss();
  }

  // add notes model
  async openNoteModal() {
    const modal = await this.modalController.create({
      component: NotePageModel
    });
    modal.onDidDismiss().then((dataReturned) => {});
    return await modal.present();
  }

  // get notes of provided folder_id
  getFolderNotes(folder_id: String) {
    this._noteManagementService.getFolderNotes(folder_id).subscribe(async (resp) => {
      this.notesList = resp.response;
    });
  }

  // delete note with provided note_id
  deleteNote(noteId){
    let responseMsg:String;
    this._noteManagementService.deleteNote(noteId).subscribe(async resp => {
      if(!resp.error){
        this.getFolderNotes(this.folderId);
      }
      this.presentToast(resp.message);
        
    });
    
  }

  // show notification msg
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

  // open edit note model
  async editNote(data: any) {
    const modal = await this.modalController.create({
      component: NotePageModel,
      componentProps:{
        data : data
      }
    });
    modal.onDidDismiss().then((dataReturned) => {});
    return await modal.present();
  }

  // open note detail model
  async openNoteDetailModal(data:any) {
    const modal = await this.modalController.create({
      component: NoteDetailPageModel,
      componentProps:{
        note : data,
        folderName : this.folderName
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getFolderNotes(this.folderId);
    });
    return await modal.present();
  }

  // date formatter
  dateFormater(inputDate) {
    let tempDate = new Date(inputDate);
    let date = tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate();
    let month = (tempDate.getMonth() + 1) ? "0" + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1;
    let year = tempDate.getFullYear();
    return isNaN(tempDate.getTime()) ? "" : year + '-' + month + '-' + date; 
  }
}
