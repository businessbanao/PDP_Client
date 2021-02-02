import { Component, OnInit, Input } from "@angular/core";
import {
  ModalController,
  ActionSheetController,
  AlertController,
} from "@ionic/angular";

import { ShopService } from "../../../../providers/shop.services";
import { ToastController } from "@ionic/angular";
import { VendorReportPage } from '../vendor-report/vendor-report';

@Component({
  selector: "modal-vendor",
  styleUrls: ["vendor.scss"],
  templateUrl: "./vendor.html",
})
export class VendorPage implements OnInit {
  public Department = [];
  public vendorIds = [
    "5f9c709fb158285771155d47",
    "5f9c70c2b158285771155d48",
    "5f9c7155b158285771155d4b",
    "5f9c7122b158285771155d4a",
    "5f9c6fbeb158285771155d42",
    "5f9c6f93b158285771155d41",
    "5fba44368e60a18b5f26e394",
    "5fba44818e60a18b5f26e396"

  ];

  public staffIds = [
    "5f9c719fb158285771155d4c",
    "5f9c71b2b158285771155d4d",
    "5f9c71cfb158285771155d4e",
    "5f9c71e5b158285771155d4f",
    "5f9c71f6b158285771155d50",
    "5f9c7227b158285771155d51",
    "5f9c723fb158285771155d52",
    "5f9c7255b158285771155d53",
  ];
  constructor(
    private modalController: ModalController,
    private _shopService: ShopService,
    private toastController: ToastController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.getDepartment();
  }

  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }

  public OutgoingAccountList = [];
  public IncomingAccountList = [];
  public StaffList = [];

  getDepartment() {
    this._shopService.getDepartments("Outgoing").subscribe((data: any) => {
      this.OutgoingAccountList = data.response;
      // this.VendorList = this.Department;

      // this.VendorList = this.Department.filter((dep) => {
      //   return this.vendorIds.includes(dep._id);
      // });

      // this.StaffList = this.Department.filter((dep) => {
      //   return this.staffIds.includes(dep._id);
      // });
      // console.log(data, "--------------------------", this.Department);
    });

    this._shopService.getDepartments("Incoming").subscribe((data: any) => {
      this.IncomingAccountList = data.response;
    });
  }

  async openVendorDetailsModal(id,name) {

    console.log(name)
    const modal = await this.modalController.create({
      component: VendorReportPage,
      componentProps: {
        'depId': id,
        'depName':name
      }
    });


    modal.onDidDismiss().then((dataReturned) => {});

    return await modal.present();
  }



}
