import { Component, ViewChild, OnInit, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ShopService } from "../../../../providers/shop.services";
import { ModalController, ActionSheetController } from "@ionic/angular";
import { ToastController } from "@ionic/angular";
import { UserServices } from "../../../../providers/user.services";
import { FormControl } from "@angular/forms";

@Component({
  selector: "page-offer",
  templateUrl: "offer.html",
  styleUrls: ["./offer.scss"],
})
export class OfferPage implements OnInit {
  public couponName: any = "";
  public couponCode: any = "";
  public expireDate: any = "";
  public discountAmt: any = "";
  public rewardDiscount: any = "";
  public minOrder: any = "";
  public currentDate = new Date();
  // @ViewChild("autofocus", { static: false }) input: any;
  @ViewChild("autofocus", { static: false }) inputEl: ElementRef;

  selected = new FormControl(0);
  tabs = ["Coupon Manager", "Discount Manager", "Rewards"];

  public offerList: any = [
    {
      name: "Discount",
      _id: 1,
    },
    {
      name: "Buy 1 Get 1",
      _id: 2,
    },
  ];

  myControl = new FormControl();
  options = [{ name: "FLAT" }];

  filteredOptions = [
    { name: "FLAT" },
    { name: "BACHAT" },
    { name: "SAVE" },
    { name: "BACHAO" },
    { name: "SALE" },
    { name: "OFF" },
  ];
  public searchWord: any;
  public minDate;

  public productList: any = [];
  public backupProductList: any;
  public selectedoffer: any;
  public selectedProduct: any;
  public _shopId: any;
  constructor(
    public modalController: ModalController,
    private _shopService: ShopService,
    private _userServices: UserServices,
    private _toast: ToastController,
    private route: ActivatedRoute,
    public actionSheetController: ActionSheetController
  ) {}

  public searchproductList: any = [];
  ngOnInit() {
    this.fetchOffers();
    // this.minDate = '1990-12-31';
    this.getProductList();
    this._shopId = this.route.snapshot.params.id;
    console.log(this._shopId, "_shopId");
    this.selectedoffer = this._shopId;
  }

  public isDiscountEnable = false;
  public discount;

  changeOffer($event) {
    console.log($event);
    if ($event == 1) {
      this.isDiscountEnable = true;
    } else {
      this.isDiscountEnable = false;
      this.discount = 200;
      console.log("discount", this.discount);
    }
  }

  async openCouponOptions(list) {
    // this.selectetobj.selected = true;
    // this.selectetobj.id = list._id;
    const actionSheet = await this.actionSheetController.create({
      header: "Actions",

      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Edit Coupon",
          role: "destructive",
          icon: "create",
          handler: () => {
            this.isEditModeEnable = true;
            this.EditOffer(list);
          },
        },
        {
          text: "Delete Coupon",
          icon: "trash",
          handler: () => {
            this.deleteOffer(list._id);
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            // this.selectetobj.selected = false;
            // this.selectetobj.id = ''
            console.log("Cancel clicked");
          },
        },
      ],
    });
    await actionSheet.present();
  }

  public isRewardModeEnable = false;
  async openRewardOptions(list) {
    // this.selectetobj.selected = true;
    // this.selectetobj.id = list._id;
    const actionSheet = await this.actionSheetController.create({
      header: "Actions",

      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Delete Reward",
          icon: "trash",
          handler: () => {
            this.deleteOffer(list._id);
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            // this.selectetobj.selected = false;
            // this.selectetobj.id = ''
            console.log("Cancel clicked");
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async onChange(value) {
    var specialCharformat = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (specialCharformat.test(value)) {
      const toast = await this._toast.create({
        message: "Special Character not allowed",
        duration: 3000,
        color: "warning",
        position: "bottom",
        animated: true,
      });
      toast.present();
      return;
    }

    for (let i = value.length - 1; i >= 0; i--) {
      var type = this.onlyDigits(value[i]);
      if (type) {
        const toast = await this._toast.create({
          message: "Numbers not allowed",
          duration: 3000,
          color: "warning",
          position: "bottom",
          animated: true,
        });
        toast.present();
        return;
      }
    }

    var reg = /^[0-9]*[.]?[0-9]*$/;

    if (reg.test(value)) {
      const toast = await this._toast.create({
        message: "NUmbers not allowed",
        duration: 3000,
        color: "warning",
        position: "bottom",
        animated: true,
      });
      toast.present();
      return;
    }

    this.couponCode = value;
  }

  onSelect(value) {
    this.couponCode = value.name;
  }

  displayFn(user): string {
    return user && user.name ? user.name : "";
  }

  public isEditModeEnable = false;
  public editOfferId: any;

  hasNumber(myString) {
    return /\d/.test(myString);
  }

  EditOffer(list) {
    this.isEditModeEnable = true;

    let arr = list.couponCode.split("");

    let code = [];
    arr.forEach((char) => {
      console.log(parseInt(char) == NaN, parseInt(char), char);
      if (!this.hasNumber(char)) {
        code.push(char);
      }
    });

    this.couponName = list.couponName;
    this.couponCode = code.join("");
    this.expireDate = list.expireDate;
    this.discountAmt = list.discountedAmount;
    this.editOfferId = list._id;
    this.minOrder = list.minAmount;
    this.rewardDiscount = list.discountedAmount;
    document.getElementById("header").scrollIntoView();
    setTimeout(() => this.inputEl.nativeElement.focus());
    // alert("called")
  }

  onkeydown(char) {
    var ch = char;
    var filter = /[a-zA-Z]/;
    if (!filter.test(ch)) {
      event.returnValue = false;
    }
  }

  onlyDigits(s) {
    for (let i = s.length - 1; i >= 0; i--) {
      const d = s.charCodeAt(i);
      if (d < 48 || d > 57) return false;
    }
    return true;
  }

  async updateOffer() {
    // if (this.discountAmt > 100 || this.discountAmt < 0) {
    //   const toast = await this._toast.create({
    //     message: "Discount is Invalid",
    //     duration: 3000,
    //     color: "secondary",
    //     position: "bottom",
    //     animated: true,
    //   });
    //   toast.present();
    //   return;
    // }

    // var specialCharformat = !/\D/

    // if (specialCharformat.test(this.couponCode)) {
    //   const toast = await this._toast.create({
    //     message: "Special Character not allowed",
    //     duration: 3000,
    //     color: "warning",
    //     position: "bottom",
    //     animated: true,
    //   });
    //   toast.present();
    //   return;
    // }

    // var numberRegex = /^\d*$/;

    //   if(numberRegex.test(this.couponCode)){
    //     const toast = await this._toast.create({
    //       message: "Numbers not allowed",
    //       duration: 3000,
    //       color: "warning",
    //       position: "bottom",
    //       animated: true,
    //     });
    //     toast.present();
    //     return;
    //   }

    var specialCharformat = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (specialCharformat.test(this.couponCode)) {
      const toast = await this._toast.create({
        message: "Special Character not allowed",
        duration: 3000,
        color: "warning",
        position: "bottom",
        animated: true,
      });
      toast.present();
      return;
    }

    for (let i = this.couponCode.length - 1; i >= 0; i--) {
      var type = this.onlyDigits(this.couponCode[i]);
      if (type) {
        const toast = await this._toast.create({
          message: "Numbers not allowed",
          duration: 3000,
          color: "warning",
          position: "bottom",
          animated: true,
        });
        toast.present();
        return;
      }
    }

    var reg = /^[0-9]*[.]?[0-9]*$/;

    if (reg.test(this.couponCode)) {
      const toast = await this._toast.create({
        message: "Numbers not allowed",
        duration: 3000,
        color: "warning",
        position: "bottom",
        animated: true,
      });
      toast.present();
      return;
    }

    if(!this.expireDate){
      const toast = await this._toast.create({
        message: "Please Select Date",
        duration: 3000,
        color: "warning",
        position: "bottom",
        animated: true,
      });
      toast.present();
      return;
    }

    if(!this.discountAmt){
      const toast = await this._toast.create({
        message: "Please Enter Cashback Amount",
        duration: 3000,
        color: "warning",
        position: "bottom",
        animated: true,
      });
      toast.present();
      return;
    }


    this._shopService
      .editOffer(
        {
          couponName: this.couponName,
          couponCode: this.couponCode + this.discountAmt,
          expireDate: this.expireDate,
          discountedAmount: this.discountAmt,
          ownerId: localStorage.getItem("adminId"),
        },
        this.editOfferId
      )
      .subscribe(async (data: any) => {
        console.log(data);
        if (data) {
          this.isEditModeEnable = false
          const toast = await this._toast.create({
            message: "Coupon updated Successfully",
            duration: 3000,
            color: "success",
            position: "bottom",
            animated: true,
          });

          this.fetchOffers();
          this.couponName = null;
          this.couponCode = null;
          this.expireDate = null;
          this.discountAmt = null;
          this.editOfferId = null;

          toast.present();
        }
      });
  }

  async SaveSetting() {
    // if (this.rewardDiscount > 100 || this.rewardDiscount < 0) {
    //   const toast = await this._toast.create({
    //     message: "Discount is Invalid",
    //     duration: 3000,
    //     color: "secondary",
    //     position: "bottom",
    //     animated: true,
    //   });
    //   toast.present();
    //   return;
    // }

    if(!this.rewardDiscount){
      const toast = await this._toast.create({
        message: "Please Enter Cashback Amount",
        duration: 3000,
        color: "warning",
        position: "bottom",
        animated: true,
      });
      toast.present();
      return;
    }

    if(!this.minOrder){
      const toast = await this._toast.create({
        message: "Please Enter Min Order Amount",
        duration: 3000,
        color: "warning",
        position: "bottom",
        animated: true,
      });
      toast.present();
      return;
    }

    if(!this.expireDate){
      const toast = await this._toast.create({
        message: "Please Select Date",
        duration: 3000,
        color: "warning",
        position: "bottom",
        animated: true,
      });
      toast.present();
      return;
    }


    this._shopService
      .createOffer({
        couponName: "Reward",
        couponCode: "Reward",
        discountedAmount: this.rewardDiscount,
        minAmount: this.minOrder,
        expireDate: this.expireDate,
        isRewardSetting: true,
        ownerId: localStorage.getItem("adminId"),
      })
      .subscribe(async (data: any) => {
        console.log(data);
        if (data) {
          const toast = await this._toast.create({
            message: "Setting Saved Successfully",
            duration: 3000,
            color: "success",
            position: "bottom",
            animated: true,
          });
          this.minOrder = null;
          this.expireDate = null;
          this.rewardDiscount = null;
          this.fetchOffers();
          toast.present();
        }
      });
  }

  public page = {
    limit: 20,
    skip: 0,
  };

  loadMore(event) {
    this.page.limit = this.page.limit;
    this.page.skip = this.page.skip + 20;
    this._shopService
      .fetchProductList(
        {
          shopId: "all",
          filter: "",
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

  deleteOffer(id) {
    this._shopService.deleteOffer(id).subscribe(async (data: any) => {
      this.noOffersDataFound = true;
      this.fetchOffers();
      const toast = await this._toast.create({
        message: "Deleted",
        duration: 3000,
        color: "secondary",
        position: "bottom",
        animated: true,
      });

      toast.present();
    });
  }

  inFuture = (date: Date) => {
    return date.setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0);
  };

  async createOffer() {
    // let today = new Date().toISOString().slice(0, 10);
    // var yesterday = new Date(Date.now() - 864e5)

    // console.log(yesterday,"yesterday",this.inFuture(this.expireDate.slice(0, 10)))
    // if (this.inFuture(this.expireDate.slice(0, 10))) {
    //   const toast = await this._toast.create({
    //     message: "Past Date is not allowed",
    //     duration: 3000,
    //     color: "warning",
    //     position: "bottom",
    //     animated: true,
    //   });
    //   toast.present();
    //   return;
    // }

    var specialCharformat = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (specialCharformat.test(this.couponCode)) {
      const toast = await this._toast.create({
        message: "Special Character not allowed",
        duration: 3000,
        color: "warning",
        position: "bottom",
        animated: true,
      });
      toast.present();
      return;
    }

    for (let i = this.couponCode.length - 1; i >= 0; i--) {
      var type = this.onlyDigits(this.couponCode[i]);
      if (type) {
        const toast = await this._toast.create({
          message: "Numbers not allowed",
          duration: 3000,
          color: "warning",
          position: "bottom",
          animated: true,
        });
        toast.present();
        return;
      }
    }

    var reg = /^[0-9]*[.]?[0-9]*$/;

    if (reg.test(this.couponCode)) {
      const toast = await this._toast.create({
        message: "Numbers not allowed",
        duration: 3000,
        color: "warning",
        position: "bottom",
        animated: true,
      });
      toast.present();
      return;
    }

    if(!this.expireDate){
      const toast = await this._toast.create({
        message: "Please Select Date",
        duration: 3000,
        color: "warning",
        position: "bottom",
        animated: true,
      });
      toast.present();
      return;
    }

    if(!this.discountAmt){
      const toast = await this._toast.create({
        message: "Please Enter Cashback Amount",
        duration: 3000,
        color: "warning",
        position: "bottom",
        animated: true,
      });
      toast.present();
      return;
    }


    this._shopService
      .createOffer({
        couponName: this.couponCode,
        couponCode: this.couponCode + this.discountAmt,
        expireDate: this.expireDate,
        discountedAmount: this.discountAmt,
        ownerId: localStorage.getItem("adminId"),
      })
      .subscribe(async (data: any) => {
        console.log(data);
        if (data) {
          const toast = await this._toast.create({
            message: "Offer Created Successfully",
            duration: 3000,
            color: "secondary",
            position: "bottom",
            animated: true,
          });

          this.fetchOffers();
          this.couponName = null;
          this.couponCode = null;
          this.expireDate = null;
          this.discountAmt = null;

          toast.present();
        }
      });
  }

  public _offerList: any = [];
  public noOffersDataFound = true;
  fetchOffers() {
    let self = this;
    this._shopService
      .listOffer(localStorage.getItem("adminId"))
      .subscribe(async (res: any) => {
        console.log(res);
        if (res) {
          this._offerList = res["data"];
          this._offerList.forEach(function (offerData) {
            if (offerData.isRewardSetting == false) {
              self.noOffersDataFound = false;
            }
          });
        }
      });
  }

  public resetPagination() {
    this.page = {
      limit: 20,
      skip: 0,
    };
  }
  getProductList() {
    this._shopService
      .fetchProductList(
        {
          shopId: "all",
          filter: "",
        },
        this.page
      )
      .subscribe((data: any) => {
        this.productList = data;

        this.productList.forEach((val) => {
          console.log("added key : false :init");
          if (val.shopIds.includes(this.selectedoffer)) {
            val["isChecked"] = true;
          } else {
            val["isChecked"] = false;
          }
        });

        this.backupProductList = data;
        console.log(this.productList);
      });
  }

  public arr: any = [];

  async setOffer() {
    // if (this.discount > 100 || this.discount < 0) {
    //   const toast = await this._toast.create({
    //     message: "Discount is Invalid",
    //     duration: 3000,
    //     color: "warning",
    //     position: "bottom",
    //     animated: true,
    //   });
    //   toast.present();
    //   return;
    // }
    // let arr = []
    this.productList.forEach((val) => {
      val.isChecked == true ? this.arr.push(val._id) : "";
    });

    if (this.arr.length !== 0) {
      console.log("offer", this.arr, this.discount);
      this._shopService
        .updateOffer({
          productIds: this.arr,
          discount: this.discount,
        })
        .subscribe(async (data: any) => {
          console.log(data);
          if (data) {
            const toast = await this._toast.create({
              message: "Offer has been Set Successfully",
              duration: 3000,
              color: "success",
              position: "bottom",
              animated: true,
            });
            this.arr = [];
            this.getProductList();
            this.discount = null;
            this.selectedoffer = null;
            toast.present();
          }
        });
    } else {
      const toast = await this._toast.create({
        message: "Please Select Products",
        duration: 3000,
        color: "secondary",
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
    this.resetPagination();
    let self = this;
    this.productList.forEach(function (val) {
      if (val.isChecked && !val.shouldShow) {
        self.__backupList.push(val._id);
      }
    });

    this._userServices
      .search({
        search: query.target.value,
        filter: "Product",
      })
      .subscribe((data: any) => {
        console.log(data, "data", this.__backupList, "this.__backupList");
        this.productList = data.productList;
        // this.productList.forEach((val) => {
        // console.log("added key : false :init", val);
        // });

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
