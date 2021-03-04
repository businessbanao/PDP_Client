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

  inventory:any = [];
  public monthYear;
  incomingTotal;
  outgoingTotal;

  constructor(
    private _datePipe: DatePipe,
    private _accountService: AccountService, 
    public modalController: ModalController
  ) {}

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
      this.inventory = resp.response;
      // resp.response.filter(invntry => invntry.inventryType == "credit");
      // resp.response.array.forEach(element => {
      //   this.inventory[""] = element.amount
      // });
    });
  }

}
