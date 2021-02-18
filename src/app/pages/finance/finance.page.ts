import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FinanceService } from '../../providers/finance.service';
import { FormBuilder, FormGroup, FormControl, NgForm } from '@angular/forms';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AccountPageModel } from "./model/account/account.page";
import { AccountService } from '../../providers/account.service';
import { LedgerPageModel } from './model/ledger/ledger.page';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.page.html',
  styleUrls: ['./finance.page.scss'],
})

export class FinancePage implements OnInit {

  today:any;
  selectedDate:any;
  public dateFilter;
  public accountFilter = "";
  public inventryTypeFilter="all"
  prevInventoryList:any = [];

  public isEditMode: boolean;
  public finance: string;
  public responseStr: string;
  public inventory_data: any;
  inventoryList:any = [];
  inventoryForm: FormGroup;
  tabName:string = "mannual_entry";
  accounts: any;
 /**
  accounts: any =  [
    { name: "Food",   id :'6018524ed041c31c261227cd'},
    { name: 'Travel', id :'6011524ed041c31c561227cd'},
    { name: "Social", id :'6018564ed041c31c261227cd' },
    { name: "Other",  id :'6018524ed071c31c261227cd' }
  ]
  */

  Users: any =  [
    { name: "Shashwat",   id :'6018524ed041c31c261227cd'},
    { name: 'Shivam', id :'6011524ed041c31c561227cd'},
    { name: "Sandip", id :'6018564ed041c31c261227cd' }
  ]  

  constructor(private activatedRoute: ActivatedRoute, 
      private _financeService: FinanceService,
      private _accountService: AccountService, 
      private _formBuilder: FormBuilder, 
      public actionSheetController: ActionSheetController,
      public modalController: ModalController,
      ) { 
        this.today = new Date().toISOString();
  }

  ngOnInit() {
    this.finance = this.activatedRoute.snapshot.paramMap.get('id');
    this.getInventory();
    this.initinventoryForm();
    this.getAccounts();
  }

  initinventoryForm() {
    this.inventoryForm = this._formBuilder.group({
      account_id: new FormControl(),
      inventryType: new FormControl(),
      userId: new FormControl(),
      amount: new FormControl(),
      description: new FormControl(),
      date: new FormControl(),
      id: new FormControl('')
    });
  }

  createInventory(payload: FormGroup) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    formData['userId'] = localStorage.getItem('adminId');
    this._financeService.createInventory(formData).subscribe((resp) => {
     this.responseStr = resp.response;
     this.tabName = "inventory_list";
      this.isEditMode = false;
      this.getInventory();
   });
  }

  editInventory(data) {
    this.tabName = "mannual_entry";
    this.isEditMode = true;
    this.inventoryForm.patchValue(data);
    this.inventoryForm.get('id').setValue(data._id);
    this.inventoryForm.get('date').setValue(data.date.slice(0,10));
  }

  updateInventory(payload: FormGroup) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    let id = this.inventoryForm.get('id').value;
    this._financeService.updateInventory(id, formData).subscribe((resp) => {
      this.responseStr = resp.response;
      this.tabName = "inventory_list";
      this.isEditMode = false;
      this.getInventory();
    });
  }

  deleteInventory(id) {
    this._financeService.deleteInventory(id).subscribe((resp) => {
      this.responseStr = resp.response;
      this.tabName = "inventory_list";
      this.isEditMode = false;
      this.getInventory();
    });
  }

  getInventory() {
    this._financeService.getInventory(this.page).subscribe((resp) => {
      this.inventoryList = resp.response;
    });
  }

  applyFilter(){
    let date = this.dateFormater(this.dateFilter);
    this._financeService.filterInventory(date, date, this.accountFilter, this.inventryTypeFilter).subscribe((resp:any) => {
      this.inventoryList = resp.response;
    });
  }

  dateFormater(inputDate) {
    let tempDate = new Date(inputDate);
    let date = tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate();
    let month = (tempDate.getMonth() + 1) ? "0" + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1;
    let year = tempDate.getFullYear();
    if (!isNaN(tempDate.getTime())) {
        return month + '-' + date + '-' + year;
    } else {
      return "";
    }
  }

  async presentActionSheet() {
   this.isEditMode = false;
   const actionSheet = await this.actionSheetController.create({
      header: "",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Accounts",
          role: "destructive",
          icon: "key-outline",
          handler: () => {
            this.openAaccountsModal();
          },
        },
        {
          text: "Ledger",
          role: "destructive",
          icon: "key-outline",
          handler: () => {
            this.openLedgerModal();
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async openAaccountsModal() {
    const modal = await this.modalController.create({
      component: AccountPageModel,
    });
    modal.onDidDismiss().then((dataReturned) => {});
    return await modal.present();
  }

  async openLedgerModal() {
    const modal = await this.modalController.create({
      component: LedgerPageModel,
    });
    modal.onDidDismiss().then((dataReturned) => {});
    return await modal.present();
  }

  segmentChanged(tabData: any) {
    if(this.tabName == 'mannual_entry' && this.isEditMode){
      this.isEditMode = true;
    } else{
      this.isEditMode = false;
      this.inventoryForm.reset();
    }
    this.tabName = tabData.detail.value;
  }

  getAccounts(){
    this._accountService.getAccount(localStorage.getItem('adminId')).subscribe((resp) => {
      this.accounts = resp.response;
    });
  }


  public page = {
    limit: 5,
    skip: 0,
  };

  loadData(event) {
    this.page.limit = this.page.limit;
    this.page.skip = this.page.skip + 5;
    this._financeService.getInventory(this.page).subscribe((resp) => {
      // this.inventoryList = resp.response;
    
        if (event) {
          setTimeout(() => {
            console.log("Done");
            event.target.complete();
            this.inventoryList = this.inventoryList.concat(resp.response);
            // this.getAvgReview();
          }, 1800);
        }
      });
  }
  
}
