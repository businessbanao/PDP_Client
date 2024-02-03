import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from "@ionic/angular";
import { AddEditCredentialPageModel } from "./model/credential/credential.page";
import { PopoverController, ToastController } from "@ionic/angular";
import { CredentialManagementService } from "../../providers/credential-management.service";

@Component({
  selector: "app-credential",
  templateUrl: "./credential-management.page.html",
  styleUrls: ["./credential-management.page.scss"],
  providers: [DatePipe],
})
export class CredentialManagementPage implements OnInit {
  public credentials: [];

  constructor(
    private _credentialManagementService: CredentialManagementService,
    private datePipe: DatePipe,
    public alertController: AlertController,

    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.getCredentialItems();
  }

  async getCredentialItems() {
    this._credentialManagementService.getCredentials().subscribe((resp) => {
      this.credentials = resp.object.response;
    });
  }

  async deleteCredential(credentialId) {
    this._credentialManagementService
      .deleteCredential(credentialId)
      .subscribe((resp) => {
        console.log(resp.object.response);
        this.getCredentialItems();
      });
  }
  async showCredentials(data) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-alert',
      header: "password",
      message:data,
      buttons:[
        {
          text:"copy",
          handler: () => {
            navigator.clipboard.writeText(data);
          }
        }
      ]
    })
    alert.present();
  }
  


  async openSaltInputModel(id) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Enter salt",
      inputs: [
        {
          id:"maxLength10",
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
            this._credentialManagementService.decryptCredential(id,data).subscribe( async resp=>{
              console.log(resp);
              if(resp.error){
               let toast = await this.toastController.create({
                message:"wrong pin",
                color:'secondary',
                duration:2000
              });
              toast.present();
              }else{

                this.showCredentials(resp.object.response.password);
              }

            });
          },
        },
      ],
    });

    await alert.present().then((result)=>{
      document.getElementById('maxLength10').setAttribute('maxlength','4');
    });
  }

  async presentAlertConfirm(id) {
    let self = this;
    const alert = await this.alertController.create({
      header: "Delete credential",
      message: "Are you sure you want to delete?",
      buttons: [
        {
          text: "Cancel",

          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Okay",
          handler: () => {
            self.deleteCredential(id);
          },
        },
      ],
    });

    await alert.present();
  }

  async presentActionSheet(data) {
    const actionSheet = await this.actionSheetController.create({
      header: "",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: `Edit Credential`,
          role: "destructive",
          icon: "key-outline",
          handler: () => {

            this.openAddEditModal(data, true);
          },
        },
        {
          text: "Delete Credential",
          role: "destructive",
          icon: "key-outline",
          handler: () => {
            this.presentAlertConfirm(data._id);
            this.getCredentialItems();
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

  async openAddEditModal(data, isEditMode = false) {
    const modal = await this.modalController.create({
      component: AddEditCredentialPageModel,
      componentProps: {
        data: data,
        isEditMode: isEditMode,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getCredentialItems();
    });
    return await modal.present();
  }
}
