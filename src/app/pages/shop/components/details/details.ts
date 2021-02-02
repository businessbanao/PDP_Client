import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ShopService } from "../../../../providers/shop.services";
import { ModalController, AlertController } from '@ionic/angular';
import { AddShopPage } from "../../modal/addshop";
import { AddProductToShopPage } from "../../modal/addProductToShop/addProductToShop";
import { ToastController } from '@ionic/angular';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
  styleUrls: ['./details.scss'],
})
export class ShopDetailsPage implements OnInit {

  public AdminProfile: any = {
    _id: '',
    email: 'admin@badhaobusiness.in',
    mobile: '8920832260'
  }
  public baseUrl: String = environment.baseUrl + "/";
  public storeList: any = []
  public backupProductList:any;
  public searchWord: any;
  public productList: any = []
  public storeData: any = {
    storeName: '',
    storeAddress: '',
    pincode: '',
    email: '',
    website: '',
    storeLogo: ''
  }
  constructor(public modalController: ModalController,
    private _shopService: ShopService,
    private _toast: ToastController,
    private route: ActivatedRoute,
    public Router: Router,
    public alertController: AlertController
  ) { }

  public searchproductList:any=[]
  public _storeId:any=''
   ngOnInit() {

    console.log(this.route.snapshot.params);
    this._storeId = this.route.snapshot.params.id;
    this.fetStoreDetails(this._storeId);
    this.getProductList(this._storeId)

  }

  public refershDefault = {
    target: {
      complete: function () {
        return true
      }
    }
  }

  async openAddProductToShopModal() {
    const modal = await this.modalController.create({
      component: AddProductToShopPage,
      componentProps:{
        storeId:this._storeId
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        // this.getStoreList()
        this.getProductList(this._storeId)
      }
    });

    return await modal.present();
  }

  searchProducts(q){
    console.log(q.target.value);
    this.productList = this.backupProductList
    if(q.target.value == ''){
      this.productList = this.backupProductList
    }else{
    this.productList = this.productList.filter((list)=>{
      console.log(list.productName.includes(q.target.value))
        return list.productName.toLowerCase().includes(q.target.value.toLowerCase())
    })
  }
  }


  fetStoreDetails(storeId) {
    this._shopService.fetchStoreDetails(storeId).subscribe((results: any) => {
      this.storeData = results['data']
      console.log(results, "res", this.storeData)
    });
  }


  async openEditProfileModal(storeId) {
    const modal = await this.modalController.create({
      component: AddShopPage,
      componentProps: {
        "editData": this.storeData
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned, "data")
      // if (dataReturned !== null) {
      this.fetStoreDetails(storeId)
      // }
    });

    return await modal.present();
  }


  getProductList(storeId, event = this.refershDefault) {
    this._shopService.fetchProductList({
      shopId: storeId,
      filter:''
    },{
      limit:500,
      skip:0
    }).subscribe((data: any) => {
      this.productList = data;
      this.backupProductList = data;
      this.fetchReviewList();
      console.log(data)
      if (event) { }
      setTimeout(() => {
        console.log('Async operation has ended');
        event.target.complete();
        this.fetchReviewList();
      }, 1000);
    });

  }

    public reviewList:any=[]
    public fetchReviewList() {
      let resp;
      this._shopService
        .getAllReviewList()
        .subscribe((response: any) => {
          resp = response;
          this.reviewList = resp.reviewList
          console.log(this.reviewList, "reviewList");
          this.mapRatingwithProducts();
        });
    }

    mapRatingwithProducts() {
      this.productList.forEach((product) => {
        this.reviewList.forEach((list) => {
          if (product._id == list.productId) {
            // console.log("product.productId == list.productId",product._id , list.productId ,order.productId == list.productId)
            product.rating = list.rating;
          }else{
            product.rating = 0;
          }
        });
      });

      console.log("this.productList", this.productList);
    }

    getColor(index: number, rating) {
      if (index > rating) {
        return "grey";
      }

      return "gold";
    }


  async deleteProductConfirm(id) {
    const alert = await this.alertController.create({
      header: 'Delete Shop ?',
      message: 'Are You Sure, you want to delete this Shop ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Delete',
          handler: () => {
            console.log('deleted Confirmed');
            this.DeleteProductFromShop(id)
          }
        }
      ]
    });

    await alert.present();

  }

  DeleteProductFromShop(productId) {
    this._shopService.removeProductFromShop(productId, this.storeData._id).subscribe(async (data: any) => {
      console.log(data);
      if (data) {
        this.getProductList(this.storeData._id);
        const toast = await this._toast.create({
          message: 'Product unassigned Successfully',
           duration: 3000,
                color:'secondary',
          position: 'bottom',
          animated: true,
        });
        toast.present();
      }
    });
  }

  DeleteShop(storeId) {
    this._shopService.deleteShop(storeId).subscribe(async (data: any) => {
      // this.storeList = data
      console.log(data);
      if (data) {
        // this.getStoreList();

        const toast = await this._toast.create({
          message: 'Shop has been Deleted Successfully',
           duration: 3000,
                color:'secondary',
          position: 'bottom',
          animated: true,
        });
        toast.present();

        this.Router.navigateByUrl('/shop')
      }
    });
  }

  async deleteAlertConfirm(list) {
    const alert = await this.alertController.create({
      header: 'Delete Shop ?',
      message: `Are You Sure, you want to delete ${list.storeName} (${list.city}) Shop ?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Delete',
          handler: () => {
            console.log('deleted Confirmed');
            this.DeleteShop(list._id)
          }
        }
      ]
    });

    await alert.present();
  }





}
