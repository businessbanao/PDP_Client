import { Router } from '@angular/router';
import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import {
  ModalController,
  NavParams,
  ActionSheetController,
  Platform,
  LoadingController,
} from "@ionic/angular";


@Component({
  selector: "modal-order-incoming",
  templateUrl: "./order-incoming.html",
  styleUrls: ["./order-incoming.scss"],
})
export class OrderIncomingPage {



  constructor(private router:Router,private modalController: ModalController){

  }

  @Input() newOrderCount: any;

  ngOnInit(): void {
    console.log(this.newOrderCount + " new orders recieved");

  }

  checkNewOrders(){
    this.closeModal();
    this.router.navigateByUrl('/tabs/order')
  }

  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }
}
