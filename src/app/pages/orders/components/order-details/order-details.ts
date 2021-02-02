import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from "../../../../providers/product.services";
import { ActionSheetController, ToastController, ModalController, AlertController } from '@ionic/angular';
import { ShopService } from "../../../../providers/shop.services";
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'page-orders',
  templateUrl: 'order-details.html',
  styleUrls: ['./order-details.scss'],
})
export class OrderDetailsPage implements OnInit {

  public orderList: any = [];
  public paymentData: any = [];

  constructor(public modalController: ModalController,
    private _shopService: ShopService,
    private toastController: ToastController,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private clipboard: Clipboard,

  ) { }

  public searchproductList:any=[]
   ngOnInit() {

    console.log(this.route.snapshot.params);
    let orderId = this.route.snapshot.params.id;
    this.fetchOrderData(orderId);

  }

  public itemValue = 0;
  fetchOrderData(orderId) {
    this._shopService.getOrderDetails(orderId).subscribe((results: any) => {
      this.orderList = results['orderData'];
      this.paymentData = results['paymentData']
      console.log(results, "res", this.orderList);
      // this.orderList[0]["createdAt"] = this.formateDate(
      //   this.orderList[0].createdAt
      // );

      this.orderList.forEach((order)=>{
        this.itemValue = this.itemValue + parseFloat(order.productPrice) * order.QTY
      })
    });
  }


  // formateDate(date) {
  //   const d = new Date(date);
  //   const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
  //   const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
  //   const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);

  //   let Finaldate = `${da}-${mo}-${ye}`;
  //   console.log(`Finaldate`, Finaldate);
  //   return Finaldate;
  // }

  async copy(code){
    console.log(code ,":: code ")
    this.clipboard.clear()
    this.clipboard.copy(code);
    const toast = await this.toastController.create({
      message: "Order Id Copied",
      duration: 2000,
      position: "bottom",
      color:'success',
      animated: true,
    });
    toast.present();

    // this.toast.
  }



}
