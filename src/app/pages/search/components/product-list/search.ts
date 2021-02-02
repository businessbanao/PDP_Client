import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from "../../../../providers/product.services";
import { ToastController, ModalController, AlertController } from '@ionic/angular';
import { ShopService } from '../../../../providers/shop.services';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  styleUrls: ['./search.scss'],
})
export class SearchPage implements OnInit {


  public productList: any = [];
  public reviewList: any = [];
  public searchWord: any;
  tabs = ['Product List', 'Product Review List'];
  selected = new FormControl(0);


  constructor(public modalController: ModalController,
    private _shopService: ShopService,
    private _toast: ToastController,
    private route: ActivatedRoute,
    public alertController: AlertController

  ) { }




  public searchproductList:any=[]
   ngOnInit() {
    let query = this.route.snapshot.params.query;
    this.getProductList(query);
    console.log("query", query)
  }

  getProductList(query) {
    this._shopService.fetchProductList({
      shopId: 'all'
    },{
      limit:500,
      skip:0
    }).subscribe((data: any) => {
      // this.productList = data;

      this.productList = data.filter((val) => {
        console.log(val, query, val.productName == query)
        return val.productName.includes(query);
      })
      console.log(data)
    });
  }




}
