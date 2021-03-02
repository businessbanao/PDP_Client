import { Component, OnInit } from "@angular/core";
import { ActionSheetController, ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { NoteManagementService } from '../../../../providers/note-management.service';
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


@Component({
  selector: "app-note",
  templateUrl: "./note.page.html",
  styleUrls: ["./note.page.scss"],
})
export class NotePageModel implements OnInit {
  
  public baseUrl: String = environment.baseUrl + "/";
  noteForm: FormGroup;
  public isEditMode: boolean = false;
  public data:any;
  public responseStr: string;
  public filder_list:any;

  constructor(
    public modalController: ModalController,
    public toast:ToastController,
    private _formBuilder: FormBuilder,
    private _noteManagementService:NoteManagementService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private camera: Camera,
    private transfer: FileTransfer,
    private actionSheetController: ActionSheetController
  ) {}


  images = [];
  public myphoto: any;

  

  ngOnInit() {
    this.initNoteForm();
    if(this.data){
      this.noteForm.patchValue(this.data);
      this.noteForm.get('id').setValue(this.data._id);
      this.noteForm.get('date').setValue(this.data.date.slice(0,10));
    }

  }
  

  

  

  updateNote(payload) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    let id = this.noteForm.get("id").value;
    formData["date"] = this.dateFormater(formData.date); 
    this._noteManagementService.updateNote(id, formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      let toast = await this.toast.create({
        message:"Updated Successfully",
        color:'success',
        duration:2000
      })
      toast.present();
      this.noteForm.reset();
      this.closeModal();
    });
    this.isEditMode = false;
  }

  initNoteForm() {
    this.noteForm = this._formBuilder.group({
      title: new FormControl(),
      userId: new FormControl(localStorage.getItem('adminId')),
      content: new FormControl(),
      images: new FormControl(),
      folder_id: new FormControl(), 
      date: new FormControl(), 
      id: new FormControl(""),
    });
  }

  public url;

  createNote(payload: FormGroup) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    formData["userId"] = localStorage.getItem("adminId") || "601870f796b9f2834f045d1a"
    formData["date"] = this.dateFormater(formData.date); 
    console.log("create payload",formData);
    this._noteManagementService.createNote(formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      let toast = await this.toast.create({
        message:"Note created Successfully",
        color:'success',
        duration:2000
      })
      toast.present();
      this.noteForm.reset();
      this.closeModal();
    });
  }

  dateFormater(inputDate) {
    let tempDate = new Date(inputDate);
    let date = tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate();
    let month = (tempDate.getMonth() + 1) ? "0" + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1;
    let year = tempDate.getFullYear();
    return isNaN(tempDate.getTime()) ? "" : month + '-' + date + '-' + year; 
  }

  removeImage(i) {
    // this._editData.imageVarients.splice(i, 1);
  }

  removeUploadImage(i) {
    this.images.splice(i, 1);
  }

  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }

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
        this.myphoto = "data:image/jpeg;base64," + imageData;
        this.uploadImage();
      },
      (err) => {
        console.log("err: ", err);
      }
    );
  }

  uploadImage() {
    const fileTransfer: FileTransferObject = this.transfer.create();
    var random = Math.floor(Math.random() * 100);
    let options: FileUploadOptions = {
      fileKey: "photo",
      fileName: "myImage_" + random + ".jpg",
      chunkedMode: false,
      httpMethod: "post",
      mimeType: "image/jpeg",
      headers: {
        __authorization_x_token: localStorage.getItem("AuthToken") || "",
      },
    };

    let result;

    console.log("this.baseUrl",this.baseUrl)

    fileTransfer
      .upload(
        this.myphoto,
        `${this.baseUrl}api/v1/Admin/saveAllImages`,
        options
      )
      .then(
        async (data) => {
          result = data;
          console.log(result,"success")
          let _data = JSON.parse(result.response);
          console.log(data);
          this.url = _data.response.s3Url
          
          console.log(this.url,"url")
          this.noteForm.get('images').setValue(this.url);
          alert("data "+JSON.stringify(result)+  JSON.parse(result.response).object)

          console.log(this.images,"this.images");
        },
        (err) => {
          console.log(err);
          alert("Error" + err + JSON.stringify(err));
          // loader.dismiss();
        }
      );
  }

}


