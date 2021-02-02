import { Component, OnInit, Input } from "@angular/core";
import {
  ModalController,
  ActionSheetController,
  AlertController,
} from "@ionic/angular";

import { ShopService } from "../../../../providers/shop.services";

@Component({
  selector: "modal-vendor-report",
  styleUrls: ["vendor-report.scss"],
  templateUrl: "./vendor-report.html",
})
export class VendorReportPage implements OnInit {
  public Department = [];

  depId:String;
  depName:String;

  constructor(
    private modalController: ModalController,
    private _shopService: ShopService,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController
  ) {}

  ngOnInit(): void {
    console.log(this.depId,"depId",this.depName)
    this.getVendorDetails(this.depId);

  }

  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }


  public entryList = [];
  public total=0;

  getVendorDetails(id) {
    this._shopService.getVendorDetails(id,{
      sDate:'2020-11-01',
      eDate:'2020-11-31'
    }).subscribe((data: any) => {
      this.entryList = data.response;
      this.total = this.sum(this.entryList,"amount");
    });
  }

  sum(items, prop) {
    let total_value = 0;
    items.forEach(function (val) {
      if (val.departmentName == "Cancel Discount") {
        total_value = total_value - val.amount;
      } else {
        total_value = total_value + val.amount;
      }
    });
    return total_value;
  }

}


