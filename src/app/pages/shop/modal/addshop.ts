import { Component, Input, ViewChild } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import {  FormGroup, Validators, FormControl } from '@angular/forms';
import { ShopService } from "../../../providers/shop.services";
import { ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { environment } from '../../../../environments/environment';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Component({
    selector: 'modal-addshop',
    templateUrl: './addshop.html',
    styleUrls: ['./addShop.scss'],
})
export class AddShopPage {


    @Input() editData: any;
    @ViewChild('storeName',null) _storeName ;
    @ViewChild('storeAddress1',null) _storeAddress1 ;
    @ViewChild('storeAddress2',null) _storeAddress2 ;
    @ViewChild('nearLandmark',null) _nearLandmark ;
    @ViewChild('city',null) _city ;
    @ViewChild('state',null) _state ;
    @ViewChild('pincode',null) _pincode ;
    @ViewChild('website',null) _website ;
    @ViewChild('email',null) _email ;
    @ViewChild('storeLogo',null) _storeLogo ;
    @ViewChild('shopOwnerName',null) _shopOwnerName ;
    @ViewChild('shopOwnerContact',null) _shopOwnerContact ;

    public images: any = [];
    public _editData
    public backUrl='/tabs/shop';

    public baseUrl: String = environment.baseUrl + '/'


    public addShopForm ={
        storeName:'',
        storeAddress1:'',
        storeAddress2:'',
        nearLandmark:'',
        city:'',
        state:'',
        pincode:'',
        website:'',
        email:'',
        storeLogo:'',
        shopOwnerName:'',
        shopOwnerContact:'',
    }



    constructor(
        private modalController: ModalController,
        private _shopService: ShopService,
        private toastController: ToastController,
        private camera: Camera,
        public actionSheetController: ActionSheetController,
        private transfer: FileTransfer,
    ) {
    }

    setFocus(_element){
      this[_element].setFocus();
    }

    public searchproductList:any=[]
   ngOnInit(): void {

        if (this.editData) {
          this.backUrl = `/tabs/shop/details/${this.editData._id}`
            this.addShopForm = this.editData
        }

        this._editData = this.editData || {}
    }


    submit() {
        let payload = Object.assign({}, this.addShopForm);
        console.log(this.addShopForm, "payload")


        if (!this.addShopForm.storeName) {
            this.playToast('Shop Name is required', 3000, 'danger')
            return false
        }

        if (!this.addShopForm.city) {
          this.playToast('City is required', 3000, 'danger')
          return false
      }

      if (!this.addShopForm.storeAddress1) {
        this.playToast('Address is required', 3000, 'danger')
        return false
    }


        if (!this.addShopForm.pincode || this.addShopForm.pincode.toString().length != 6) {
          this.playToast('Pincode is Invalid', 3000, 'danger')
          return false
      }

        if (payload.website.length > 0) {
            var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
            if (!re.test(payload.website)) {
                this.playToast('Invalid Website', 3000, 'danger')
                return false;
            }
        }

        if (payload.email.length > 0) {
            var emailValidate = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!emailValidate.test(payload.email)) {
                this.playToast('Invalid Email', 3000, 'danger');
                return false;
            }
        }


        if (payload.shopOwnerName == null) {
            this.playToast('Shop Owner Name is Required', 3000, 'danger');
            return
        } else if (payload.shopOwnerName.length == 0) {
            this.playToast('Shop Owner Name is Required', 3000, 'danger');
            return
        }


        if (payload.shopOwnerContact == null) {
            this.playToast('Shop Owner Contact No is Required', 3000, 'danger');
            return
        } else if (payload.shopOwnerContact.length == 0) {
            this.playToast('Shop Owner Contact No is Required', 3000, 'danger');
            return
        } else if (payload.shopOwnerContact.toString().length !== 10) {
            // console.log(payload.shopOwnerContact.toString().length , payload.shopOwnerContact.toString().length, payload.shopOwnerContact.toString().length !== 10)
            this.playToast('Shop Owner Contact No is Invalid', 3000, 'danger');
            return
        }



        if (this.editData) {
            this.edit(payload)
        } else {
            this.create(payload)
        }
    }

    async create(payload) {
        // let payload = Object.assign({}, $event.value);
        console.log(payload, "payload")
        payload.storeLogo = (this.images.length > 0) ? this.images[0] : '';

        this._shopService.createStore(payload).subscribe(async (data: any) => {
            console.log("data", data);
            const toast = await this.toastController.create({
                message: 'Store Created Successfully',
                 duration: 3000,
                color:'secondary',
                position: 'bottom',
                animated: true,
            });
            toast.present();
            this.closeModal()
        });
    }

    async playToast(msg, ms, color) {
        let toast = await this.toastController.create({
            message: msg || 'Invalid Data',
            duration: ms || 3000,
            position: 'bottom',
            color: color || 'danger',
            animated: true,

        })
        toast.present();
        return
    }

    async  edit($event) {
        let payload = Object.assign({}, $event);
        payload.storeLogo = (this.images.length > 0) ? this.images[0] : payload.storeLogo;
        console.log(payload, "payload");

        // if (this.addShopForm.invalid) {
        //     let toast = await this.toastController.create({
        //         message: 'Invalid Data',
        //          duration: 3000,
        //         color:'secondary',
        //         position: 'bottom',
        //         animated: true,

        //     })
        //     toast.present();
        //     return
        // }

        // var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
        // if (!re.test(payload.website)) {
        //     let toast = await this.toastController.create({
        //         message: 'Invalid Website',
        //          duration: 3000,
                // color:'secondary',,
        //         position: 'bottom',
        //         color: 'danger',
        //         animated: true,

        //     })
        //     toast.present();
        //     return false;
        // }

        // var emailValidate = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        // if (!emailValidate.test(payload.email)) {
        //     let toast = await this.toastController.create({
        //         message: 'Invalid Email',
        //          duration: 3000,
                // color:'secondary',,
        //         position: 'bottom',
        //         color: 'danger',
        //         animated: true,

        //     })
        //     toast.present();
        //     return false;
        // }





        payload.storeId = this.editData._id
        this._shopService.editStoreDetails(payload).subscribe(async (data: any) => {
            console.log("data", data);
            const toast = await this.toastController.create({
                message: 'Store Updated Successfully',
                 duration: 3000,
                color:'secondary',
                position: 'bottom',
                animated: true,
            });
            toast.present();
            this.closeModal()
        },
            async err => {
                console.log(err);
                let toast = await this.toastController.create({
                    message: 'Invalid Data',
                     duration: 3000,
                color:'secondary',
                    position: 'bottom',
                    animated: true,

                })
                toast.present();
            });
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
