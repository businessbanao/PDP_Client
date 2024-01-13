import { Component, OnInit } from "@angular/core";
import { ActionSheetController, AlertController, ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm, Validators, FormArray } from "@angular/forms";
import { NoteManagementService } from '../../../../providers/note-management.service';
import { ActivatedRoute } from "@angular/router";
import {
  Camera,
} from "@ionic-native/camera/ngx";
import { environment } from "../../../../../environments/environment";
import {
  FileTransfer,
} from "@ionic-native/file-transfer/ngx";
import { CredentialManagementService } from "../../../../providers/credential-management.service";


@Component({
  selector: "app-credential",
  templateUrl: "./credential.page.html",
  styleUrls: ["./credential.page.scss"],
})

export class AddEditCredentialPageModel implements OnInit {
  
  public baseUrl: String = environment.baseUrl + "/";
  credentialForm: FormGroup;
  public isEditMode: boolean = false;
  public data:any;
  public responseStr: string;

 
  
  constructor(
    public modalController: ModalController,
    public toast:ToastController,
    private _formBuilder: FormBuilder,
    private _credentialManagementService:CredentialManagementService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private camera: Camera,
    private transfer: FileTransfer,
    private actionSheetController: ActionSheetController,
    public alertController: AlertController,
  ) {}

  ngOnInit() {
    this.initCredentialForm();
    if(this.data){
      this.isEditMode=true;
      this.credentialForm.patchValue(this.data);
      this.credentialForm.get('salt').setValue('');
      this.credentialForm.get('id').setValue(this.data._id);
      this.openSaltAddEditModel(this.data._id);
     
    }

  }
  

  async openSaltAddEditModel(id) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Enter salt",
      inputs: [
        {
          name: "salt",
          type: "text",
          placeholder: "Enter salt",
          value: "",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: "Ok",
          handler: (data) => {
            console.log(id,data);
            this.credentialForm.get('salt').setValue(data.salt);
            this._credentialManagementService.decryptCredential(id,data).subscribe(resp=>{
              console.log(resp);
              this.credentialForm.get('password').setValue(resp.object.response.password)

            });
          },
        },
      ],
    });

    await alert.present();
  }

  
  updateCredential(payload) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    let id = this.credentialForm.get("id").value;
    this._credentialManagementService.updateCredential(id, formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      let toast = await this.toast.create({
        message:"Updated Successfully",
        color:'success',
        duration:2000
      })
      toast.present();
      this.credentialForm.reset();
      this.closeModal();
    });
    this.isEditMode = false;
  }


  initCredentialForm() {
    this.credentialForm = this._formBuilder.group({
      id: new FormControl(),
      appName: new FormControl('', Validators.compose([Validators.required])),
      password: new FormControl('', Validators.compose([Validators.required])),
      source:new FormControl('', Validators.compose([Validators.required])),
      salt:new FormControl('', Validators.compose([Validators.required])),
    });
  }

 

  

 

  addCredential(payload: FormGroup) {
    let formData = JSON.parse(JSON.stringify(payload.value));
   
    console.log(formData);
    this._credentialManagementService.addCredential(formData).subscribe(async (resp)=>{
        this.responseStr = resp.response;
      let toast = await this.toast.create({
        message:"credential created Successfully",
        color:'success',
        duration:2000
      })
      toast.present();
      this.credentialForm.reset();
      this.closeModal();
    });
  }
  async closeModal() {
    await this.modalController.dismiss();
  }
 
}


