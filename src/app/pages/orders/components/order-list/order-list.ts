import { Component, ViewChild, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ProductService } from "../../../../providers/product.services";
import {
  ActionSheetController,
  ToastController,
  IonSearchbar,
} from "@ionic/angular";
import { ShopService } from "../../../../providers/shop.services";
import { IonInfiniteScroll } from "@ionic/angular";
import { UserServices } from "../../../../providers/user.services";
import { UpdateOrderService } from "../../../../providers/update-order";
import { Subscription } from 'rxjs';

@Component({
  selector: "page-orders",
  templateUrl: "order-list.html",
  styleUrls: ["./order-list.scss"],
})
export class OrderListPage implements OnInit {
  public orderList: any = [];
  public totalOrderCount = 0;
  public searchWord: any;
  public multiselect: Boolean = false;
  public filterBy: any = "none";

  private _tourubscription:Subscription[]=[];
  subscription: Subscription;

  @ViewChild("autofocus", { static: false }) searchbar: IonSearchbar;
  public isDataLoaded: Boolean = false;
  constructor(
    private _ProductService: ProductService,
    public actionSheetController: ActionSheetController,
    public _shopService: ShopService,
    private _userServices: UserServices,
    private _toast: ToastController,
    private router:Router,
  private UpdateOrderService:UpdateOrderService
  ) {}

  isIndeterminate: boolean;
  masterCheck: boolean;
  // orderList:any;

  checkMaster() {
    setTimeout(() => {
      this.orderList.forEach((obj) => {
        obj.isChecked = this.masterCheck;
      });
    });
  }

  checkEvent() {
    const totalItems = this.orderList.length;
    let checked = 0;
    this.orderList.map((obj) => {
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

    console.log(this.orderList);
  }

  public searchproductList: any = [];
  ngOnInit() {


    this._tourubscription.push(this.UpdateOrderService.stepState().subscribe(step =>{
      console.log(step,"step")
      this.getorderList();

    }));



      this.getorderList();
  }

  action(isChecked, id) {
    console.log("isChecked", isChecked);
    this.orderList.map((val) => {
      if (val._id == id) {
        let updatedVal = isChecked == true ? false : true;
        console.log("adding key", updatedVal);
        // delete val.isChecked;
        val.isChecked = updatedVal;
        console.log(val, "isChecked");
      }
    });

    console.log("orderlist", this.orderList);
  }

  onHold(id) {
    this.orderList.forEach((val) => {
      if (val._id == id) {
        console.log("added key");
        val["isChecked"] = true;
      }
    });
    this.multiselect = true;
    console.log(this.orderList, id);
    // alert("called")
  }

  clearFilter() {
    this.filterBy = "all";
    this.multiselect = false
    // this.searchWord='';
  }



  navigateToorderDetail(list){
    if(this.multiselect == false){
      this.router.navigateByUrl('/orders/order-details/'+ list.orderId)
    }else{
      this.onHold(list._id)
    }
  }


  async presentFilterSheet(orderId) {
    if (!this.orderList.length) return;

    const actionSheet = await this.actionSheetController.create({
      header: "Search Filters",
      buttons: [
        {
          text: "Search By Product",
          icon: "newspaper-sharp",
          handler: () => {
            this.filterBy = "product";
            this.searchWord = "";
          },
        },
        {
          text: "Search By Customer Name",
          icon: "people",
          handler: () => {
            this.filterBy = "customerName";
            this.searchWord = "";
          },
        },
        {
          text: "Search By Customer Mobile",
          icon: "call",
          handler: () => {
            this.filterBy = "mobile";
            this.searchWord = "";
          },
        },
        {
          text: "Search By Order Id",
          icon: "code-working-sharp",
          handler: () => {
            this.filterBy = "orderId";
            this.searchWord = "";
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async presentActionSheet(orderId,userId) {
    let arr = [];
    this.orderList.forEach((val) => {
      val.isChecked == true ? arr.push(val._id) : "";
    });

    if (arr.length == 0 && this.multiselect) {
      const toast = await this._toast.create({
        message: "Please Select Any Order",
        duration: 3000,
        color: "warning",
        position: "bottom",
        animated: true,
      });
      toast.present();
      return;
    }

    const actionSheet = await this.actionSheetController.create({
      header: "Please Update Order",
      buttons: [
        {
          text: "Prepared",
          icon: "gift",
          handler: () => {
            orderId == "multiple"
              ? this.updateMultipleOrder("PACKED")
              : this.updateOrder("PACKED", orderId);
            console.log("packed clicked");
          },
        },
        {
          text: "Out For Delivery",
          icon: "send",
          handler: () => {
            // this.updateOrder('OUT_FOR_DELIVERY', orderId);
            orderId == "multiple"
              ? this.updateMultipleOrder("OUT_FOR_DELIVERY")
              : this.updateOrder("OUT_FOR_DELIVERY", orderId);
            console.log("out for delievry clicked");
          },
        },
        {
          text: "Delivered",
          icon: "golf",
          handler: () => {
            // this.updateOrder('DELIVERED', orderId);
            orderId == "multiple"
              ? this.updateMultipleOrder("DELIVERED")
              : this.updateOrder("DELIVERED", orderId);
            console.log("golf clicked");
          },
        },
        {
          text: "On Hold",
          icon: "pause",
          // role: 'cancel',
          handler: () => {
            // this.updateOrder('ON_HOLD', orderId);
            orderId == "multiple"
              ? this.updateMultipleOrder("ON_HOLD")
              : this.updateOrder("ON_HOLD", orderId);
            console.log("hold clicked");
            // alert("hold by chance clicked")
          },
        },
        {
          text: "Canceled ",
          icon: "backspace",

          handler: () => {
            // this.updateOrder('CANCEL_ORDER', orderId);
            orderId == "multiple"
              ? this.updateMultipleOrder("CANCEL_ORDER")
              : this.updateOrder("CANCEL_ORDER", orderId,userId);
            console.log("cancel order clicked");
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
            // this.resetPage();
            this.getorderList();
          },
        },
      ],
    });
    await actionSheet.present();
  }

  // public enableMultipleOrder = false;
  MultipleOrder() {
    // this.enableMultipleOrder = true;
    this.multiselect = true;
  }

  updateMultipleOrder(_status) {
    let arr = [];
    console.log(this.orderList,"this.orderList")
    this.orderList.forEach((val) => {
      val.isChecked == true ? arr.push(val._id) : "";
    });

    this._shopService
      .orderUpdate({
        orderStatus: _status,
        orderId: arr,
      })
      .subscribe(async (response: any) => {
        // this.resetPage();
        this.getorderList();
        console.log("response", response);
        this.cancelSelect();
        const toast = await this._toast.create({
          message: "Order has been Updated Successfully",
          duration: 3000,
          color: "secondary",
          position: "bottom",
          animated: true,
        });
        toast.present();
      });
  }

  updateOrder(status, orderId,userId = '') {
    let arr = [];
    arr.push(orderId);
    this._shopService
      .orderUpdate({
        orderStatus: status,
        orderId: arr,
        userId:userId
      })
      .subscribe(async (response: any) => {
        this.resetPage();
        this.getorderList();
        console.log("response", response);
        const toast = await this._toast.create({
          message: "Order has been Updated Successfully",
          duration: 3000,
          color: "secondary",
          position: "bottom",
          animated: true,
        });
        toast.present();
      });
  }

  public page = {
    limit: 30,
    skip: 0,
  };

  getorderList(event = this.refershDefault) {
    this.resetPage();
    this.searchWord = "";
    this._ProductService
      .getOrderList(this.page, {
        filter: "none",
        search: "none",
      })
      .subscribe((response: any) => {

        let arr = response["OrderList"];
        if (arr.length > 0) {
          this.orderList = this.uniqueByKeepLast(arr, it=>it.orderId);
        }
        console.log(this.orderList, "orderList");

        this.orderList.forEach((val) => {
          console.log("added key : false :init");
          val["isChecked"] = false;

          if(typeof val.UserId == 'object'){
            val["userIdExists"] = true;
          }else{
            val["userIdExists"] = false
          }
        });
        this.totalOrderCount = response["totalCount"];

        this.isDataLoaded = true;
        if (event) {
        }
        setTimeout(() => {
          console.log("Async operation has ended");
          event.target.complete();
        }, 0);
      });
  }

  resetPage() {
    this.page = {
      limit: 30,
      skip: 0,
    };
  }

  search(query) {
    this.resetPage();
    if (query.target.value.length >= 2) {
      this._ProductService
        .getOrderList(this.page, {
          filter: this.filterBy,
          search: query.target.value,
        })
        .subscribe((data: any) => {
          console.log(data, "data");
          if (Array.isArray(data)) {
            this.orderList = data;
          } else {
            this.orderList = data.OrderList;
          }

          this.orderList.forEach((val) => {
            console.log("added key : false :init");
            val["isChecked"] = false;

            if(typeof val.UserId == 'object'){
              val["userIdExists"] = true;
              val["userDataExists"] = false;
            }else{
              val["userIdExists"] = false;
              val["userDataExists"] = true;
            }
          });
        });
    }

    if (query.target.value.length == 0) {
      // this.resetPage()
      this.getorderList();
    }
  }

  loadOrderData(event) {
    this.page.limit = this.page.limit;
    this.page.skip = this.page.skip + 30;

    this._ProductService
      .getOrderList(this.page, {
        filter: this.filterBy,
        search: this.searchWord ? this.searchWord : " ",
      })
      .subscribe((response: any) => {
        console.log(this.orderList, "orderList");
        setTimeout(() => {
          console.log("Done");
          event.target.complete();
          if (Array.isArray(response)) {
            this.orderList = this.orderList.concat(response);
          } else {
            this.orderList = this.orderList.concat(response["OrderList"]);
          }
        }, 0);
      });
  }

  public refershDefault = {
    target: {
      complete: function () {
        return true;
      },
    },
  };

  public showSearchBox: Boolean = false;
  enableSearch() {
    this.showSearchBox = true;
    this.filterBy = this.filterBy == "none" ? "all" : this.filterBy;
    setTimeout(() => this.searchbar.setFocus(), 500);
  }

  backToNormal() {
    this.showSearchBox = false;
    this.filterBy = "none";
    // this.resetPage();
    this.getorderList();
  }

  cancelSelect() {
    this.multiselect = false;
    // this.resetPage();
    this.getorderList();
  }

  uniqueByKeepLast(data, key) {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  }
}


// 7862@Suna
