import { Component, ViewChild, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ShopService } from "../../../../providers/shop.services";
import { ModalController } from "@ionic/angular";
import { AddShopPage } from "../../modal/addshop";
import { ToastController } from "@ionic/angular";
import { UserServices } from "../../../../providers/user.services";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: "page-addProductToShop",
  templateUrl: "addProductToShop.html",
  styleUrls: ["./addProductToShop.scss"],
})
export class AddProductToShopPage implements OnInit {

  @Input() storeId: any;
  public backUrl;
  public storeList: any = [];
  public searchWord: any;
  public productList: any = [];
  public backupProductList: any;
  public selectedStore: any;
  public selectedProduct: any;
  public _shopId: any;
  public baseUrl: String = environment.baseUrl + "/";
  constructor(
    public modalController: ModalController,
    private _shopService: ShopService,
    private _userServices: UserServices,
    private _toast: ToastController,
    private route: ActivatedRoute,
    private Router: Router
  ) {}

  public searchproductList: any = [];
  ngOnInit() {
    this.getStoreList();
    this.getProductList();
    // this._shopId = this.route.snapshot.params.id;
    console.log(this.storeId, "_shopId");
    this.selectedStore = this.storeId;
    this.backUrl = `/tabs/shop/details/${this.storeId}`;
  }

  cancelModel() {
    this.modalController.dismiss();
  }

  public _shopName: String;
  getStoreList() {
    this._shopService.fetchStoreList().subscribe((data: any) => {
      this.storeList = data.storeList;

      this.storeList = this.storeList.filter((val) => {
        return val._id == this.selectedStore;
      });

      this._shopName = this.storeList[0].storeName;

      console.log(this.storeList);
    });
  }

  public totalunchekedCount = 0;
  getProductList() {
    this._shopService
      .fetchProductList({
        shopId: "all",
        filter:''
      },{
        limit:500,
        skip:0
      })
      .subscribe((data: any) => {
        this.productList = data;

        this.updateSelectedProduct();

        this.backupProductList = data;
        console.log(this.productList);
      });

    // this.totalunchekedCount
  }

  updateSelectedProduct() {
    this.productList.forEach((val) => {
      console.log("added key : false :init", val);
      if (val.shopIds.includes(this.selectedStore)) {
        val["isChecked"] = true;
        val["shouldShow"] = true;
      } else {
        val["isChecked"] = false;
        val["shouldShow"] = false;
        this.totalunchekedCount = this.totalunchekedCount + 1;
      }


    });


  }

  public arr: any = [];

  async assign() {
    // let arr = []
    this.productList.forEach((val) => {
      (val.isChecked == true && val.shouldShow == false)? this.arr.push(val._id) : "";
    });


    if (this.arr.length !== 0) {
      this._shopService
        .AddProductToShop({
          productId: this.arr,
          shopId: this.selectedStore,
        })
        .subscribe(async (data: any) => {
          console.log(data);
          if (data) {
            const toast = await this._toast.create({
              message: "Product has been assigned Successfully",
               duration: 3000,
                color:'secondary',
              position: "bottom",
              animated: true,
            });
            // this.selectedStore = '';
            this.arr = [];
            this.getProductList();
            toast.present();
            // this.Router.navigateByUrl('/shop')
            this.modalController.dismiss();
          }
        });
    } else {
      const toast = await this._toast.create({
        message: "Please Select Products",
         duration: 3000,
                color:'warning',
        position: "bottom",
        animated: true,
      });
      toast.present();
    }
  }

  onKey(value) {
    console.log(value, "va");
    this.productList = this.search(value);
    if (value == "") {
      this.productList = this.backupProductList;
    }
  }

  public __backupList = [];
  search(query) {
    let self = this
    this.productList.forEach(function (val) {
      if (val.isChecked &&  !val.shouldShow ) {
        self.__backupList.push(val._id);
      }
    });

    if (query.target.value.length >= 2) {
      this._userServices
        .search({
          search: query.target.value,
          filter: "Product",
        })
        .subscribe((data: any) => {
          console.log(data, "data",this.__backupList,"this.__backupList");
          this.productList = data.productList;
          this.productList.forEach((val) => {
            console.log("added key : false :init", val,this.__backupList);
            this.__backupList.forEach((val2) => {
              if (val._id == val2) {
                val.isChecked = true;
                val["shouldShow"] = false;
              } else {
                val["isChecked"] = false;
                val["shouldShow"] = false;
              }
            });

            // if (val.shopIds.includes(this.selectedStore)) {

            //   val['isChecked'] = true;
            //   val['shouldShow'] = true;
            // } else {
            //   val['isChecked'] = false;
            //   val['shouldShow'] = false;
            //   this.totalunchekedCount =  this.totalunchekedCount + 1;
            // }
          });
        });
    }

    if (query.target.value.length == 0) {
      this.getProductList();
    }
  }

  // search(value: string) {
  //   let filter = value.toLowerCase();
  //   return this.productList.filter(option => option.productName.toLowerCase().startsWith(filter));
  // }

  cancelSelect() {
    this.getProductList();
  }

  isIndeterminate: boolean;
  masterCheck: boolean;
  // orderList:any;

  checkMaster() {
    setTimeout(() => {
      this.productList.forEach((obj) => {
        obj.isChecked = this.masterCheck;
      });
    });
  }

  checkEvent() {
    const totalItems = this.productList.length;
    let checked = 0;
    this.productList.map((obj) => {
      if (obj.isChecked) checked++;
    });
    if (checked > 0 && checked < totalItems) {
      //If even one item is checked but not all
      this.isIndeterminate = true;
      this.masterCheck = false;
    } else if (checked == totalItems) {
      //If all are checked
      this.masterCheck = true;
      this.isIndeterminate = false;
    } else {
      //If none is checked
      this.isIndeterminate = false;
      this.masterCheck = false;
    }

    console.log(this.productList);
  }
}
