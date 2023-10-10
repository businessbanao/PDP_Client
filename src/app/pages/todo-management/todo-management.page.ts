import { Component, OnInit } from "@angular/core";
import { TaskManagementService } from "../../providers/task-management.service";
import { DatePipe } from "@angular/common";
import { ActionSheetController, ModalController } from "@ionic/angular";
import { TododPageModel } from "./model/todo/todo.page";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-todoManagement",
  templateUrl: "./todo-management.page.html",
  styleUrls: ["./todo-management.page.scss"],
  providers: [DatePipe]
})
export class TodoManagementPage implements OnInit {
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
    private _taskManagementService: TaskManagementService,
    private datePipe: DatePipe,
    public alertController: AlertController,

    public actionSheetController: ActionSheetController,
    public modalController: ModalController
  ) {
    this.dateFilter = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  }

  ngOnInit() {
    var now = new Date();
    let nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    this.formatCurrentDate = this.formatDate(nextMonth);
    this.changeDate = this.dateFilter;
    // this.handleChangeDate(this.formatCurrentDate);
    this.getTask();
  }

  getDatedTask(startDate, endtDate) {
    let payload = {};

    if (this.status) {
      payload["status"] = this.status;
    }


    if (this.priority) {
      payload["priority"] = this.priority;
    }

    if (startDate && endtDate) {
      payload["startDate"] = startDate;
      payload["endDate"] = endtDate;
    }


    this._taskManagementService.getTask(payload).subscribe(resp => {
      this.detailsList = resp.object.response;
    });
  }



  deleteTask(taskId) {
    let responseMsg: String;
    this._taskManagementService.deleteTask(taskId).subscribe(resp => {
      responseMsg = resp.error
        ? "Task Deletion Failed"
        : "Task Deleted Succesfully";
      if (!resp.error) {
        this.getTask();
      }
    });
  }

  getTask() {
    let date = this.formatDate(this.dateFilter);
    this.getDatedTask(date, date);
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

  async openTaskModal() {
    const modal = await this.modalController.create({
      component: TododPageModel
    });
    modal.onDidDismiss().then(dataReturned => {
      if (dataReturned) {
        let date = this.changeDate;
        this.getDatedTask(date, date);
      }
    });
    return await modal.present();
  }

  async editTaskModal(data: any) {
    const modal = await this.modalController.create({
      component: TododPageModel,
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
    this._taskManagementService.updateTask(id, data).subscribe(async resp => {
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

  increaseDate() {
    // this.date = this.changeDate
    // this.date.setDate( this.date.getDate() + 1 );
    // console.log(this.date);
    var tomorrow = new Date(this.changeDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    // this.date = tomorrow ;
    let date = this.formatDate(tomorrow);
    this.changeDate = date;

    this.getDatedTask(this.changeDate, this.changeDate);
  }

  decreaseDate() {
    var tomorrow = new Date(this.changeDate);
    tomorrow.setDate(tomorrow.getDate() - 1);
    // this.date = tomorrow ;
    let date = this.formatDate(tomorrow);
    this.changeDate = date;
    this.getDatedTask(this.changeDate, this.changeDate);
  }

  handleChangeDate(changeDate) {
    // this.isShow = true;
    // this.changeDate = changeDate;
    console.log(changeDate, "changeDate");
    this.changeDate = changeDate.slice(0, 10);
    this.getDatedTask(this.changeDate, this.changeDate);
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

 
}
