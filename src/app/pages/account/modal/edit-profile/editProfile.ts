import { Component, OnInit, Input } from "@angular/core";
import {
  ModalController,
  NavParams,
  ActionSheetController,
} from "@ionic/angular";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { ToastController } from "@ionic/angular";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { environment } from "../../../../../environments/environment";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { UserServices } from "../../../../providers/user.services";

@Component({
  selector: "modal-editProfile",
  templateUrl: "./editProfile.html",
})
export class EditProfilePage {

  @Input() userData: any;
  editProfileForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private camera: Camera,
    private _UserData:UserServices,
    public actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
  ) {}

  public baseUrl: any = environment.baseUrl + "/";

  public searchproductList: any = [];
  ngOnInit() {
    this.editProfileForm = new FormGroup({
      fullName: new FormControl(""),
      city: new FormControl(""),
      mobile: new FormControl(""),
      email: new FormControl(""),
      dob:  new FormControl(),
      gender: new FormControl("Male"),
      address:new FormControl("")
    });

    console.log(this.userData);
    this.editProfileForm.get('dob').setValue('12/12/2020')
    this.editProfileForm.patchValue(this.userData);
  }



  submit($event) {
    console.log($event);
    let payload = Object.assign({}, $event.value);
    console.log(payload, "payload");
    payload.Image = this.images.length > 0 ? this.images[0] :  this.userData.Image;
    console.log(payload, "payload");
    this._UserData
      .updateAdminProfile(payload,this.userData._id)
      .subscribe(async (data: any) => {
        console.log("data", data);
        const toast = await this.toastController.create({
          message: "You Successfully Updated you Profile",
           duration: 3000,
          color:'success',
          position: "bottom",
          animated: true,
        });
        toast.present();
        this.closeModal();
      });
  }

  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }

  public images: any = [];


  async selectImagefromMobille() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [
        {
          text: "Load from Library",
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: "Use Camera",
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
  }

  public myphoto
  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    };

    this.camera.getPicture(options).then(
      (imageData) => {
        this.myphoto = 'data:image/jpeg;base64,' + imageData;
         this.uploadImage()
            },
          (err) => {
            console.log("err: ", err);
          }
        );

  }

  uploadImage(){
    const fileTransfer: FileTransferObject = this.transfer.create();
    var random = Math.floor(Math.random() * 100);
    let options: FileUploadOptions = {
      fileKey: 'photo',
      fileName: "myImage_" + random + ".jpg",
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: "image/jpeg",
      headers: {
        __authorization_x_token: localStorage.getItem("AuthToken") || ''
      }
    }

    let result ;
    fileTransfer.upload(this.myphoto, `${this.baseUrl}api/v1/Admin/saveAllImages`, options)
      .then((data) => {
        result = data
        // alert("data "+JSON.stringify(result)+  JSON.parse(result.response).object)
          this.images[0]= JSON.parse(result.response).object.s3Url
      }, (err) => {
        console.log(err);
        alert("Error"+err + JSON.stringify(err));
        // loader.dismiss();
      });
   }

}
