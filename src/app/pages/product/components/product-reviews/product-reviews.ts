// import { environment } from './../../../../../environments/environment.prod';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from "../../../../providers/product.services";
import { ToastController, ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import { AddProductPage } from "../../modal/addProduct";
import { ShopService } from '../../../../providers/shop.services';
import { FormControl } from '@angular/forms';
import { UserServices } from '../../../../providers/user.services';
import { environment } from "../../../../../environments/environment";

@Component({
  selector: 'page-product-reviews',
  templateUrl: 'product-reviews.html',
  styleUrls: ['./product-reviews.scss'],
})
export class ProductReviewsPage implements OnInit {

  public baseUrl: String = environment.baseUrl + '/'
  // public baseUrl = 'http://5afcaa1d.ngrok.io/'
  public productList: any = [];
  public reviewList: any = [];
  public storeList: any = [];
  public searchWord: any;
  tabs = ['Product List', 'Product Review List'];
  selected = new FormControl(0);


  constructor(public modalController: ModalController,
    private _shopService: ShopService,
    private _userServices: UserServices,
    private _toast: ToastController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    private route: ActivatedRoute,
  ) { }

  public searchproductList:any=[]
   ngOnInit() {
    let productId = this.route.snapshot.params.id;
    console.log(productId, "productId");
    this.fetchProductDetails(productId);
    // console.log("selected", this.selected)
  }

  public refershDefault = {
    target: {
      complete: function () {
        return true
      }
    }
  }

  getColor(index: number, rating) {
    if (index > rating) {
      return "grey"
    }

    return "gold"
  }

  fetchProductDetails(productId) {
    this._shopService.fetchProductDetails(productId).subscribe((results: any) => {
      this.reviewList = results['reviewData'];
    });
  }

   
}
