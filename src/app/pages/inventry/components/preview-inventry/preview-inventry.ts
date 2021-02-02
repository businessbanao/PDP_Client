import { Component, OnInit, Input } from "@angular/core";
import {
  ModalController,
  ActionSheetController,
  AlertController,
} from "@ionic/angular";

import { ShopService } from "../../../../providers/shop.services";
import { ToastController } from "@ionic/angular";


@Component({
  selector: "page-preview-inventry",
  templateUrl: "preview-inventry.html",
  styleUrls: ["./preview-inventry.scss"],
})
export class PreviewInventryPage  {
  public inventryList=[]
  public OutgoinginventryList=[]
  public total = 0;
  public type;


  ngOnInit(): void {

  }


  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }

  constructor(
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private modalController: ModalController,
  ) {}


}

