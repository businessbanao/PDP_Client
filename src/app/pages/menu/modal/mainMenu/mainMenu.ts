import { Component, ViewChild, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ProductService } from "../../../../providers/product.services";
import { ShopService } from "../../../../providers/shop.services";
import { ToastController, ModalController } from "@ionic/angular";
import { UserServices } from "../../../../providers/user.services";

@Component({
  selector: "page-mainMenu",
  templateUrl: "mainMenu.html",
  styleUrls: ["./mainMenu.scss"],
})
export class mainMenuPage implements OnInit {
  public productList: any = [];
  public searchWord: any;
  public backupProductList: any;
  public selectedProduct: any;
  public selectedCategory: any;
  public subcategoryList: any = [];
  public menuList: any = [];
  public subcategoryName;

  @Input() categoryId:any;

  constructor(
    private _shopService: ShopService,
    private _toast: ToastController,
    private _userServices: UserServices,
    private route: ActivatedRoute,
    private modalController:ModalController
  ) {}

  public searchproductList: any = [];
  public selectedSubCategory: any = "";
  ngOnInit() {
    this.getSubCategoryList();
    this.getProductList();
    let _subCatId = this.categoryId;
    console.log(_subCatId, "_subCatId");
    this.selectedSubCategory = _subCatId;
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
        this.backupProductList = data;
        this.updateSelectedProduct()
        console.log(this.productList);
      });
  }

  updateSelectedProduct() {
    this.productList.forEach((val) => {
      console.log("added key : false :init", val);
      if (val.subcategoryIds.includes(this.selectedSubCategory)) {
        val["isChecked"] = true;
        val["shouldShow"] = true;
      } else {
        val["isChecked"] = false;
        val["shouldShow"] = false;
        this.totalunchekedCount = this.totalunchekedCount + 1;
      }
    });
  }


  refesh(event) {
    this.getSubCategoryList();
    this.getProductList();
    setTimeout(() => {
      console.log("Async operation has ended");
      event.target.complete();
    }, 1500);
  }

  getSubCategoryList() {
    this._shopService.listSubCategory().subscribe((data: any) => {
      this.subcategoryList = data.SubCategoryList;
      console.log(data, "--------------------------", this.subcategoryList);

      this.subcategoryList.forEach((list)=>{
        if(list._id == this.selectedSubCategory){
          this.subcategoryName = list.subcategoryName
        }
      })
    });
  }

  onKey(value) {
    console.log(value, "va");
    this.productList = this.search(value);
    if (value == "") {
      this.productList = this.backupProductList;
    }
  }

  async ClosePage(){
      await this.modalController.dismiss();
  }

  // search($event) {
  //   console.log($event.target.value)
  //   let filter = $event.target.value.toLowerCase();
  //   console.log("filter",filter)
  //   return this.productList.filter(option => option.productName.toLowerCase().startsWith(filter));
  // }

  // search(query) {
  //   if (query.target.value.length >= 2) {
  //     this._userServices
  //       .search({
  //         search: query.target.value,
  //         filter: "Product",
  //       })
  //       .subscribe((data: any) => {
  //         console.log(data, "data");
  //         this.productList = data.productList;
  //       });
  //   }

  //   if (query.target.value.length == 0) {
  //     this.getProductList();
  //   }
  // }


  public __backupList = [];
  search(query) {
    let self = this
    this.productList.forEach(function (val) {
      if (val.isChecked &&  !val.shouldShow ) {
        self.__backupList.push(val._id);
      }
    });

      this._userServices
        .search({
          search: query.target.value,
          filter: "Product",
        })
        .subscribe((data: any) => {
          console.log(data, "data",this.__backupList,"this.__backupList");
          this.productList = data.productList;
          this.productList.forEach((val) => {
            console.log("added key : false :init", val);
            if (val.subcategoryIds.includes(this.selectedSubCategory)) {
              val["isChecked"] = true;
              val["shouldShow"] = true;
            } else {
              val["isChecked"] = false;
              val["shouldShow"] = false;
              this.totalunchekedCount = this.totalunchekedCount + 1;
            }
          });

          this.productList.forEach((val) => {
            this.__backupList.forEach((val2) => {
              if (val._id == val2) {
                val.isChecked = true;
              } else {
                val["isChecked"] = false;
              }
            });
          });
        });
  }

  public arr: any = [];

  async assignProduct() {
    this.productList.forEach((val) => {
      val.isChecked == true ? this.arr.push(val._id) : "";
    });

    if(this.arr.length == 0){
      const toast = await this._toast.create({
        message: 'Please Select Product',
         duration: 3000,
                color:'secondary',
        position: "bottom",
        animated: true,
      });
      toast.present();
      return
    }

    this._shopService
      .assignProductToCategory({
        productId: this.arr,
        subcategoryIds: this.selectedSubCategory,
      })
      .subscribe(async (data: any) => {
        console.log(data, "data");
        this.selectedProduct = "";
        this.selectedCategory = "";
        const toast = await this._toast.create({
          message: 'Saved Successfully',
           duration: 3000,
                color:'secondary',
          position: "bottom",
          animated: true,
        });
        toast.present();
        this.getProductList();
      });
  }

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

    // console.log(this.productList)
  }
}
