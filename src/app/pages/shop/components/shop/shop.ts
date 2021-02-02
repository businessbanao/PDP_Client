import { Component, ViewChild, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ShopService } from "../../../../providers/shop.services";
import { ModalController, AlertController, IonSearchbar } from "@ionic/angular";
import { AddShopPage } from "../../modal/addshop";
import { ToastController } from "@ionic/angular";
import { UserServices } from "../../../../providers/user.services";
import { AddProductToShopPage } from "../../modal/addProductToShop/addProductToShop";
import { ActionSheetController } from "@ionic/angular";

@Component({
  selector: "page-shop",
  templateUrl: "shop.html",
  styleUrls: ["./shop.scss"],
})
export class ShopPage implements OnInit {
  public storeList: any = [];
  public isDataLoaded: Boolean = false;
  public showSearchBox: Boolean = false;
  public searchWord: any;
  @ViewChild("autofocus", { static: false }) searchbar: IonSearchbar;
  public refershDefault = {
    target: {
      complete: function () {
        return true;
      },
    },
  };

  public adminProfile:any;
  constructor(
    public modalController: ModalController,
    private _shopService: ShopService,
    private _userServices: UserServices,
    private _toast: ToastController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController
  ) {}

  public searchproductList: any = [];
  ngOnInit() {
    this.getStoreList();
    this.getAdminProfile();

  }

  getAdminProfile(){
    this._userServices
    .getAdminProfile(
      localStorage.getItem("adminId")
    )
    .subscribe((response: any) => {
      this.adminProfile = response['data'];
      console.log(response['data']);
    });
  }


  public selectetobj = {
    selected: false,
    id: "",
  };
  async presentActionSheet(list) {
    console.log(this.adminProfile,"this.adminProfile",this.adminProfile.isShopOpen);
    this.selectetobj.selected = true;
    this.selectetobj.id = list._id;
    const actionSheet = await this.actionSheetController.create({
      header: list.storeName,

      cssClass: "actionsheet",
      buttons: [
        {
          text: (this.adminProfile.isShopOpen) ? "Shut Down My Shop" : "Open My Shop",
          role: "destructive",
          icon: "lock-closed-outline",
          handler: () => {
            this.shutDownShop();
          },
        },
        {
          text: "Add Product",
          role: "destructive",
          icon: "add",
          handler: () => {
            this.openAddProductToShopModal(list._id);
            this.selectetobj.selected = false;
            this.selectetobj.id = "";
          },
        },
        {
          text: "Delete Shop",
          icon: "trash",
          handler: () => {
            this.deleteAlertConfirm(list);
            this.selectetobj.selected = false;
            this.selectetobj.id = "";
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            this.selectetobj.selected = false;
            this.selectetobj.id = "";
            console.log("Cancel clicked");
          },
        },
      ],
    });
    await actionSheet.present();
  }

  shutDownShop() {
    this._userServices
      .updateAdminProfile(
        {
          isShopOpen: !this.adminProfile.isShopOpen,
        },
        localStorage.getItem("adminId")
      )
      .subscribe(async (data: any) => {

        if (data.nModified == 1 && !this.adminProfile.isShopOpen) {
          const toast = await this._toast.create({
            message: "Shop Open Sucessfully",
            duration: 3000,
            color: "secondary",
            position: "bottom",
            animated: true,
          });
          toast.present();
        }


        if (data.nModified == 1 && this.adminProfile.isShopOpen) {
          const toast = await this._toast.create({
            message: "Shop Closed Sucessfully",
            duration: 3000,
            color: "secondary",
            position: "bottom",
            animated: true,
          });
          toast.present();
        }

        this.getAdminProfile()

        console.log(data);
      });
  }

  getStoreList(event = this.refershDefault) {
    this._shopService.fetchStoreList().subscribe((data: any) => {
      this.storeList = data.storeList;
      console.log(this.storeList);
      this.isDataLoaded = true;
      this.searchWord = "";
      if (event) {
      }
      setTimeout(() => {
        console.log("Async operation has ended");
        event.target.complete();
      }, 1000);
    });
  }

  search(query) {
    if (query.target.value.length >= 1) {
      this._userServices
        .search({
          search: query.target.value,
          filter: "Store",
        })
        .subscribe((data: any) => {
          console.log(data, "data");
          this.storeList = data.ShopList;
        });
    }

    if (query.target.value.length == 0) {
      this.getStoreList();
    }
  }

  showOptions() {}

  async openAddShopModal() {
    const modal = await this.modalController.create({
      component: AddShopPage,
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.getStoreList();
      }
    });

    return await modal.present();
  }

  async openAddProductToShopModal(storeId) {
    const modal = await this.modalController.create({
      component: AddProductToShopPage,
      componentProps: {
        storeId: storeId,
      },
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.getStoreList();
      }
    });

    return await modal.present();
  }

  DeleteShop(storeId) {
    this._shopService.deleteShop(storeId).subscribe(async (data: any) => {
      // this.storeList = data
      console.log(data);
      if (data) {
        this.getStoreList();
        const toast = await this._toast.create({
          message: "Shop has been Deleted Successfully",
          duration: 3000,
          color: "secondary",
          position: "bottom",
          animated: true,
        });
        toast.present();
      }
    });
  }

  async deleteAlertConfirm(list) {
    const alert = await this.alertController.create({
      header: "Delete Shop ?",
      message: `Are You Sure, you want to delete ${list.storeName} (${list.city}) Shop ?`,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
            this.getStoreList();
          },
        },
        {
          text: "Delete",
          handler: () => {
            console.log("deleted Confirmed");
            this.DeleteShop(list._id);
          },
        },
      ],
    });

    await alert.present();
  }

  enableSearch() {
    this.showSearchBox = true;
    setTimeout(() => this.searchbar.setFocus(), 500);
  }

  backToNormal() {
    this.showSearchBox = false;
    this.getStoreList();
  }
}
