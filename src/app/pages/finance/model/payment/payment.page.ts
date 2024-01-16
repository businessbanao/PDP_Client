import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountService } from "../../../../providers/account.service";
import { ModalController } from "@ionic/angular";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";

@Component({
  selector: "app-account_ledger",
  templateUrl: "./payment.page.html",
  styleUrls: ["./payment.page.scss"],
})
export class PaymentPageModel implements OnInit {
  public account = [];
  id
  constructor(
    private activatedRoute: ActivatedRoute,
    private _accountService: AccountService,
    public modalController: ModalController,
    public _barcodeScanner: BarcodeScanner
  ) {}

  ngOnInit() {
    // this.id = this.activatedRoute.snapshot.paramMap.get("id")
    this.id = localStorage.getItem("adminId");
    console.log(this.id)
    this.getAccount(this.id);
  }

  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }

  openScanner(){
     this._barcodeScanner.scan({
      preferFrontCamera:true
     })
  }

  getAccount(accountId) {
    this._accountService.getAccount(accountId).subscribe((resp) => {
      this.account = resp.object.response;
    });
  }
}
