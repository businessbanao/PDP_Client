import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountService } from "../../../../providers/account.service";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { ModalController, ToastController } from "@ionic/angular";
import { AccountLedgerPageModel } from "../account_ledger/account_ledger.page";

@Component({
  selector: "app-account",
  templateUrl: "./account.page.html",
  styleUrls: ["./account.page.scss"],
})
export class AccountPageModel implements OnInit {
  public finance: string;
  public responseStr: string;
  public acc_search;
  accounts:any = [];
  accountsInventory:any = [];
  accountForm: FormGroup;
  public isEditMode: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _accountService: AccountService,
    private _formBuilder: FormBuilder,
    public modalController: ModalController,
    public toast:ToastController
  ) {}

  ngOnInit() {
    this.finance = this.activatedRoute.snapshot.paramMap.get("id");
    this.getAccounts();
    this.initAccountForm();
  }

  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }

  initAccountForm() {
    this.accountForm = this._formBuilder.group({
      account_name: new FormControl(),
      category: new FormControl(),
      description: new FormControl(),
      id: new FormControl(""),
    });
  }

  editAccount(data) {
   

    this.accountForm.patchValue(data);
    this.accountForm.get("id").setValue(data._id);
    this.isEditMode = true;

     var elmntToView = document.getElementById("top");
    console.log(elmntToView)
    elmntToView.scrollIntoView();
    
  }

  cancelUpdate(){
    this.accountForm.reset();
    this.isEditMode = false;
  }
   

  createAccount(payload: FormGroup) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    formData["userId"] = localStorage.getItem("adminId");
    this._accountService.createAccount(formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      let toast = await this.toast.create({
        message:"created Successfully",
        color:'success',
        duration:2000
      })
      toast.present();
      this.accountForm.reset();
      this.getAccounts();
    });
  }

  updateAccount(payload) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    let id = this.accountForm.get("id").value;
    this._accountService.updateAccount(id, formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      let toast = await this.toast.create({
        message:"Updated Successfully",
        color:'success',
        duration:2000
      })
      toast.present();
      this.accountForm.reset();
      this.getAccounts();
    });
    this.isEditMode = false;
  }

  deleteAccount(id) {
    this._accountService.deleteAccount(id).subscribe(async (resp) => {
      this.responseStr = resp.response;
      this.accountForm.reset();
      this.getAccounts();
      let toast = await this.toast.create({
        message:"deleted Successfully",
        color:'success',
        duration:2000
      })
      toast.present();
    });
    this.isEditMode = false;
    
  }

  getAccountInventory(accountId) {
    // show model and pass Id here instead of below code
    this._accountService.getAccountInventory(accountId).subscribe((resp) => {
      this.accountsInventory = resp.response;
      debugger;
    });
  }

  async openLedgerModal(id) {
    const modal = await this.modalController.create({
      component: AccountLedgerPageModel,
      componentProps: {
        id: id,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {});
    return await modal.present();
  }

  getAccounts() {
    this._accountService
      .getAccount(localStorage.getItem("adminId"))
      .subscribe((resp) => {
        this.accounts = resp.response;
      });
  }


  searchAccount(){
    if(this.acc_search.length > 2){
      this._accountService.searchAccout(this.acc_search, localStorage.getItem('adminId')).subscribe((resp) => {
        this.accounts = resp.response;
      });
    } else if(this.acc_search.length == 0){
      this.getAccounts();
    }
  }
  // searchAccount(){
  //   alert(account);
  // }
}
