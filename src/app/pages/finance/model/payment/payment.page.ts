import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountService } from "../../../../providers/account.service";
import { AlertController, ModalController } from "@ionic/angular";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { PaymentAmountPageModel } from "../PaymentAmount/payment-amount.page";

@Component({
  selector: "app-account_ledger",
  templateUrl: "./payment.page.html",
  styleUrls: ["./payment.page.scss"],
})
export class PaymentPageModel implements OnInit {
  public account = [];
  id;
  public upiUrl;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _accountService: AccountService,
    public modalController: ModalController,
    public _barcodeScanner: BarcodeScanner,
    private inAppBrowser: InAppBrowser,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // this.id = this.activatedRoute.snapshot.paramMap.get("id")
    this.id = localStorage.getItem("adminId");
    console.log(this.id);
    this.getAccount(this.id);
    // this.openScanner();
  }

  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }



  // async openPaymentAmountModel(acc) {
 
  //   const alert = await this.alertController.create({
  //     cssClass: 'my-custom-class',
  //     header: 'Enter Amount  for '+acc.account_name,
  //     inputs: [
  //       {
  //         name: 'am',
  //         type: 'number',
  //         placeholder: 'Enter Amount',
  //       },
       
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: () => {
  //           console.log('Confirm Cancel');
  //         }
  //       }, {
  //         text: 'Ok',
  //         handler: async (data) => {

  //           // const options: string = '_system'; // Use '_system' to open in the system browser
  //           // const browser = this.inAppBrowser.create(barcodeData.text, options);

  //           console.log('Confirm Ok', data);
            


  //         }
  //       }
  //     ]
  //   });

   

  //   await alert.present();
  // }

  openScanner(data) {
    
      console.log("++++++++++++++++open scanner+++++++++++++++");
      this._barcodeScanner
        .scan()
        .then(async (barcodeData) => {
          // success. barcodeData is the data returned by scanner
          console.log("upi id data ", barcodeData.text);
          // this.upiUrl = barcodeData.text;
          data.paymentUrl = barcodeData.text;
           const modal = await this.modalController.create({
            component:PaymentAmountPageModel,
            componentProps: {data}
           });

          modal.onDidDismiss().then((dataReturned) => { });
          return await modal.present();
          // resolve()
          // if (barcodeData.text && this.isValidUrl(barcodeData.text)) {
            // Open the scanned URL in the InAppBrowser
          
          // }
        })
        .catch((err) => {
          // error
        });

  
  }

  getAccount(accountId) {
    this._accountService.getAccount(accountId).subscribe((resp) => {
      this.account = resp.object.response;
    });
  }
}
