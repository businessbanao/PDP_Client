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
  selector: "modal-addSubCategory",
  styleUrls: ["addSubCategory.scss"],
  templateUrl: "./addSubCategory.html",
})
export class AddSubCategoryPage implements OnInit {
  @Input() editData: any;
  public _editData: any;
  public selectedStore: any = "";
  public categoryList: any = [];
  public baseUrl: String = environment.baseUrl + "/";
  public searchproductList: any = [];
  ngOnInit(): void {
    this.getCategoryList();
    if (this.editData) {
      this.getProductsofCategory();
      this.addCategoryForm.patchValue(this.editData);
    }

    this._editData = this.editData || {};
  }

  selectImage(value) {
    // alert("called")
    this.images = [];
    this.images = [this.selectIcon(value)];
  }

  public nonVegIcon = "../../../../../assets/img/category_img/non-veg.webp";
  public vegIcon = "../../../../../assets/img/category_img/veg.svg";
  public drinkIcon = "../../../../../assets/img/category_img/drink.svg";
  public lunchIcon = "../../../../../assets/img/category_img/thali.svg";
  public southIcon = "../../../../../assets/img/category_img/south.svg";
  public chinesIcon = "../../../../../assets/img/category_img/chinese.svg";
  public burgerIcon = "../../../../../assets/img/category_img/burger.svg";
  public fastfoodIcon = "../../../../../assets/img/category_img/fast-food.svg";
  public IceCreameIcon = "../../../../../assets/img/category_img/ice-cream.svg";
  public itellianIcon = "../../../../../assets/img/category_img/itellian.svg";
  public parathaIcon = "../../../../../assets/img/category_img/paratha.svg";
  public pizzaIcon = "../../../../../assets/img/category_img/pizza.svg";
  public soupIcon = "../../../../../assets/img/category_img/soup.svg";
  public sweetIcon = "../../../../../assets/img/category_img/sweet.svg";
  public thaliIcon = "../../../../../assets/img/category_img/thali.svg";

  selectIcon(icon) {
    switch (icon) {
      case "NON_VEG":
        return this.nonVegIcon;
      case "VEG":
        return this.vegIcon;
      case "DRINK":
        return this.drinkIcon;
      case "LUNCH":
        return this.lunchIcon;
      case "SOUTH":
        return this.southIcon;
      case "CHINES":
        return this.chinesIcon;
      case "BURGER":
        return this.burgerIcon;
      case "FASTFOOD":
        return this.fastfoodIcon;
      case "ICECREAME":
        return this.IceCreameIcon;
      case "ITELLIAN":
        return this.itellianIcon;
      case "PARATHA":
        return this.parathaIcon;
      case "PIZZA":
        return this.pizzaIcon;
      case "SWEET":
        return this.sweetIcon;
      case "THALI":
        return this.thaliIcon;
      case "SOUP":
        return this.soupIcon;
    }
  }

  getCategoryList() {
    // this._shopService.listCategory().subscribe((data: any) => {
    //     this.categoryList = data.CategoryList;
    //     this.addCategoryForm.get('categoryIds').setValue([this.categoryList[0]._id]);
    //     console.log(data, "--------------------------", this.categoryList)
    // });
  }

  sliderConfig = {
    slidesPerView: 5,
    centeredSlides: false,
  };

  addCategoryForm = new FormGroup({
    subcategoryName: new FormControl(""),
    description: new FormControl(""),
    categoryIds: new FormControl(),
    logo: new FormControl(""),
  });

  customAlertOptions: any = {
    // header: 'Pizza Toppings',
    // subHeader: 'Select your toppings',
    // message: '$1.00 per topping',
    translucent: true,
  };

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
    const alert = await this.alertController.create({
      header: "Delete Product ?",
      message: "Are You Sure, you want to delete this Product ?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Delete",
          handler: () => {
            console.log("deleted Confirmed");
            this.DeleteProductFromShop(id);
          },
        },
      ],
    });

    await alert.present();
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
    if (this.images.length == 0) {
      return;
    }

    if (this.addCategoryForm.get("subcategoryName").value == "") {
      return;
    }

    console.log($event, this.images);
    let payload = Object.assign({}, $event.value);
    payload.ownerId = localStorage.getItem("adminId");
    payload.logo = this.images.length > 0 ? this.images[0] : "";
    console.log(payload, "payload");
    this._shopService
      .createSubCategory(payload)
      .subscribe(async (data: any) => {
        console.log("data", data);
        const toast = await this.toastController.create({
          message: "Category Saved Successfully",
          duration: 3000,
          color: "secondary",
          position: "bottom",
          animated: true,
        });
        toast.present();
        this.closeModal();
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
}
