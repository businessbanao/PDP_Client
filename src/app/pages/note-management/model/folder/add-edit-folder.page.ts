import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm, Validators } from "@angular/forms";
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
  public folderId: string | null;
  public responseStr: string;
  public data:any;

  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    private _formBuilder: FormBuilder,
    private _noteManagementService: NoteManagementService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.initFolderForm();
    if (undefined != this.data) {
      this.folderForm.patchValue(this.data);
      // this.folderForm.get('id').setValue(this.data._id);
    }
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  initFolderForm() {
    this.folderForm = this._formBuilder.group({
      name: new FormControl('', Validators.compose([Validators.required])),
      description: new FormControl(),
      type: new FormControl("folder"),
      owner: new FormControl(""),
      parent: new FormControl(null)
    });
  }

  updateFolder(payload) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    let id = this.data._id;
    this._noteManagementService.updateNote(id, formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      if(resp.error){
        const toast = await this.toastController.create({
          message: 'some error occurred',
          duration: 2000,
          position: "bottom",
          color: "secondary",
          animated: true,
        });
        toast.present();
        return;
      }
      const toast = await this.toastController.create({
        message: 'updated successfully',
        duration: 2000,
        position: "bottom",
        color: "secondary",
        animated: true,
      });
      toast.present();
      this.folderForm.reset();
      this.closeModal();
    });
    this.isEditMode = false;
  }

  createFolder(payload: FormGroup) {

    let formData = JSON.parse(JSON.stringify(payload.value));
    formData["type"] = "FOLDER";
    formData['owner'] = localStorage.getItem('adminId');
    
    if (this.folderId) {
      formData['parentId'] = this.folderId;
    }

    this._noteManagementService.createFolder(formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      if(resp.error){
        const toast = await this.toastController.create({
          message: 'some error occurred',
          duration: 2000,
          position: "bottom",
          color: "secondary",
          animated: true,
        });
        toast.present();
        return;
      }
      const toast = await this.toastController.create({
        message: 'created folder successfully',
        duration: 2000,
        position: "bottom",
        color: "secondary",
        animated: true,
      });
      toast.present();
      this.folderForm.reset();
      this.closeModal();
    });
  }
}
