import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../../providers/account.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-account_ledger',
  templateUrl: './account_ledger.page.html',
  styleUrls: ['./account_ledger.page.scss'],
})

export class AccountLedgerPageModel implements OnInit {

  public acc_ledger: string;
  accountsInventory:any = [];
  creditInventory:any = [];
  debitInventory:any = [];
  crTotal:number = 0 ;
  dbtTotal: number = 0;
  public id;

  constructor(private activatedRoute: ActivatedRoute, 
    private _accountService: AccountService, 
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.acc_ledger = this.activatedRoute.snapshot.paramMap.get('id');
    this.getAccountInventory(this.id);
  }

  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }

  getAccountInventory(accountId){
    this._accountService.getAccountInventory(accountId).subscribe((resp) => {
      this.accountsInventory = resp.response;
      this.creditInventory = this.accountsInventory.filter(inventory => inventory.inventryType == "credit");
      this.debitInventory = this.accountsInventory.filter(inventory => inventory.inventryType == "debit");
      this.creditInventory.forEach(element => {
        this.crTotal += Number(element.amount);
      });
      this.debitInventory.forEach(element => {
        this.dbtTotal += Number(element.amount);
      });
    });
  }

}
