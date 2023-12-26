import { Component, OnInit } from "@angular/core";
import { RoutineManagementService } from "../../providers/routine-management.service";
import { DatePipe } from "@angular/common";
import { ActionSheetController, ModalController, ToastController } from "@ionic/angular";
import { AddEditRoutineModel } from "./model/addEditRoutine/addEditRoutine.page";
import { AlertController } from "@ionic/angular";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-routineManagement",
  templateUrl: "./routine-management.page.html",
  styleUrls: ["./routine-management.page.scss"],
  providers: [DatePipe],
})
export class RoutineManagementPage implements OnInit {
  public routineList = [];
  public selectedDate = this.formatDate(new Date());

  constructor(
    private _routineManagementService: RoutineManagementService,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    private toastCtrl: ToastController
  ) {}

  private formatDate(date: Date): string {
    // Format the date as 'YYYY-MM-DD' (the format expected by the input type="date")
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  handelSubmit(form: NgForm): void {
    const formData = form.value;
    const body: any = {
      userId: localStorage.getItem("adminId"),
      routines: [],
    };

    Object.entries(formData).forEach((data) => {
      if (data[0] === "date") {
        body.date = data[1];
      } else {
        body.routines.push({
          routineId: data[0],
          completed: data[1],
        });
      }
    });
    this._routineManagementService
      .markDailyRoutineByDateUserId(body)
      .subscribe(async(resp) => {
        // alert(resp.object.message);
      const toast = await  this.toastCtrl.create({message: resp.object.message,duration:2000,position:"top"});
      toast.present()
      });
  }

  ngOnInit() {
    this.getRoutines();
    this.selectedDate = this.formatDate(new Date());
    this.getDailyRoutineListByDate(this.selectedDate);
  }

  getRoutines() {
    this._routineManagementService
      .getRoutine(localStorage.getItem("adminId"))
      .subscribe((resp) => {
        this.routineList = resp.object.response.map((routine: any) => {
          routine.completed = false;
          return routine;
        });
      });
  }

  getDailyRoutineListByDate(date: any) {
    this._routineManagementService
      .getDailyRoutineByDateUserId(localStorage.getItem("adminId"), date)
      .subscribe((resp) => {
        const data = resp.object.response;
        this.addMarkInRoutineList(data);
      });
  }

  addMarkInRoutineList(data: any): void {
    if (data && data.routines) {
      this.routineList = this.routineList.map((routine: any) => {
        const status: any = (data.routines as []).find(
          (dataItem: any) => dataItem.routineId === routine._id
        );

        routine.completed = status ? status.completed : false;
        return routine;
      });
    } else {
      this.routineList = this.routineList.map((routine: any) => {
        routine.completed = false;
        return routine;
      });
    }
  }

  async addRoutineModal() {
    const modal = await this.modalController.create({
      component: AddEditRoutineModel,
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned) {
        this.getRoutines();
      }
    });
    return await modal.present();
  }

  checkList(arr, period) {
    return arr.filter((item) => item.period == period).length == 0;
  }


  increaseDate() {
    var tomorrow = new Date(this.selectedDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let date = this.formatDate(tomorrow);
    this.selectedDate = date;
    this.getDailyRoutineListByDate(this.selectedDate);
  }

  decreaseDate() {
    var tomorrow = new Date(this.selectedDate);
    tomorrow.setDate(tomorrow.getDate() - 1);
    let date = this.formatDate(tomorrow);
    this.selectedDate = date;
    this.getDailyRoutineListByDate(this.selectedDate);
  }
}
