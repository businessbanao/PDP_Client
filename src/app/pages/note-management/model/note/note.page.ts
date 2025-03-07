import { Component, OnInit } from "@angular/core";
import { ActionSheetController, ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm, Validators, FormArray } from "@angular/forms";
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
  public folder_list:any;

  images = [];
  public myphoto: any;
  public url;
  noteContent;
  public folderList=[]
  
  public folderId;

  
  constructor(
    public modalController: ModalController,
    public toastController:ToastController,
    private _formBuilder: FormBuilder,
    private _noteManagementService:NoteManagementService,
    private activatedRoute: ActivatedRoute,
    private camera: Camera,
    private transfer: FileTransfer,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.getFolders();
    this.initNoteForm();
    if(this.data){
      try {
        
        this.noteForm.patchValue(this.data);
      } catch (error) {
        
      }
      this.noteForm.get('id').setValue(this.data._id);

      
      // this.noteForm.get('date').setValue(this.data.date.slice(0,10));
      // this.noteContent = this.data.content;
      // this.noteForm.get('content').setValue(this.data.content)
    }

  }

  getFolders(){
    this._noteManagementService.getFolders().subscribe((resp) => {
      this.folderList = resp.response;
    });
  }
  
  updateNote(payload) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    let id = this.noteForm.get("id").value;
    formData["userId"] = localStorage.getItem("adminId");
    formData["type"] = 'NOTE';
    formData['links'] = this.links.value;
    if(formData['tags']){
      formData['tags'] = formData['tags'].map((list)=>{
        return list.value;
      }) 
    }else{
      formData['tags'] = [];
    }
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
        message: 'created folder successfully',
        duration: 2000,
        position: "bottom",
        color: "secondary",
        animated: true,
      });
      toast.present();
      this.noteForm.reset();
      this.closeModal();
    });
    this.isEditMode = false;
  }

  public links= new FormArray([]);

  initNoteForm() {
    this.noteForm = this._formBuilder.group({
      name: new FormControl('', Validators.compose([Validators.required])),
      owner: new FormControl(localStorage.getItem('adminId')),
      content: new FormControl(),
      imageUrl: new FormControl(),
      parentId: new FormControl(this.folderId, Validators.compose([Validators.required])), 
      tags:new FormControl(),
      id: new FormControl(""),
    });
  }

  addLink() {
    this.links.push(new FormControl(''));
  }

  removeLink(index: number) {
    this.links.removeAt(index);
  }

  addNote(payload: FormGroup) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    formData["userId"] = localStorage.getItem("adminId");
    formData["type"] = 'NOTE';
    formData['links'] = this.links.value;
    if(formData['tags']){
      formData['tags'] = formData['tags'].map((list)=>{
        return list.value;
      }) 
    }else{
      formData['tags'] = [];
    }
    this._noteManagementService.createNote(formData).subscribe(async (resp) => {
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
        message: 'created note successfully',
        duration: 2000,
        position: "bottom",
        color: "secondary",
        animated: true,
      });
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


