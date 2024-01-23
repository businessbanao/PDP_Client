import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountService } from "../../../../providers/account.service";
import { AlertController, ModalController } from "@ionic/angular";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: "app-account-amount_ledger",
  templateUrl: "./payment-amount.page.html",
  styleUrls: ["./payment-amount.page.scss"],
})
export class PaymentAmountPageModel implements OnInit {
  public upiUrl: string;
  public merchantName: string;
  public merchantAddress: string;
  public amount: string;
  public accountType: string;
  public data
    constructor(
    private activatedRoute: ActivatedRoute,
    private _accountService: AccountService,
    public modalController: ModalController,
    public _barcodeScanner: BarcodeScanner,
    private inAppBrowser: InAppBrowser,
    private alertController: AlertController,
  ) {}

   ngOnInit() {
    if (this.data && this.data.paymentUrl) {
      const { merchantName, amount,virtualPaymentAddress } = this.extractDataFromUPIUrl(this.data.paymentUrl);
      this.upiUrl = this.data.paymentUrl;
      this.merchantName = merchantName;
      this.amount = amount;
      this.merchantAddress = virtualPaymentAddress;

      // Use merchantName and amount as needed
      console.log("+++++++++++++",this.data);
      console.log("____________",merchantName,amount,virtualPaymentAddress);
    } else {
      // Handle the case when paymentUrl is not provided
      this.closeModal();
    }
      
  }

  async closeModal() {
    const onClosedData: string = "Payment screen closed";
    await this.modalController.dismiss(onClosedData);
  }

  extractDataFromUPIUrl(upiUrl: string): { merchantName: string, amount: string,virtualPaymentAddress:string } {
    const urlSearchParams = new URLSearchParams(upiUrl.split('?')[1]);
    const merchantName = urlSearchParams.get('pn') || '';
    const virtualPaymentAddress = urlSearchParams.get('pa') || ''
    const amount = urlSearchParams.get('am') || '';

    return { merchantName, amount,virtualPaymentAddress };
  }

  pay(){

    const urlSearchParams = new URLSearchParams(this.upiUrl.split('?')[1]);
    urlSearchParams.set('am',this.amount);
    const updatedUPIUrl = 'upi://pay?' + urlSearchParams.toString();
    // const paytmUrl = "paytmmp://pay?"+ urlSearchParams.toString();


  // Open the updated UPI link using the in-app browser
  const options: string = '_system';
  const browser = this.inAppBrowser.create(updatedUPIUrl, options);
  console.log(browser);

  }



}
