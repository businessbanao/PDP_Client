import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import {
  ModalController,
  NavParams,
  ActionSheetController,
  Platform,
  LoadingController,
} from "@ionic/angular";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { ShopService } from "../../../providers/shop.services";
import { ToastController } from "@ionic/angular";
import {
  Camera,
  CameraOptions,
  PictureSourceType,
} from "@ionic-native/camera/ngx";
import { environment } from "../../../../environments/environment";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";

@Component({
  selector: "modal-addProduct",
  templateUrl: "./addProduct.html",
  styleUrls: ["./addproduct.scss"],
})
export class AddProductPage {
  public baseUrl: String = environment.baseUrl + "/";
  public _editData;
  public backUrl = "/tab/product";
  public btn = "arrow-back-outline";
  public SubCategoryList: any = [];

  @Input() editData: any;

  public searchproductList: any = [];
  ngOnInit(): void {
    this.getSubCategoryList();
    if (this.editData) {
      this.addProductForm.patchValue(this.editData);
      this.backUrl = `tabs/product/product-details/${this.editData._id}`;
    }

    this._editData = this.editData || {};
  }

  getSubCategoryList() {
    this._shopService.listSubCategory().subscribe((data: any) => {
      this.SubCategoryList = data.SubCategoryList;
      console.log(data, "--------------------------", this.SubCategoryList)
    });
  }

  addProductForm = new FormGroup({
    title: new FormControl("", [Validators.required]),
    productName: new FormControl("", [Validators.required]),
    productImage: new FormControl(""),
    imageVarients: new FormControl([]),
    productDescription: new FormControl(""),
    price: new FormControl("", [Validators.required]),
    halfPrice: new FormControl("", [Validators.required]),
    QtrPrice: new FormControl("", [Validators.required]),
    addCustomeFeatures: new FormControl({}),
    category_id:new FormControl(""),
    // halfPrice: new FormControl(""),
    isVeg: new FormControl(true),
  });

  images = [];
  public myphoto: any;

  constructor(
    private modalController: ModalController,
    private _shopService: ShopService,
    private toastController: ToastController,
    private camera: Camera,
    private transfer: FileTransfer,
    private actionSheetController: ActionSheetController
  ) {}

  async submit($event) {
    console.log($event);
    let payload = Object.assign({}, $event.value);

    if (this.addProductForm.invalid) {
      let toast = await this.toastController.create({
        message: "Invalid Data",
        duration: 3000,
        color: "secondary",
        position: "bottom",
        animated: true,
      });
      toast.present();
      return;
    }

    if (payload.title.length == 0) {
      let toast = await this.toastController.create({
        message: "Invalid Product Title",
        duration: 3000,
        color: "secondary",
        position: "bottom",
        animated: true,
      });
      toast.present();
      return;
    }

    // if (payload.halfPrice >= payload.price) {
    //   let toast = await this.toastController.create({
    //     message: "Half Price Can not be greater than Full Price ",
    //      duration: 3000,
    //             color:'secondary',
    //     position: "bottom",
    //     animated: true,
    //   });
    //   toast.present();
    //   return;
    // }

    if (this.editData) {
      this.edit($event);
    } else {
      this.create($event);
    }
  }

  async create($event) {
    console.log($event);
    let payload = Object.assign({}, $event.value);
    payload.imageVarients = this.images;
    payload.productImage = this.images.length > 0 ? this.images[0] : "";

    // if (this.images.length == 0) {
    //   let toast = await this.toastController.create({
    //     message: "Please Upload Product Images",
    //      duration: 3000,
    //             color:'warning',
    //     position: "bottom",
    //     animated: true,
    //   });
    //   toast.present();
    //   return;
    // }

    console.log(payload, "payload");
    this._shopService.saveProduct(payload).subscribe(async (data: any) => {
      console.log("data--------created", data);
      if(data){
        this.assignProduct(data.Details._id);
      const toast = await this.toastController.create({
        message: "Product Saved Successfully",
        duration: 3000,
        color: "success",
        position: "bottom",
        animated: true,
      });
      toast.present();
      this.closeModal();
    }
    });
  }

  async edit($event) {
    let payload = Object.assign({}, $event.value);
    payload.imageVarients = this.images.concat(this._editData.imageVarients);
    payload.productImage = this.images.length > 0 ? this.images[0] : "";
    console.log(payload, "payload");
    payload.productId = this.editData._id;

    this.assignProduct(this.editData._id);

    this._shopService
      .editProductDetails(payload)
      .subscribe(async (data: any) => {
        console.log("data", data);
        const toast = await this.toastController.create({
          message: "Product Updated Successfully",
          duration: 3000,
          color: "success",
          position: "bottom",
          animated: true,
        });
        toast.present();
        this.closeModal();
      });
  }

  // [1,2,3]
  removeImage(i) {
    this._editData.imageVarients.splice(i, 1);
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

    fileTransfer
      .upload(
        this.myphoto,
        `${this.baseUrl}api/v1/Admin/saveAllImages`,
        options
      )
      .then(
        async (data) => {
          result = data;
          // alert("data "+JSON.stringify(result)+  JSON.parse(result.response).object)

          if (this._editData) {
            console.log(this.images.length)
            console.log(this._editData.imageVarients.length )
            console.log(this._editData.imageVarients.length + this.images.length)

            if (this._editData.imageVarients.length + this.images.length < 5) {
              this.images.push(JSON.parse(result.response).object.s3Url);
            } else {
              const toast = await this.toastController.create({
                message: "Only 5 Images is allowed",
                duration: 3000,
                color: "warning",
                position: "bottom",
                animated: true,
              });
              toast.present();
            }
          } else {
            if (this.images.length < 5) {
              this.images.push(JSON.parse(result.response).object.s3Url);
            } else {
              const toast = await this.toastController.create({
                message: "Only 5 Images is allowed",
                duration: 3000,
                color: "warning",
                position: "bottom",
                animated: true,
              });
              toast.present();
            }
          }
        },
        (err) => {
          console.log(err);
          alert("Error" + err + JSON.stringify(err));
          // loader.dismiss();
        }
      );
  }

  async assignProduct(productId) {
    this._shopService
      .assignProductToCategory({
        productId: productId,
        subcategoryIds: this.addProductForm.get('category_id').value,
      })
      .subscribe(async (data: any) => {
        console.log(data, "data");

      });
  }
}
