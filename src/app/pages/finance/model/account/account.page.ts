import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../../providers/account.service';
import { FormBuilder, FormGroup, FormControl, NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})

export class AccountPageModel implements OnInit {

  public finance: string;
  public responseStr: string;
  accounts:any = [];
  accountForm: FormGroup;

  constructor(private activatedRoute: ActivatedRoute, 
    private _accountService: AccountService, 
    private _formBuilder: FormBuilder,
    public modalController: ModalController
    ) { }

  ngOnInit() {
    this.finance = this.activatedRoute.snapshot.paramMap.get('id');
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
      id: new FormControl('')
    });
   }

   editAccount(data){
    debugger;
    this.accountForm.patchValue(data);
    this.accountForm.get('id').setValue(data._id);
  }

  createAccount(payload: FormGroup){
   let formData = JSON.parse(JSON.stringify(payload.value));
   formData['userId'] = localStorage.getItem('adminId');
    this._accountService.createAccount(formData).subscribe((resp) => {
     this.responseStr = resp.response;
     this.accountForm.reset();
     this.getAccounts();
   });
  }

  updateAccount(payload){
    let formData = JSON.parse(JSON.stringify(payload.value));
    let id = this.accountForm.get('id').value;
    this._accountService.updateAccount(id, formData).subscribe((resp) => {
      this.responseStr = resp.response;
      this.accountForm.reset();
      this.getAccounts();
    });
  }

  deleteAccount(id){
    this._accountService.deleteAccount(id).subscribe((resp) => {
      this.responseStr = resp.response;
      this.getAccounts();
    });
  }

  getAccounts(){
    this._accountService.getAccount(localStorage.getItem('adminId')).subscribe((resp) => {
      this.accounts = resp.response;
    });
  }

}
