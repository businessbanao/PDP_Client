import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from "@angular/common";

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
  styleUrls: ['./menu.scss'],
})
export class MenuPage implements OnInit {


  public searchWord: any
  public backbtn;
  public title;
  constructor(private router: Router,
    private location: Location
  ) { }

  public searchproductList:any=[]
   ngOnInit() {

    console.log('this.router.url', this.router.url);
    // let url = this.router.url;
    // if(url.includes('main'))

  }

  myBackButton(){
    this.location.back();
  }

}
