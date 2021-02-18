import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../../providers/account.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.page.html',
  styleUrls: ['./ledger.page.scss'],
})

export class LedgerPageModel implements OnInit {

  inventory:any = [];
  public date= new Date();

  constructor(
    private _accountService: AccountService, 
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.getInventory();
  }

  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }

  getInventory(){
    let startDate =  "02-02-2021", endDate = "02-02-2021";
    this._accountService.getDateInventory(startDate, endDate).subscribe((resp) => {
      this.inventory = resp.response;
    });
  }

}
