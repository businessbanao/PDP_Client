import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { DocManagementService } from '../../../../providers/doc-management.service';
import { ActivatedRoute } from "@angular/router";
import { DocDetailPageModel } from '../doc-details/doc-detail.page';
import { AddEditDocPageModel } from "../doc/add-edit-doc.page";

@Component({
  selector: "app-doc-list",
  templateUrl: "./doc-list.page.html",
  styleUrls: ["./doc-list.page.scss"],
})
export class DocListPageModel implements OnInit {
  
  public folderId;
  public folderName;
  public docList:any = [];
  
  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    private _formBuilder: FormBuilder,
    private _docManagementService:DocManagementService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.getFolderDocs(this.folderId);
  }
  
  async closeModal() {
    await this.modalController.dismiss();
  }

  // open add edit docs model
  async openAddEditDocModal() {
    const modal = await this.modalController.create({
      component: AddEditDocPageModel
    });
    modal.onDidDismiss().then((dataReturned) => {this.getFolderDocs(this.folderId);});
    return await modal.present();
  }

  // get docs of provided folder_id
  getFolderDocs(folder_id: String) {
    this._docManagementService.getFolderDocs(folder_id).subscribe(async (resp) => {
      this.docList = resp.response;
    });
  }

  // delete doc with provided doc_id
  deleteDoc(docId){
    this._docManagementService.deleteDoc(docId).subscribe(async resp => {
      if(!resp.error){
        this.getFolderDocs(this.folderId);
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

  // open edit doc model
  async editDoc(data: any) {
    const modal = await this.modalController.create({
      component: AddEditDocPageModel,
      componentProps:{
        data : data
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getFolderDocs(this.folderId);
    });
    return await modal.present();
  }

  // open doc detail model
  async openDocDetailModal(data:any) {
    const modal = await this.modalController.create({
      component: DocDetailPageModel,
      componentProps:{
        doc : data,
        folderName : this.folderName
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getFolderDocs(this.folderId);
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
