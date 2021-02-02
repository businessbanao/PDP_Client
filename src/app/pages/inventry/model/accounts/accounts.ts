import { Component, OnInit, Input } from "@angular/core";
import {
  ModalController,
  NavParams,
  ActionSheetController,
  AlertController,
} from "@ionic/angular";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { ShopService } from "../../../../providers/shop.services";
import { ToastController } from "@ionic/angular";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { environment } from "../../../../../environments/environment";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";

@Component({
  selector: "modal-accounts",
  styleUrls: ["accounts.scss"],
  templateUrl: "./accounts.html",
})
export class AccountPage implements OnInit {
  @Input() editData: any;
  public _editData: any;
  public selectedStore: any = "";
  public Department: any = [];
  public baseUrl: String = environment.baseUrl + "/";
  public searchproductList: any = [];
  ngOnInit(): void {
    this.getDepartment();
    if (this.editData) {
      this.getProductsofCategory();
      // this.addCategoryForm.patchValue(this.editData);
    }

    this._editData = this.editData || {};
  }



  getDepartment() {
    this._shopService.getDepartments('').subscribe((data: any) => {
        this.Department = data.response;
        console.log(data, "--------------------------", this.Department)
    });
  }


  addAccountForm = new FormGroup({
    departmentName: new FormControl(""),
    description: new FormControl(""),
    type: new FormControl(),
    operator: new FormControl(""),
  });



  constructor(
    private modalController: ModalController,
    private _shopService: ShopService,
    private toastController: ToastController,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    public alertController: AlertController
  ) {}

  submit($event) {
    console.log($event);

    if (this.editData) {
      this.edit($event);
    } else {
      this.create($event);
    }
  }

  async deleteProductConfirm(id) {

    this._shopService
    .removeDepartment(id)
    .subscribe(async (data: any) => {
      console.log(data);
      if (data) {
        this.getDepartment();
        const toast = await this.toastController.create({
          message: "Account Deleted Successfully",
          duration: 3000,
          color: "secondary",
          position: "bottom",
          animated: true,
        });
        toast.present();
      }
    });

  }

  DeleteProductFromShop(productId) {
    this._shopService
      .removeProductFromCategory(productId, this._editData._id)
      .subscribe(async (data: any) => {
        console.log(data);
        if (data) {
          this.getProductsofCategory();
          const toast = await this.toastController.create({
            message: "Product unassigned Successfully",
            duration: 3000,
            color: "secondary",
            position: "bottom",
            animated: true,
          });
          toast.present();
        }
      });
  }

  public productList: any = [];
  getProductsofCategory() {
    this._shopService
      .getCategoryProducts(this.editData._id)
      .subscribe(async (data: any) => {
        console.log("data", data);
        this.productList = data;
      });
  }

  create($event) {
    console.log($event, this.images);
    let payload = Object.assign({}, $event.value);
    payload.ownerId = localStorage.getItem("adminId");
    console.log(payload, "payload");
    this._shopService
      .saveDepartment(payload)
      .subscribe(async (data: any) => {
        const toast = await this.toastController.create({
          message: "Account Saved Successfully",
          duration: 3000,
          color: "success",
          position: "top",
          animated: true,
        });
        toast.present();
        this.getDepartment();
        this.addAccountForm.reset();
      });
  }

  edit($event) {
    let payload = Object.assign({}, $event.value);
    console.log(payload, "payload");
    payload.ownerId = localStorage.getItem("adminId");
    payload.logo = this.images.length > 0 ? this.images[0] : payload.logo;
    // payload.categoryId = this.editData._id
    this._shopService
      .editSubCategory(this.editData._id, payload)
      .subscribe(async (data: any) => {
        console.log("data", data);
        const toast = await this.toastController.create({
          message: "Sub Category Updated Successfully",
          duration: 3000,
          color: "secondary",
          position: "bottom",
          animated: true,
        });
        toast.present();
        this.closeModal();
      });
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

  public myphoto;
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
      headers: {},
    };

    let result;
    fileTransfer
      .upload(
        this.myphoto,
        `${this.baseUrl}api/v1/Admin/saveAllImages`,
        options
      )
      .then(
        (data) => {
          result = data;
          // alert("data "+JSON.stringify(result)+  JSON.parse(result.response).object)
          this.images[0] = JSON.parse(result.response).object.s3Url;
        },
        (err) => {
          console.log(err);
          alert("Error" + err + JSON.stringify(err));
          // loader.dismiss();
        }
      );
  }

  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }

  onChangeType(event){

  }

  onOperatorChange(event){

  }
}
