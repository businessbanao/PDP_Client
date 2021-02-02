import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServices } from "../../providers/user.services";


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  styleUrls: ['./profile.scss'],
})
export class ProfilePage implements OnInit {


  public UserServices: any={
    _id:'',
    email:'',
    mobile:''
  }

  userData:any
  public searchWord: any
  constructor(
    private _UserServices: UserServices
  ) { }

  public searchproductList:any=[]
   ngOnInit() {
    this.getCustomerProfile();
  }

  getCustomerProfile() {
    // this._UserServices.getCustomerDetails(localStorage.getItem('userId')).subscribe((data: any) => {
    //   this.UserServices = data;
    //   console.log(this.UserServices,"---")
    // });
  }

 
}
