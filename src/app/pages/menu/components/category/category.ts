import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from "../../../../providers/product.services";
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { ShopService } from '../../../../providers/shop.services';
import { AddCategoryPage  } from "../../modal/category/addCategory";

@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
  styleUrls: ['./category.scss'],
})
export class CategoryPage implements OnInit {

  public categoryList: any = []
  public searchWord: any
  constructor(public modalController: ModalController,
    private _shopService: ShopService,
    private _toast: ToastController,
    public alertController: AlertController
  ) {

   }

  public searchproductList:any=[]
   ngOnInit() {
    this.getCategoryList();
  }

  getCategoryList(event = this.refershDefault) {
    this._shopService.listCategory().subscribe((data: any) => {
      this.categoryList = data.CategoryList;
      console.log(data,"--------------------------",this.categoryList);


      if (event) { }
      setTimeout(() => {
        console.log('Async operation has ended');
        event.target.complete();
      }, 1000);

    });
  }

  public refershDefault = {
    target: {
      complete: function () {
        return true
      }
    }
  }



  async openAddShopModal() {
    const modal = await this.modalController.create({
      component: AddCategoryPage,

    });

    modal.onDidDismiss().then((dataReturned) => {
      // if (dataReturned !== null) {
        this.getCategoryList()
      // }
    });

    return await modal.present();
  }



  DeleteCategory(categoryId) {
    this._shopService.deleteCategory(categoryId).subscribe(async (data: any) => {
      // this.categoryList = data
      console.log(data);
      if (data) {
        this.getCategoryList();
        const toast = await this._toast.create({
          message: 'Category has been Deleted Successfully',
           duration: 3000,
                color:'secondary',
          position: 'bottom',
          animated: true,
        });
        toast.present();
      }
    });
  }

  async deleteAlertConfirm(id) {
    const alert = await this.alertController.create({
      header: 'Delete Shop ?',
      message: 'Are You Sure, you want to delete this Category ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Delete',
          handler: () => {
            console.log('deleted Confirmed');
            this.DeleteCategory(id)
          }
        }
      ]
    });

    await alert.present();
  }

  async openEditProductModal(data) {
    const modal = await this.modalController.create({
      component: AddCategoryPage,
      componentProps: {
        "editData": data
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned,"data")
      // if (dataReturned !== null) {
        this.getCategoryList();
      // }
    });

    return await modal.present();
  }

}
