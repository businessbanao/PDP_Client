import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { NoteManagementService } from '../../../../providers/note-management.service';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-add-edit-folder",
  templateUrl: "./add-edit-folder.page.html",
  styleUrls: ["./add-edit-folder.page.scss"],
})
export class AddEditFolderPageModel implements OnInit {
  
  folderForm: FormGroup;
  public isEditMode: boolean = false;
  public data:any;
  public responseStr: string;
  
  constructor(
    public modalController: ModalController,
    public toast:ToastController,
    private _formBuilder: FormBuilder,
    private _noteManagementService:NoteManagementService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.initFolderForm();
    if(undefined != this.data){
      this.folderForm.patchValue(this.data);
      this.folderForm.get('id').setValue(this.data._id);
    }
  }
  
  async closeModal() {
    await this.modalController.dismiss();
  }

  initFolderForm() {
    this.folderForm = this._formBuilder.group({
      name: new FormControl(),
      description: new FormControl(),
      type:new FormControl("NOTES"),
      id: new FormControl(""),
    });
  }

  updateFolder(payload) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    let id = this.folderForm.get("id").value;
    this._noteManagementService.updateFolder(id, formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      let toast = await this.toast.create({
        message:"Updated Successfully",
        color:'success',
        duration:2000
      })
      toast.present();
      this.folderForm.reset();
      this.closeModal();
    });
    this.isEditMode = false;
  }

  createFolder(payload: FormGroup) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    formData["type"] = "NOTES";
    this._noteManagementService.createFolder(formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      let toast = await this.toast.create({
        message:resp.message,
        color:'success',
        duration:2000
      })
      toast.present();
      this.folderForm.reset();
      this.closeModal();
    });
  }
}
