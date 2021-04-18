import { Component, OnInit } from "@angular/core";
import { ActionSheetController, ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
  Camera,
  CameraOptions,
  PictureSourceType,
} from "@ionic-native/camera/ngx";
import { environment } from "../../../../../environments/environment";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { DocManagementService } from "../../../../providers/doc-management.service";
import { DeveloperManagementService } from "../../../../providers/developer-management.service";


@Component({
  selector: "app-add-edit-module",
  templateUrl: "./add-edit-module.page.html",
  styleUrls: ["./add-edit-module.page.scss"],
})
export class AddEditModulePageModel implements OnInit {
  
  public baseUrl: String = environment.baseUrl + "/";
  moduleForm: FormGroup;
  public isEditMode: boolean = false;
  public data:any;
  public moduleType;
  public responseStr: string;
  public filder_list:any;
  public ParentModuleList=[];

  constructor(
    public modalController: ModalController,
    public toast:ToastController,
    private _formBuilder: FormBuilder,
    private _developerManagementService:DeveloperManagementService,
     
  ) {}

  images = [];
  public myphoto: any;
  

  ngOnInit() {
    this.initmoduleForm();
    this.getParentModulesList();
    if(this.data){
      this.moduleForm.patchValue(this.data);
      this.moduleForm.get('parentId').setValue(this.data.parentId);
      this.moduleForm.get('id').setValue(this.data._id);
    }

  }
 

  initmoduleForm() {
    this.moduleForm = this._formBuilder.group({
      id:[''],
      name: new FormControl('',[]),
      parentId: new FormControl(null,[]),
    });
  }

  createModule(payload: FormGroup) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    this._developerManagementService.createModule(formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      let toast = await this.toast.create({
        message:"Module created Successfully",
        color:'success',
        duration:2000
      })
      toast.present();
      this.moduleForm.reset();
      this.closeModal();
    });
  }

  

  updateModule(payload: FormGroup,id){
    let formData = JSON.parse(JSON.stringify(payload.value));
    this._developerManagementService.updateModule(id,formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      let toast = await this.toast.create({
        message:"Module Updated Successfully",
        color:'success',
        duration:2000
      })
      toast.present();
      this.moduleForm.reset();
      this.closeModal();
    });
  }

  getParentModulesList(){
    this._developerManagementService.getParentModuleList().subscribe((resp) => {
      this.ParentModuleList = resp.response;
      console.log(this.ParentModuleList);
    });
  }
 
  
  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }
 
}