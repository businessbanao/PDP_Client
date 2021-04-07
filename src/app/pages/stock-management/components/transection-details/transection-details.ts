import { Component, ViewChild, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ProductService } from "../../../../providers/product.services";
import { ToastController } from "@ionic/angular";
import { IonInfiniteScroll } from "@ionic/angular";
import { UserServices } from '../../../../providers/user.services';
import { FormControl, FormGroup } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";
import { ValueAccessor } from "@ionic/angular/directives/control-value-accessors/value-accessor";

@Component({
  selector: "page-transection-details",
  templateUrl: "transection-details.html",
  styleUrls: ["./transection-details.scss"],
})
export class TransectionDetailsPage implements OnInit {
  public id;
  public transectionData: any;
  public total = 0;

  public isToggled: boolean;
  public data: any
  constructor(
    public toastController: ToastController,
    private _ProductService: ProductService,
    public alertController: AlertController,
    private Router: Router,
    private user: UserServices,
    private route: ActivatedRoute,
    public modalController: ModalController
  ) { }

  async closeModal() {
    const onClosedData: string = "success";
    await this.modalController.dismiss(onClosedData);
  }
  ngOnInit() {
    // console.log(this.route.snapshot.params);
    // this.id = this.route.snapshot.params;

    if (this.data && this.data._id) {
      // debugger
      this.fetchTransectionDetails(this.data._id);
    }
  }

  fetchTransectionDetails(id) {
    this.id = this.user.getStockTransectionDetails(id)
    this.user.getStockTransectionDetails(id).subscribe((result: any) => {
      // debugger
      this.transectionData = result.response;
      this.getTotal();
      // debugger
      console.log("itemName", this.transectionData);
      // debugger
    });
  }
  getTotal() {
    let self = this;
    this.transectionData.forEach(function (val) {
      self.total = self.total + val.useItem_count;

    })
  }

}
