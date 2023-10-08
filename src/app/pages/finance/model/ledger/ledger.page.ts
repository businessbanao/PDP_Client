import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../../providers/account.service';
import { ModalController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { FinanceService } from '../../../../providers/finance.service';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.page.html',
  styleUrls: ['./ledger.page.scss'],
  providers: [DatePipe]
})

export class LedgerPageModel implements OnInit {

  inventoryList: any = [];
  monthlyInventoryList: any[];
  public monthYear;
  totalIncoming: number = 0;
  totalOutgoing: number = 0;
  newInventoryList: any = [];
  public dateFilter;

  constructor(
    private _datePipe: DatePipe,
    private _accountService: AccountService,
    public modalController: ModalController,
    private _financeService: FinanceService,
  ) {
    this.monthYear = this._datePipe.transform(new Date(), 'yyyy-MM');
    // console.log(this._datePipe.transform(new Date(),  'yyyy-MM'));
    this.dateFilter = this._datePipe.transform(new Date(), 'yyyy-MM-dd');

  }

  ngOnInit() {
    this.getInventory();
  }

  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }

  public groupAccounts;
  panelOpenState = false;
  getInventory() {
    let date = new Date(this.monthYear);
    var firstDay = this.dateFormater(new Date(date.getFullYear(), date.getMonth(), 1));
    var lastDay = this.dateFormater(new Date(date.getFullYear(), date.getMonth() + 1, 0));

    let payload = {
      startDate: firstDay,
      endDate: lastDay,
    };


    this._financeService
      .filterInventory(payload)
      .subscribe((resp: any) => {
        this.inventoryList = resp.object.response;


        this.inventoryList.filter(invntry => invntry.inventryType == "credit").forEach(element => {
          this.totalIncoming += Number(element.amount);
        });
        this.inventoryList.filter(invntry => invntry.inventryType == "debit").forEach(element => {
          this.totalOutgoing += Number(element.amount);
        });

        let groupResult = this.inventoryList.reduce(function (r, a) {
          r[a.account_id.account_name] = r[a.account_id.account_name] || [];
          r[a.account_id.account_name].push(a);
          return r;
        }, Object.create(null));


        console.log(groupResult, "group result");

        this.groupAccounts = Object.entries(groupResult);
      });
  }

  getTotal(items) {
    let total_value = 0;
    items.forEach(function (val) {

      total_value = total_value + parseInt(val.amount);

    });
    return total_value;
  }

  dateFormater(inputDate) {
    let tempDate = new Date(inputDate);
    let date =
      tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate();
    let month =
      tempDate.getMonth() + 1
        ? "0" + (tempDate.getMonth() + 1)
        : tempDate.getMonth() + 1;
    let year = tempDate.getFullYear();
    if (!isNaN(tempDate.getTime())) {
      return year + "-" + month + "-" + date;
    } else {
      return "";
    }
  }



}
