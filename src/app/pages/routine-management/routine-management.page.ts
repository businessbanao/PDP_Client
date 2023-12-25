import { Component, OnInit } from "@angular/core";
import { RoutineManagementService } from "../../providers/routine-management.service";
import { DatePipe } from "@angular/common";
import { ActionSheetController, ModalController } from "@ionic/angular";
import { AddEditRoutineModel } from "./model/addEditRoutine/addEditRoutine.page";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-routineManagement",
  templateUrl: "./routine-management.page.html",
  styleUrls: ["./routine-management.page.scss"],
  providers: [DatePipe]
})


export class RoutineManagementPage implements OnInit {


  public routineList = [];


  constructor(
    private _routineManagementService: RoutineManagementService,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController
  ) {

  }

  ngOnInit() {
    this.getRoutines();
  }

  getRoutines() {
    this._routineManagementService.getRoutine(localStorage.getItem('adminId')).subscribe(resp => {
      this.routineList = resp.object.response;
    });
  }
 

  async addRoutineModal() {
    const modal = await this.modalController.create({
      component: AddEditRoutineModel
    });
    modal.onDidDismiss().then(dataReturned => {
      if (dataReturned) {
        this.getRoutines();
      }
    });
    return await modal.present();
  }


  

}
