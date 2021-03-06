import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../../providers/account.service';
import { ModalController } from '@ionic/angular';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.page.html',
  styleUrls: ['./ledger.page.scss'],
  providers:[DatePipe]
})

export class LedgerPageModel implements OnInit {

  inventoryList:any = [];
  public monthYear;
  totalIncoming: number = 0;
  totalOutgoing: number = 0;
  newInventoryList:any = [];

  constructor(
    private _datePipe: DatePipe,
    private _accountService: AccountService, 
    public modalController: ModalController
  ) {
    this.monthYear = this._datePipe.transform(new Date(),  'yyyy-MM');
    // console.log(this._datePipe.transform(new Date(),  'yyyy-MM'));
  }

  ngOnInit() {
    this.getInventory();
  }

  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }

  getInventory(){
    let startDate =  this.monthYear.split("-")[1]+"-01-"+this.monthYear.split("-")[0], 
        endDate = this.monthYear.split("-")[1]+"-31-"+this.monthYear.split("-")[0];
    this._accountService.getDateInventory(startDate, endDate).subscribe((resp) => {
      this.inventoryList = resp.response;
      this.inventoryList.filter(invntry => invntry.inventryType == "credit").forEach(element => {
        this.totalIncoming += Number(element.amount);
      });
      this.inventoryList.filter(invntry => invntry.inventryType == "debit").forEach(element => {
        this.totalOutgoing += Number(element.amount);
      });
      
    });
  }

}
