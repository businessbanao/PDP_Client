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
      this.crTotal = this.getInventoryTotal(this.creditInventory);
      this.dbtTotal = this.getInventoryTotal(this.debitInventory); 
    });
  }

  getInventoryTotal(inventory: any){
    let total = 0;
    for(let i = 0; i<inventory.length; i++ ){
      total+= parseInt(inventory[i].amount);
    }
    return total;
  }

}
