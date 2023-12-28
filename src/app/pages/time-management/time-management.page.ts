import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ActionSheetController, ModalController } from "@ionic/angular";
import { TimePageModel } from "./model/time/time.page";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { AlertController } from "@ionic/angular";
import { TimeManagementService } from "../../providers/time-management.service";
import { TaskManagementService } from "../../providers/task-management.service";

@Component({
  selector: "app-timeManagement",
  templateUrl: "./time-management.page.html",
  styleUrls: ["./time-management.page.scss"],
  providers: [DatePipe]
})
export class TimeManagementPage implements OnInit {
  public taskList: any = [];
  public highPrioritytaskList: any = [];
  public medPrioritytaskList: any = [];
  public lowPrioritytaskList: any = [];
  public startDate: String;
  public endDate: String;
  public dateFilter;
  public respMsg: String;
  public isEditMode: boolean;
  public taskForm: FormGroup;
  public detailsList = [];
  public TaskList = [];
  public status = '';
  public priority = '';

  public changeDate: any = new Date();
  public formatCurrentDate;

  constructor(
    private _timeManagementService: TimeManagementService,
    private datePipe: DatePipe,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    private _taskManagementService: TaskManagementService,

  ) {
    this.changeDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    // this.changeDate = this.changeDate.slice(0,10)
  }

  ngOnInit() {
    this.getTask();
  }

  getDatedTask() {
    let payload = {};

    if (this.status) {
      payload["status"] = this.status;
    }


    if (this.priority) {
      payload["priority"] = this.priority;
    }

    payload["date"] = this.dateFormater(this.changeDate);


    this._timeManagementService.getTime(payload).subscribe(resp => {
      this.detailsList = resp.object.response;
      this.detailsList.sort(function (a, b) {
        return a.duration_start_time.localeCompare(b.duration_start_time);
      });


    });
  }



  deleteTask(taskId) {
    let responseMsg: String;
    this._timeManagementService.deleteTime(taskId).subscribe(resp => {
      responseMsg = resp.error
        ? "Task Deletion Failed"
        : "Task Deleted Succesfully";
      if (!resp.error) {
        this.getTask();
      }
    });
  }

  getTask() {
    this.getDatedTask();
  }

  dateFormater(inputDate) {
    let tempDate = new Date(inputDate);
    let date =
      tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate();
    let month =
      tempDate.getMonth() + 1
        ? "0" + (tempDate.getMonth() + 1)
        : tempDate.getMonth() + 1;
    let year = tempDate.getFullYear();
    return isNaN(tempDate.getTime()) ? "" : year + "-" + month + "-" + date;
  }

  async openTaskModal() {
    const modal = await this.modalController.create({
      component: TimePageModel
    });
    modal.onDidDismiss().then(dataReturned => {
      if (dataReturned) {
        this.getTask();
      }
    });
    return await modal.present();
  }

  async editTaskModal(data: any) {
    const modal = await this.modalController.create({
      component: TimePageModel,
      componentProps: {
        editMode: this.isEditMode,
        data: data
      }
    });
    modal.onDidDismiss().then(dataReturned => {
      if (dataReturned) {
        this.getTask();
      }
    });
    return await modal.present();
  }

  editTask(data) {
    this.isEditMode = true;
    this.editTaskModal(data);
  }

  async taskCompleted(task) {
    let self = this;
    // debugger
    const alert = await this.alertController.create({
      header: "Task",
      message: "Sure! Your task completed?",
      buttons: [
        {
          text: "No",

          role: "No",
          cssClass: "secondary",
          handler: () => {
            task.isCompleted = "false";
          }
        },
        {
          text: "Yes",
          handler: () => {
            //  task.isCompleted='true'
            this.updateIsCompleted(task);
            this.getTask();
          }
        }
      ]
    });
    await alert.present();
    // debugger
  }
  updateIsCompleted(task) {
    let id = task._id;
    var data = {
      task_name: task.task_name,
      isCompleted: "true",
      priority: task.priority,
      date: task.date
    };
    this._timeManagementService.updateTime(id, data).subscribe(async resp => {
      console.log("Updated Task");
      this.getTask();
    });
  }

  //filters

  filterTask(event) {
    this.priority = event.detail.value;
    this.getTask();
  }

  filterTaskByStatus(event) {
    this.status = event.detail.value;
    this.getTask();
  }

  getDateTask(event) {
    console.log(this.dateFilter, "date filter");
    this.getTask();
  }

  async presentActionSheet(id) {
    const actionSheet = await this.actionSheetController.create({
      header: "Update Status",
      cssClass: 'actionsheet',
      buttons: [
        {
          text: "IN_PROGRESS",
          handler: () => {
            this.updateStatus("IN_PROGRESS", id);
          },
        },
        {
          text: "DONE",
          handler: () => {
            this.updateStatus("DONE", id);
          },
        },
        {
          text: "HOLD",
          handler: () => {
            this.updateStatus("HOLD", id);
          },
        },
        {
          text: "BLOCKER",
          handler: () => {
            this.updateStatus("BLOCKER", id);
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
            this.getTask();
          },
        },
      ],
    });
    await actionSheet.present();
  }

  updateStatus(status, id) {
    this._taskManagementService.updateTask(id, {
      status: status,
    })
      .subscribe((results: any) => {
        this.getTask();
      });
  }

  

  increaseDate() {
    var tomorrow = new Date(this.changeDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let date = this.formatDate(tomorrow);
    this.changeDate = date;
    this.getDatedTask();
  }

  decreaseDate() {
    var tomorrow = new Date(this.changeDate);
    tomorrow.setDate(tomorrow.getDate() - 1);
    let date = this.formatDate(tomorrow);
    this.changeDate = date;
    this.getDatedTask();
  }

  handleChangeDate(changeDate) {
    this.getDatedTask();
  }

  formatDate(currentDate) {
    if (!currentDate) {
      return;
    }
    // alert("Called")
    var d = new Date(currentDate),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }



}
