import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { NoteManagementService } from '../../../../providers/note-management.service';
import { ActivatedRoute } from "@angular/router";
import { AddEditDocPageModel } from "../doc/add-edit-doc.page";

@Component({
  selector: "app-doc-detail",
  templateUrl: "./doc-detail.page.html",
  styleUrls: ["./doc-detail.page.scss"],
})
export class DocDetailPageModel implements OnInit {
  
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
      component: AddEditDocPageModel,
      componentProps:{
        data : data
      }
    });
    modal.onDidDismiss().then((dataReturned) => {});
    return await modal.present();
  }

}
