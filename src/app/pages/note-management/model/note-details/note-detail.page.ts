import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { NoteManagementService } from '../../../../providers/note-management.service';
import { ActivatedRoute } from "@angular/router";
import { NotePageModel } from "../note/note.page";

@Component({
  selector: "app-note-detail",
  templateUrl: "./note-detail.page.html",
  styleUrls: ["./note-detail.page.scss"],
})
export class NoteDetailPageModel implements OnInit {
  
  public note;
  public folderName;
  
  constructor(
    public modalController: ModalController,
    public toast:ToastController,
    private _formBuilder: FormBuilder,
    private _noteManagementService:NoteManagementService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {}
  
  async closeModal() {
    await this.modalController.dismiss();
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

}
