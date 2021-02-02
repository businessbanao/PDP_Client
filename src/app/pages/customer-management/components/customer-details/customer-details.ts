import { Component, ViewChild, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ProductService } from "../../../../providers/product.services";
import { ToastController } from "@ionic/angular";
import { IonInfiniteScroll } from "@ionic/angular";
import { UserServices } from "../../../../providers/user.services";

@Component({
  selector: "page-customer-details",
  templateUrl: "customer-details.html",
  styleUrls: ["./customer-details.scss"],
})
export class CustomerDetailsPage implements OnInit {
  public customerData: any = {
    fullName: "",
    CustomerImage: "",
    email: "",
    mobile: "",
    city: "",
    balance: 0,
  };

  public isToggled: boolean;

  constructor(
    public toastController: ToastController,
    private _ProductService: ProductService,
    private Router: Router,
    private _userServices: UserServices,
    private route: ActivatedRoute
  ) {}

  public updateStatus() {
    console.log("Toggled: " + this.isToggled);
    this._userServices
      .customerAction(this.customerData._id, {
        isAccountActive: this.isToggled,
      })
      .subscribe(async (results: any) => {
        console.log(results, "res", results.isAccountActive, this.isToggled);

        if (results.nModified == 1) {
          // const toast = await this.toastController.create({
          //   message: 'Status Updated Successfully',
          //    duration: 3000,
          //         color:'secondary',
          //   position: 'bottom',
          //   animated: true,
          // });
          // toast.present();
          this.fetchCustomerDetails(this.customerData._id);
        }
      });
  }

  public searchproductList: any = [];
  ngOnInit() {
    console.log(this.route.snapshot.params);
    let customerId = this.route.snapshot.params.id;
    this.fetchCustomerDetails(customerId);
  }

  profileLabel(name) {
    if (name) {
      let Name = name.split(" ");
      let first = Name[0].charAt(0).toUpperCase();
      let last = Name.length >= 2 ? Name[1].charAt(0).toUpperCase() : "";
      return first + last;
    }
  }

  fetchCustomerDetails(customerId) {
    this._userServices
      .getCustomerDetails(customerId)
      .subscribe((results: any) => {
        this.customerData = results[0];
        this.isToggled = this.customerData.isAccountActive;
        console.log(results, "res", this.customerData);
        this.customerData["balance"] = this.customerData.wallet.reduce(
          (a, b) => +a + +b.amount,
          0
        );
        this.customerData["label"] = this.profileLabel(
          this.customerData.fullName
        );
      });
  }
}
