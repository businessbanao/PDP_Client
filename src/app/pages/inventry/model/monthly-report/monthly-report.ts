import { Component, OnInit, Input } from "@angular/core";
import {
  ModalController,
  ActionSheetController,
  AlertController,
} from "@ionic/angular";

import { ShopService } from "../../../../providers/shop.services";
import { ToastController } from "@ionic/angular";
import { VendorReportPage } from "../vendor-report/vendor-report";

@Component({
  selector: "modal-monthly-report",
  styleUrls: ["monthly-report.scss"],
  templateUrl: "./monthly-report.html",
})
export class MonthlyReportPage implements OnInit {
  public inventryList = [];

  public incomingInventryList = [];
  public OutgoinginventryList = [];
  public vendorInventryList = [];
  public incomingAmount = 0;
  public outgonigAmount = 0;
  public vendorIncomingAmount = 0;
  public sweggyAmount = 0;
  public zamotoAmount = 0;

  public zReportTotal =0;
  public uddharJamaTotal =0;
  public openBalanceTotal =0;

  public uddharGyaTotal =0;
  public HDFC_Expense_Total =0;
  public existing_open_bal_Total =0;
  public hdfcTransaction=0;
  public openBalanceAmount = 0; // open bal tha
  public openBal=0;

  public dhamaJiReceived=0;
  public dhamaJiPaid=0;
  public rahulReceived=0;
  public rahulPaid=0;
  public manojReceived=0;
  public manojPaid=0;
  public hdfcReceived=0;
  public hdfcPaid=0;
  public hdfcAccount=0;
  public hdfcTransactionCharges=0;

  public changeDate: any = new Date();

  ngOnInit(): void {
    // this.getReportDetails()
    // Incoming Specific Account
    // this.getData();
  }

  getData(){
    this.getdepInventryList("Incoming","5ff0130959a8e08e4b397dd8",'zReportTotal');
    this.getdepInventryList("Incoming","5ff0159059a8e08e4b397de4",'uddharJamaTotal');
    this.getdepInventryList("Outgoing","5ff1551559a8e08e4b397e07",'uddharGyaTotal');

    this.getInventryList("Outgoing");
    // this.getIncomingInventryList("Incoming");
    this.getdepInventryList("Incoming","5ff014ee59a8e08e4b397ddf",'dhamaJiPaid');
    this.getdepInventryList("Incoming","5ff0150359a8e08e4b397de0",'rahulPaid');
    this.getdepInventryList("Incoming","5ff0154e59a8e08e4b397de2",'manojPaid');
    this.getdepInventryList("Incoming","5ff0156659a8e08e4b397de3",'hdfcPaid');

    this.getdepInventryList("Outgoing","5ff0249d59a8e08e4b397de8",'dhamaJiReceived');
    this.getdepInventryList("Outgoing","5ff0248159a8e08e4b397de7",'rahulReceived');
    this.getdepInventryList("Outgoing","5ff0246759a8e08e4b397de6",'manojReceived');
    this.getdepInventryList("Outgoing","5ff024fa59a8e08e4b397de9",'hdfcReceived');
  }

  public isReportGenerated = false;
  public savedReport={
    reportName:'',
    account_balances:{}
  }

  getReportDetails(){
    let date = this.currentDate.toString().slice(4,7)+" "+this.currentDate.getFullYear();
    this._shopService
    .getReportDetails(date)
    .subscribe((data: any) => {
      console.log(JSON.stringify(data));
      if(data){
          this.isReportGenerated = true;
          this.savedReport = data['ReportList']
        }

        this.getData();
    })
  }


  async openVendorDetailsModal(id) {
    const modal = await this.modalController.create({
      component: VendorReportPage,
      componentProps: {
        depId: id,
      },
    });

    modal.onDidDismiss().then((dataReturned) => {});

    return await modal.present();
  }

  public currentDate = new Date()
  handleChangeDate(changeDate) {
    // this.changeDate = changeDate;
    console.log(changeDate, "changeDate");
    let date = new Date(changeDate);
    console.log(date.toString().slice(4,7), " " , date.getFullYear())
    this.currentDate = new Date(changeDate);;
    this.changeDate = changeDate.slice(0, 10);
    // this.getInventryList("Incoming");
    this.getReportDetails();

    // this.getVendorInventryList();
  }

  // Rahul Recieved , dharma ji , HDFC , manoj recieved
  public OwnerAccountsinOutgoing = ['5ff0248159a8e08e4b397de7','5ff0249d59a8e08e4b397de8','5ff024fa59a8e08e4b397de9','5ff0246759a8e08e4b397de6'];


  getInventryList(type) {
    this._shopService
      .listInventryWithRange(type, "2020-11-01", "2020-11-30")
      .subscribe((data: any) => {
        // this.OutgoinginventryList = JSON.parse(JSON.stringify(data.response));

        this.OutgoinginventryList =  data.response.filter((accounts)=>{
            return !this.OwnerAccountsinOutgoing.includes(accounts.departmentID)
        })

        console.log(this.OutgoinginventryList,"this.OutgoinginventryList")


        this.outgonigAmount = this.sum(this.OutgoinginventryList, "amount");
        let groupResult = this.OutgoinginventryList.reduce(function (r, a) {
          r[a.departmentName] = r[a.departmentName] || [];
          r[a.departmentName].push(a);
          return r;
        }, Object.create(null));

        console.log(groupResult, "group result");
        let finalArr = [];
        for (const [key, value] of Object.entries(groupResult)) {
          // console.log(`${key}: ${JSON.stringify(value)}`);

          let total = this.sum(value, "amount");
          finalArr.push({
            departmentName: key,
            amount: total,
            departmentID:value[0].departmentID
          });
        }

        this.OutgoinginventryList = finalArr;
      });
  }


  getIncomingInventryList(type) {
    this._shopService
      .listInventryWithRange(type, "2020-11-01", "2020-11-30")
      .subscribe((data: any) => {
        this.incomingInventryList = data.response;
        this.incomingAmount = this.sum(this.incomingInventryList, "amount");
        let groupResult = this.incomingInventryList.reduce(function (r, a) {
          r[a.departmentName] = r[a.departmentName] || [];
          r[a.departmentName].push(a);
          return r;
        }, Object.create(null));

        console.log(groupResult, "group result");
        let finalArr = [];
        for (const [key, value] of Object.entries(groupResult)) {
          console.log(`${key}: ${value}`);

          let total = this.sum(value, "amount");
          finalArr.push({
            departmentName: key,
            amount: total,
            departmentID:value[0].departmentID
          });
        }

        this.incomingInventryList = finalArr;
      });
  }

  getdepInventryList(type,depId,variableName) {
    this._shopService
      .listDepInventryWithRange(type, "2020-11-01", "2020-11-30",depId)
      .subscribe((data: any) => {
        console.log(variableName,"var")
        console.log(this.sum(data.response, "amount"))
        this[variableName] = this.sum(data.response, "amount");
      });
  }

  getVendorInventryList() {
    this._shopService
      .listInventry("Vendor_Incoming", this.changeDate)
      .subscribe((data: any) => {
        this.vendorInventryList = data.response;
        this.vendorIncomingAmount = this.sum(this.vendorInventryList, "amount");

        this.sum(this.vendorInventryList, "amount");
        console.log(
          data,
          "--------------------------",
          this.vendorInventryList
        );
      });
  }

  sum(items, prop) {
    let total_value = 0;
    items.forEach(function (val) {
      if (
        val.departmentName == "Cancel Discount" ||
        val.departmentName == "Discount" ||
        val.departmentName == "Short Cash"
      ) {
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
  public updateId = "";
  public updatedIncomingAmount = 0;
  public updatedOutoingAmount = 0;
  public updatedIncomingVendorAmount = 0;

  public updatedIncomingDescription = "";
  public updatedOutoingDescription = "";
  public updatedIncomingVendorDescription = "";

  enableUpdate(id) {
    this.updateId = id;
    this.enableUpdateAmountBox = true;
    this.getInventryList("Incoming");
    this.getInventryList("Outgoing");
    this.getVendorInventryList();
  }

  editIncomingInventry(id) {
    this._shopService
      .editInventry(id, {
        amount: this.updatedIncomingAmount,
        description: this.updatedIncomingDescription,
      })
      .subscribe((data: any) => {
        this.enableUpdateAmountBox = false;
        this.updatedIncomingAmount = 0;
        this.updatedOutoingAmount = 0;
        this.updatedIncomingVendorAmount = 0;
        this.getInventryList("Incoming");
        this.getInventryList("Outgoing");
      });
  }

  editOutgoingInventry(id) {
    this._shopService
      .editInventry(id, {
        amount: this.updatedOutoingAmount,
        description: this.updatedOutoingDescription,
      })
      .subscribe((data: any) => {
        this.enableUpdateAmountBox = false;
        this.updatedIncomingAmount = 0;
        this.updatedOutoingAmount = 0;
        this.updatedIncomingVendorAmount = 0;
        this.getInventryList("Incoming");
        this.getInventryList("Outgoing");
      });
  }

  editVendorIncomingInventry(id) {
    this._shopService
      .editInventry(id, {
        amount: this.updatedIncomingAmount,
        description: this.updatedIncomingVendorDescription,
      })
      .subscribe((data: any) => {
        this.enableUpdateAmountBox = false;
        this.updatedIncomingAmount = 0;
        this.updatedOutoingAmount = 0;
        this.updatedIncomingVendorAmount = 0;
        this.getInventryList("Incoming");
        this.getInventryList("Outgoing");
        this.getVendorInventryList();
      });
  }

  public ownerRecieved = [];

  constructor(
    private modalController: ModalController,
    private _shopService: ShopService,
    private toastController: ToastController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController
  ) {}

  saveReport(){
    let date = this.currentDate.toString().slice(4,7)+" "+this.currentDate.getFullYear();

    this._shopService
    .saveReport( {
      reportName: date + 'Monthly Report',
      type: "Monthly",
      account_balances: {
        netCash:this.zReportTotal + this.uddharJamaTotal + this.openBalanceTotal + this.sweggyAmount
        +this.zamotoAmount  - this.outgonigAmount - this.openBal,
        total_incoming:this.zReportTotal + this.uddharJamaTotal + this.openBalanceTotal + this.sweggyAmount
        +this.zamotoAmount,
        total_outgoing:this.outgonigAmount,
        dhamaji_account_total:this.dhamaJiReceived + this.hdfcAccount - this.dhamaJiPaid,
        rahul_account_total:this.rahulReceived  - this.rahulPaid,
        manoj_account_total:this.manojReceived + this.sweggyAmount - this.manojPaid,
        hdfc_account_total:this.hdfcReceived + this.hdfcTransactionCharges + this.zamotoAmount - this.hdfcPaid
      },
      description: "",
      reportDate: date
    })
    .subscribe(async (data: any) => {
        // alert("success");
        const toast = await this.toastController.create({
          message: "Report Saved Successfully",
          duration: 4000,
          color: "success",
          position: "top",
          animated: true,
        });
        toast.present();

    });
  }
}
