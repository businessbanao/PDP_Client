import { Component, ViewChild, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UserServices } from "../../../../providers/user.services";
import {
  ToastController,
  AlertController,
  Platform,
  IonSearchbar,
} from "@ionic/angular";
import { IonInfiniteScroll } from "@ionic/angular";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { ShopService } from "../../../../providers/shop.services";
import { ActionSheetController } from "@ionic/angular";
import { timingSafeEqual } from "crypto";

@Component({
  selector: "page-customer",
  templateUrl: "customer.html",
  styleUrls: ["./customer.scss"],
})
export class CustomerPage implements OnInit {
  public customersList: any = [];
  public productList: any = [];
  public searchWord: String = "";
  public isDataLoaded: Boolean = false;
  constructor(
    public actionSheetController: ActionSheetController,
    public _toast: ToastController,
    private _userServices: UserServices,
    private Router: Router,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private _shopService: ShopService,
    private socialSharing: SocialSharing,
    public platform: Platform
  ) {}

  @ViewChild("autofocus", { static: false }) searchbar: IonSearchbar;
  @ViewChild(IonInfiniteScroll, null) infiniteScroll: IonInfiniteScroll;

  public searchproductList: any = [];
  ngOnInit() {
    this.getCustomerList();
    // this.getProductList();
    this.route.paramMap.subscribe((params) => {
      console.log(params, "params");
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(" "),
      map((value) => this._filter(value))
    );
  }

  myControl = new FormControl();
  options: string[] = ["One", "Two", "Three"];
  filteredOptions: Observable<string[]>;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  refersh(event) {
    this.resetPage();
    this.getCustomerList();
    if (event) {
    }
    setTimeout(() => {
      console.log("Async operation has ended");
      event.target.complete();
    }, 1000);
  }

  getCustomerList(event = this.refershDefault) {
    this._userServices.fetchCustomersList(this.page).subscribe((data: any) => {
      console.log(data, "data");
      if (data.length !== 0) {
        this.customersList = data.UserList;
        this.customersList.forEach((val) => {
          val["label"] = this.profileLabel(val.fullName);
        });
      }
      this.searchWord = "";
      this.isDataLoaded = true;
      if (event) {
      }
      setTimeout(() => {
        console.log("Async operation has ended");
        event.target.complete();
      }, 1000);
    });
  }

  search(query) {
    if (query.target.value.length >= 2) {
      this._userServices
        .search({
          search: query.target.value,
          filter: "Customer",
        })
        .subscribe((data: any) => {
          console.log(data, "data");
          this.customersList = data.CustomerList;
          this.customersList.forEach((val) => {
            val["label"] = this.profileLabel(val.fullName);
          });
        });
    }

    if (query.target.value.length == 0) {
      this.getCustomerList();
    }
  }

  public refershDefault = {
    target: {
      complete: function () {
        return true;
      },
    },
  };

  // getProductList() {
  //   this._shopService.fetchProductList({
  //     shopId: 'all'
  //   }).subscribe((data: any) => {
  //     this.productList = data;
  //     console.log(data)
  //   });
  // }

  public updateStatus(userId, status) {
    console.log("Toggled: " + userId, status);
    this._userServices
      .customerAction(userId, {
        isAccountActive: status,
      })
      .subscribe(async (results: any) => {
        console.log(results, "res");
        this.resetPage();
        this.getCustomerList();
        const toast = await this._toast.create({
          message: "Status Updated Successfully",
          duration: 3000,
          color: "secondary",
          position: "bottom",
          animated: true,
        });
        toast.present();
      });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Albums",
      buttons: [
        {
          text: "whats app",
          role: "destructive",
          icon: "trash",
          handler: () => {
            this.shareViaWhatsapp();
          },
        },
        {
          text: "facebook",
          icon: "share",
          handler: () => {
            this.shareViaFacebook();
          },
        },
        {
          text: "instagram",
          icon: "arrow-dropright-circle",
          handler: () => {
            this.shareViaInstagram();
          },
        },
        {
          text: "all share",
          icon: "heart",
          handler: () => {
            this.share();
          },
        },
        {
          text: "email",
          icon: "close",
          role: "cancel",
          handler: () => {
            this.shareViaEmail();
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async deleteAlertConfirm(userId, isAccountActive) {
    let statusLabel;
    let button;
    if (isAccountActive) {
      statusLabel = "Disable";
      button = [
        {
          text: "Disable",
          handler: () => {
            console.log("deleted Confirmed");
            this.updateStatus(userId, false);
          },
        },
      ];
    } else {
      statusLabel = "Enable";
      button = [
        {
          text: "Enable",
          role: "Enable",
          cssClass: "secondary",
          handler: (blah) => {
            this.updateStatus(userId, true);
            console.log("Confirm Cancel: blah");
          },
        },
      ];
    }

    const alert = await this.alertController.create({
      header: "Change User Status ?",
      message: `Are You Sure, you want to ${statusLabel} ?`,
      buttons: button,
    });

    await alert.present();
  }

  share() {
    this.platform.ready().then(async () => {
      await this.socialSharing
        .share("https://www.badhaobusiness.in/")
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
    });
  }

  submitSearch() {
    let query = this.myControl.value;
    this.Router.navigateByUrl("/search/" + query);
  }

  // Share Via Email
  shareViaEmail() {
    this.socialSharing
      .canShareViaEmail()
      .then(() => {
        this.platform.ready().then(() => {
          this.socialSharing.shareViaEmail("Body", "Subject", [
            "contact@badhaobusiness.in",
          ]);
        });
      })
      .catch((err) => {
        alert("Email not available");
      });
  }

  // Share Via WhatsApp
  shareViaWhatsapp() {
    this.socialSharing
      .shareViaWhatsApp(
        "Hello WhatsApp",
        null,
        "https://www.badhaobusiness.in/"
      )
      .then(() => {
        console.log("It works");
      })
      .catch(() => {
        alert("WhatsApp not available");
      });
  }

  // Share Via Facebook
  shareViaFacebook() {
    this.socialSharing
      .shareViaFacebook("Hello Friends", null, "https://www.badhaobusiness.in/")
      .then(() => {
        console.log("It works");
      })
      .catch(() => {
        alert("Facebook not available");
      });
  }

  // Share Via Twitter
  shareViaTwitter() {
    this.socialSharing
      .shareViaTwitter("Hello Twitter", null, "https://www.badhaobusiness.in/")
      .then(() => {
        console.log("It works");
      })
      .catch(() => {
        alert("Twitter not available");
      });
  }

  // Share Via Instagram
  shareViaInstagram() {
    this.socialSharing
      .shareViaInstagram("Hello Instagram", null)
      .then(() => {
        console.log("It works");
      })
      .catch(() => {
        alert("Instagram not available");
      });
  }

  // Share via SMS
  shareViaSMS() {
    this.socialSharing
      .shareViaSMS("https://www.badhaobusiness.in/", "8920832260")
      .then(() => {
        console.log("It works");
      })
      .catch(() => {
        alert("Not available");
      });
  }

  public showSearchBox: Boolean = false;
  enableSearch() {
    this.showSearchBox = true;
    setTimeout(() => this.searchbar.setFocus(), 500);
  }

  backToNormal() {
    this.showSearchBox = false;
    this.resetPage();
    this.getCustomerList();
  }

  profileLabel(name) {
    if (name) {
      let Name = name.split(" ");
      let first = Name[0].charAt(0).toUpperCase();
      let last = Name.length >= 2 ? Name[1].charAt(0).toUpperCase() : "";
      return first + last;
    }
  }

  public page = {
    limit: 20,
    skip: 0,
  };

  resetPage() {
    this.page = {
      limit: 20,
      skip: 0,
    };
  }

  loadMore(event) {
    this.page.limit = this.page.limit;
    this.page.skip = this.page.skip + 20;
    this._userServices.fetchCustomersList(this.page).subscribe((data: any) => {
      console.log(data, "data");

      if (event) {
        setTimeout(() => {
          console.log("Done");
          event.target.complete();
          this.customersList = this.customersList.concat(data.UserList);
          this.customersList.forEach((val) => {
            val["label"] = this.profileLabel(val.fullName);
          });
        }, 1800);
      }
    });
  }
}
