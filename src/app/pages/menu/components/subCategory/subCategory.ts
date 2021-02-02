import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from "../../../../providers/product.services";
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { ShopService } from '../../../../providers/shop.services';
import { AddSubCategoryPage } from "../../modal/subCategory/addSubCategory";
import { mainMenuPage } from "../../modal/mainMenu/mainMenu";

@Component({
  selector: 'page-subCategory',
  templateUrl: 'subCategory.html',
  styleUrls: ['./subCategory.scss'],
})
export class SubCategoryPage implements OnInit {

  public SubCategoryList: any = [];
  public searchWord: any
  constructor(public modalController: ModalController,
    private _shopService: ShopService,
    private _toast: ToastController,
    public alertController: AlertController
  ) {

  }

  public searchproductList:any=[]
   ngOnInit() {

    this.getSubCategoryList();
  }

  getSubCategoryList(event = this.refershDefault) {
    this._shopService.listSubCategory().subscribe((data: any) => {
      this.SubCategoryList = data.SubCategoryList;
      console.log(data, "--------------------------", this.SubCategoryList)
    });

    if (event) {
      setTimeout(() => {
        console.log('Async operation has ended');
        event.target.complete();
      }, 1000);

    }
  }

  async openAddProductToCategory(categoryId){

    const modal = await this.modalController.create({
      component: mainMenuPage,
      componentProps: {
        "categoryId": categoryId
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned, "data")
      // if (dataReturned !== null) {
      this.getSubCategoryList();
      // }
    });

     await modal.present();
    this.getSubCategoryList();
    return
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
      component: AddSubCategoryPage,

    });

    modal.onDidDismiss().then((dataReturned) => {
      // if (dataReturned !== null) {
      this.getSubCategoryList()
      // }
    });

    return await modal.present();
  }



  DeleteSubCategory(categoryId) {
    this._shopService.deleteSubCategory(categoryId).subscribe(async (data: any) => {
      // this.SubCategoryList = data
      console.log(data);
      if (data) {
        this.getSubCategoryList();
        const toast = await this._toast.create({
          message: 'Sub Category has been Deleted Successfully',
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
      header: 'Delete Category ?',
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
            this.DeleteSubCategory(id)
          }
        }
      ]
    });

    await alert.present();
  }

  async openEditProductModal(data) {
    const modal = await this.modalController.create({
      component: AddSubCategoryPage,
      componentProps: {
        "editData": data
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned, "data")
      // if (dataReturned !== null) {
      this.getSubCategoryList();
      // }
    });

    return await modal.present();
  }

}
