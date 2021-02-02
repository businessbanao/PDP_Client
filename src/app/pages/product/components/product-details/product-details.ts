import { Component, ViewChild, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ShopService } from "../../../../providers/shop.services";
import { ModalController, AlertController } from "@ionic/angular";
import { AddProductPage } from "../../modal/addProduct";
import { ToastController } from "@ionic/angular";
import { ActionSheetController } from "@ionic/angular";
import { environment } from "../../../../../environments/environment";
import { async } from '@angular/core/testing';

@Component({
  selector: "page-product-details",
  templateUrl: "product-details.html",
  styleUrls: ["./product-details.scss"],
})
export class ProductDetailsPage implements OnInit {
  public baseUrl: String = environment.baseUrl + "/";
  public reviewList: any = [];
  public isRecommanded: Boolean = false;
  public starRating = [0, 0, 0, 0, 0];
  public storeList: any = [];
  public productData: any = {
    productName: "",
    category: "",
    productImage: "",
    price: "",
    subCategory: "",
    createdAt: "",
    imageVarients: [],
  };

  constructor(
    public modalController: ModalController,
    private _shopService: ShopService,
    private _toast: ToastController,
    public alertController: AlertController,
    public Router: Router,
    private route: ActivatedRoute,
    public actionSheetController: ActionSheetController
  ) {}

  public searchproductList: any = [];
  ngOnInit() {
    console.log(this.route.snapshot.params);
    let productId = this.route.snapshot.params.id;
    this.fetchProductDetails(productId);
    this.getStoreList();
  }

  fetchProductDetails(productId) {
    this._shopService
      .fetchProductDetails(productId)
      .subscribe((results: any) => {
        this.productData = results["productData"];
        this.productData["createdAt"] = this.formateDate(
          this.productData.createdAt
        );
        this.productData["totalOrder"] = results["totalOrder"].length;
        this.reviewList = results["reviewData"];
        this.isRecommanded = this.productData.isRecommended;
        this.getAvgReview();
        this.getStarRating();
        // this.fetchReviewList();
        console.log(results, "res", this.productData);
      });
  }

  share(){
    alert("Will Implement Later")
  }

  // public reviewList:any=[]
  // public fetchReviewList() {
  //   let resp;
  //   this._shopService.getAllReviewList().subscribe((response: any) => {
  //     resp = response;
  //     this.reviewList = resp.reviewList;
  //     console.log(this.reviewList, "reviewList");
  //     this.mapRatingwithProducts();
  //   });
  // }

  mapRatingwithProducts() {
    this.reviewList.forEach((list) => {
      if (this.productData._id == list.productId) {
        this.productData.rating = list.rating;
      } else {
        this.productData.rating = 0;
      }
    });

    console.log("this.productList", this.productData);
  }

  getColor(index: number, rating) {
    if (index > rating) {
      return "grey";
    }

    return "gold";
  }

  formateDate(date) {
    const d = new Date(date);
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);

    let Finaldate = `${da}-${mo}-${ye}`;
    console.log(`Finaldate`, Finaldate);
    return Finaldate;
  }

  async openEditProductModal(storeId) {
    const modal = await this.modalController.create({
      component: AddProductPage,
      componentProps: {
        editData: this.productData,
      },
    });

    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned, "data");
      // if (dataReturned !== null) {
      this.fetchProductDetails(storeId);
      // }
    });

    return await modal.present();
  }

  updateStatus(status) {
    this._shopService
      .updateProductStatus(this.productData._id, {
        Status: status,
      })
      .subscribe(async(results: any) => {
        console.log(results, "res");
        const toast = await this._toast.create({
          message: "Updated Succesfully",
          duration: 3000,
          color:'success',
          position: "bottom",
          animated: true,
        });
        toast.present();
        this.fetchProductDetails(this.productData._id);
      });
  }

  updateRecommendedProduct() {
    this._shopService
      .updateProductStatus(this.productData._id, {
        isRecommended: !this.isRecommanded,
      })
      .subscribe(async(results: any) => {
        console.log(results, "res");
        const toast = await this._toast.create({
          message: "Updated Succesfully",
          duration: 3000,
          color:'success',
          position: "bottom",
          animated: true,
        });
        toast.present();
        this.fetchProductDetails(this.productData._id);
      });
  }

  getAvgReview() {
    let sum=0

    this.reviewList.forEach((list) => {
          sum = sum + parseInt(list.rating);

      });

      this.productData['rating'] = (this.reviewList.length !== 0) ? sum/this.reviewList.length : 0

  //   this.isDataLoaded = true;
    console.log("this.productList",this.productData);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Update Product Availability",
      cssClass: 'actionsheet',
      buttons: [
        {
          text: "AVAILABLE",
          handler: () => {
            this.updateStatus("ACTIVE");
          },
        },
        {
          text: "OUT Of STOCK",
          handler: () => {
            this.updateStatus("OUT_OF_STOCK");
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async deleteProductConfirm(id) {
    console.log("called" + id);
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
            this.DeleteProduct(id);
          },
        },
      ],
    });

    await alert.present();
  }

  DeleteProduct(productId) {
    this._shopService.deleteProduct(productId).subscribe(async (data: any) => {
      console.log(data);
      if (data) {
        const toast = await this._toast.create({
          message: "Product has been Deleted Successfully",
           duration: 3000,
                color:'secondary',
          position: "bottom",
          animated: true,
        });
        toast.present();
        this.Router.navigateByUrl("/products");
      }
    });

  }

   public isHeaderShow: Boolean = false;

  onScroll(data) {
    // console.log(data.detail.scrollTop,"scrollTop")
    let scrollPoint = data.detail.scrollTop || 0;
    if (scrollPoint > 120) {
      this.isHeaderShow = true;
    }

    if (scrollPoint < 120) {
      this.isHeaderShow = false;
    }
  }


  getStarRating() {
    this.reviewList.forEach((list) => {
      switch (list.rating) {
        case "1":
          this.starRating[0] = this.starRating[0] + 1;
          break;
        case "2":
          this.starRating[1] = this.starRating[1] + 1;
          break;
        case "3":
          this.starRating[2] = this.starRating[2] + 1;
          break;
        case "4":
          this.starRating[3] = this.starRating[3] + 1;
          break;
        case "5":
          this.starRating[4] = this.starRating[4] + 1;
          break;
      }
    });
  }


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

        };
      });

      this.storeList.push({
        text: "Cancel",
        icon: "close",
        role: "cancel",
        handler: () => {
          console.log("Cancel clicked");

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
}
