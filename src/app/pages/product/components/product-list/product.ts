// import { environment } from './../../../../../environments/environment.prod';
import { Component, ViewChild, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ProductService } from "../../../../providers/product.services";
import {
  ToastController,
  ModalController,
  AlertController,
  ActionSheetController,
  IonSearchbar,
} from "@ionic/angular";
import { AddProductPage } from "../../modal/addProduct";
import { ShopService } from "../../../../providers/shop.services";
import { FormControl } from "@angular/forms";
import { UserServices } from "../../../../providers/user.services";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: "page-product",
  templateUrl: "product.html",
  styleUrls: ["./product.scss"],
})
export class ProductPage implements OnInit {
  public baseUrl: String = environment.baseUrl + "/";
  // public baseUrl = 'http://5afcaa1d.ngrok.io/'
  public productList: any = [];
  public reviewList: any = [];
  public filter: any = {
    recommeneded: false,
  };
  public storeList: any = [];
  public searchQuery: string = "";
  public isToggled: Boolean = false;
  selected = new FormControl(0);
  @ViewChild("autofocus", { static: false }) searchbar: IonSearchbar;

  public isDataLoaded: Boolean = false;
  constructor(
    public modalController: ModalController,
    private _shopService: ShopService,
    private _userServices: UserServices,
    private _toast: ToastController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController
  ) {}

  public page = {
    limit: 20,
    skip: 0,
  };

  public searchproductList: any = [];
  ngOnInit() {
    this.getProductList();
    // this.getReviewList();
    this.getStoreList();
    console.log("selected", this.selected);
  }

  public refershDefault = {
    target: {
      complete: function () {
        return true;
      },
    },
  };

  getStoreList() {
    let self = this;
    this._shopService.fetchStoreList().subscribe((data: any) => {
      this.storeList = data.storeList;
      console.log(this.storeList);
      this.storeList.forEach((val) => {
        console.log(val);
        val["text"] = val.storeName;
        val["handler"] = function () {
          self.assign(val._id);
          self.page = {
            limit: 20,
            skip: 0,
          };
          self.searchQuery = "";
          self.getProductList();
        };
      });

      this.storeList.push({
        text: "Cancel",
        icon: "close",
        role: "cancel",
        handler: () => {
          console.log("Cancel clicked");
          this.page = {
            limit: 20,
            skip: 0,
          };
          this.getProductList();
        },
      });
      console.log(this.storeList);
    });
  }

  public selectedProductId;
  async addProductToshop(id) {
    this.selectedProductId = id;
    const actionSheet = await this.actionSheetController.create({
      header: "Choose Shop",
      buttons: this.storeList,
      cssClass: 'actionsheet'
    });
    await actionSheet.present();
    // this.getProductList();
  }

  assign(shopId) {
    console.log(shopId, this.selectedProductId);

    this._shopService
      .AddProductToShop({
        productId: this.selectedProductId,
        shopId: shopId,
      })
      .subscribe(async (data: any) => {
        console.log(data);
        if (data) {
          const toast = await this._toast.create({
            message: "Product has been assigned Successfully",
            duration: 3000,
            color: "secondary",
            position: "bottom",
            animated: true,
          });
          this.selectedProductId = "";
          // this.selectedProduct = '';
          toast.present();
        }
      });
  }

  public resetPagination(){
    this.page ={
      limit:20,
      skip:0
    }
  }

  showRecommendedProducts() {
    this.filter = {
      recommeneded: this.isToggled,
    };
    this.page = {
      limit: 20,
      skip: 0,
    };
    this.getProductList();
  }

  // public reviewList:any=[]
  // public fetchReviewList() {
  //   let resp;
  //   this._shopService.getAllReviewList().subscribe((response: any) => {
  //     resp = response;
  //     this.reviewList = resp.reviewList;
  //     console.log(this.reviewList, "reviewList");
  //     // this.mapRatingwithProducts();
  //   });
  // }

  getAvgReview() {
    let sum=0
    this.productList.forEach((product) => {
      product.reviewList.forEach((list) => {
          sum = sum + parseInt(list.rating);

      });

      product['rating'] = (product.reviewList.length !== 0) ? sum/product.reviewList.length : 0
    });

  //   this.isDataLoaded = true;
    console.log("this.productList", this.productList);
  }

  getColor(index: number, rating) {
    if (index > rating) {
      return "grey";
    }

    return "gold";
  }

  getProductList(event = this.refershDefault) {
    this._shopService
      .fetchProductList(
        {
          shopId: "all",
          filter: (this.filter.recommeneded) ? "rec" : "",
        },
        this.page
      )
      .subscribe((data: any) => {
        setTimeout(() => {
          this.productList = data;
          // this.getAvgReview()
              this.isDataLoaded = true;
          // this.fetchReviewList();
        }, 0);
        console.log(data);
        if (event) {
        }
        setTimeout(() => {
          console.log("Async operation has ended");
          event.target.complete();
              this.isDataLoaded = true;
          // this.fetchReviewList();
        }, 1000);
      },(error)=>{
        console.error(error,"================err")
      });
  }

  search(query) {
    if (query.target.value.length >= 2) {
      this._userServices
      .search({
        search: query.target.value,
        filter: "Product",
      })
      .subscribe((data: any) => {
        console.log(data, "data");
        this.productList = data.productList;
        // this.getAvgReview()
      });
    }

    if (query.target.value.length == 0) {
      this.resetPagination()
      this.getProductList();
    }
  }

  async presentActionSheet(data) {
    const actionSheet = await this.actionSheetController.create({
      header: "Update Product Availability",
      cssClass: 'actionsheet',
      buttons: [
        {
          text: "AVAILABLE",
          handler: () => {
            this.updateStatus("ACTIVE", data);
          },
        },
        {
          text: "OUT Of STOCK",
          handler: () => {
            this.updateStatus("OUT_OF_STOCK", data);
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
            this.getProductList();
          },
        },
      ],
    });
    await actionSheet.present();
  }

  updateStatus(status, data) {
    this._shopService
      .updateProductStatus(data._id, {
        Status: status,
      })
      .subscribe((results: any) => {
        console.log(results, "res");
        this.page = {
          limit: 20,
          skip: 0,
        };
        this.searchQuery = "";
        this.getProductList();
      });
  }

  async deleteProductConfirm(id) {
    const alert = await this.alertController.create({
      header: "Delete Product ?",
      message: "Are You Sure, you want to delete this Product ?",
      cssClass: 'actionsheet',
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
            this.getProductList();
          },
        },
        {
          text: "Delete",
          handler: () => {
            console.log("deleted Confirmed");
            this.DeleteProduct(id);
          },
        },
      ],
    });

    await alert.present();
  }

  DeleteProduct(productId) {
    this._shopService.deleteProduct(productId).subscribe(async (data: any) => {
      // this.storeList = data
      console.log(data);
      if (data) {
        this.getProductList();
        const toast = await this._toast.create({
          message: "Product has been Deleted Successfully",
          duration: 3000,
          color: "secondary",
          position: "bottom",
          animated: true,
        });
        toast.present();
      }
    });
  }
  async openAddProductModal() {
    const modal = await this.modalController.create({
      component: AddProductPage,
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.page = {
          limit: 20,
          skip: 0,
        };
        this.getProductList();
      }
    });

    return await modal.present();
  }

  public showSearchBox: Boolean = false;
  enableSearch() {
    this.showSearchBox = true;
    setTimeout(() => this.searchbar.setFocus(), 500);
  }

  backToNormal() {
    this.showSearchBox = false;
    this.refershProductList();
  }

  loadMore(event) {
    this.page.limit = this.page.limit;
    this.page.skip = this.page.skip + 20;
    this._shopService
      .fetchProductList(
        {
          shopId: "all",
          filter: (this.filter.recommeneded) ? "rec" : "",
        },
        this.page
      )
      .subscribe((data: any) => {
        if (event) {
          setTimeout(() => {
            console.log("Done");
            event.target.complete();
            this.productList = this.productList.concat(data);
            // this.getAvgReview();
          }, 1800);
        }
      });
  }

  refershProductList(event = this.refershDefault) {
    this.page = {
      limit: 20,
      skip: 0,
    };
    this.searchQuery = "";
    this.filter.recommeneded=false
    this.isToggled = false
    this.getProductList(event);
  }


}
