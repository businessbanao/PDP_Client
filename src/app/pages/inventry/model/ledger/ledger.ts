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
  selector: "modal-ledger",
  styleUrls: ["ledger.scss"],
  templateUrl: "./ledger.html",
})


export class LedgerPage implements OnInit {

  public inventryList=[];
  public OutgoinginventryList=[];
  public vendorInventryList=[];
  public incomingAmount = 0;
  public outgonigAmount = 0;
  public vendorIncomingAmount = 0;
  public changeDate:any= new Date();

  ngOnInit(): void {
    // this.handleChangeDate(new Date());
  }

  async openVendorDetailsModal(id) {
    const modal = await this.modalController.create({
      component: VendorReportPage,
      componentProps: {
        'depId': id,
      }
    });

    modal.onDidDismiss().then((dataReturned) => {});

    return await modal.present();
  }


handleChangeDate(changeDate) {
        // this.changeDate = changeDate;
        console.log(changeDate,"changeDate")
        this.changeDate = changeDate.slice(0,10);
        this.getInventryList("Incoming");
    this.getInventryList("Outgoing");
    this.getVendorInventryList();
}


  getInventryList(type) {
    this._shopService.listInventry(type,this.changeDate).subscribe((data: any) => {
      if (type == 'Incoming') {
        this.inventryList = data.response;
        this.incomingAmount = this.sum(this.inventryList, "amount");
      } else {
        this.OutgoinginventryList = data.response;
        this.outgonigAmount = this.sum(this.OutgoinginventryList, "amount");
       this.ownerRecieved = this.OutgoinginventryList.filter((val)=>{
          return val.departmentID == '5fc013cd8e60a18b5f26e4be'
        })
      }
      this.sum(this.inventryList, "amount");
      console.log(data, "--------------------------", this.inventryList);
    });
  }


  getVendorInventryList() {
    this._shopService.listInventry('Vendor_Incoming',this.changeDate).subscribe((data: any) => {
        this.vendorInventryList = data.response;
        this.vendorIncomingAmount = this.sum(this.vendorInventryList, "amount");

      this.sum(this.vendorInventryList, "amount");
      console.log(data, "--------------------------", this.vendorInventryList);
    });
  }

  sum(items, prop) {
    let total_value = 0;
    items.forEach(function (val) {
      if (val.departmentName == "Cancel Bill" ||
      val.departmentName == "Discount On  Sell" ||
      val.departmentName == "Short In Cash") {
        total_value = total_value - val.amount;
      } else {
        total_value = total_value + val.amount;
      }
    });
    return total_value;
  }

  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }


  public enableUpdateAmountBox = false;
  public updateId='';
  public updatedIncomingAmount = 0;
  public updatedOutoingAmount = 0;
  public updatedIncomingVendorAmount = 0;

  public updatedIncomingDescription = '';
  public updatedOutoingDescription = '';
  public updatedIncomingVendorDescription = '';

  enableUpdate(id){
    this.updateId= id
    this.enableUpdateAmountBox = true;
    this.getInventryList("Incoming");
    this.getInventryList("Outgoing");
    this.getVendorInventryList();
  }

  editIncomingInventry(id){

    this._shopService.editInventry(id,{
      amount:this.updatedIncomingAmount,
      description:this.updatedIncomingDescription
    }).subscribe((data: any) => {

      this.enableUpdateAmountBox = false;
      this.updatedIncomingAmount = 0;
      this.updatedOutoingAmount = 0;
      this.updatedIncomingVendorAmount = 0;
      this.getInventryList("Incoming");
      this.getInventryList("Outgoing");
        });
  }

  editOutgoingInventry(id){

    this._shopService.editInventry(id,{
      amount:this.updatedOutoingAmount,
      description:this.updatedOutoingDescription
    }).subscribe((data: any) => {

      this.enableUpdateAmountBox = false;
      this.updatedIncomingAmount = 0;
      this.updatedOutoingAmount = 0;
      this.updatedIncomingVendorAmount = 0;
      this.getInventryList("Incoming");
      this.getInventryList("Outgoing");
        });
  }

  editVendorIncomingInventry(id){

    this._shopService.editInventry(id,{
      amount:this.updatedIncomingAmount,
      description:this.updatedIncomingVendorDescription
    }).subscribe((data: any) => {

      this.enableUpdateAmountBox = false;
      this.updatedIncomingAmount = 0;
      this.updatedOutoingAmount = 0;
      this.updatedIncomingVendorAmount = 0;
      this.getInventryList("Incoming");
      this.getInventryList("Outgoing");
      this.getVendorInventryList();
    });
  }





  public ownerRecieved=[];

  constructor(
    private modalController: ModalController,
    private _shopService: ShopService,
    private toastController: ToastController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController
  ) {}



}
