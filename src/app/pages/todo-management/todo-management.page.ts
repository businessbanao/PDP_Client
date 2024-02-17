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
  public duration_type = 'DAY';

  public changeDate: any = new Date();
  public formatCurrentDate;
  public isFreeBoard : boolean = false;

  constructor(
    private _taskManagementService: TaskManagementService,
    private datePipe: DatePipe,
    public alertController: AlertController,

    public actionSheetController: ActionSheetController,
    public modalController: ModalController
  ) {
    if(this.isFreeBoard){
      this.dateFilter = '2000-01-01';
    }else{
    this.dateFilter = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    }

  }

  toggleChanged(){
    // this.isFreeBoard = !this.isFreeBoard;
    if(this.isFreeBoard){
      this.dateFilter = '2000-01-01';
    }else{
       this.dateFilter = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    }
    this.ngOnInit();

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
      payload["duration_start_date"] = this.formatDate(startDate);
      payload["duration_end_date"] = this.formatDate(endtDate);
    }


    this._taskManagementService.getTask(payload).subscribe(resp => {
      this.detailsList = resp.object.response;
      console.log(this.detailsList);
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
      component: TododPageModel,
      componentProps:{
        isFreeBoard: this.isFreeBoard
      }
    });
    modal.onDidDismiss().then(dataReturned => {
      if (dataReturned) {
        if (this.duration_type == 'MONTH') {
          const { firstDay, lastDay } = this.GFG_Fun();
          this.getDatedTask(firstDay, lastDay);
          return
        }
        this.getTask();
      }
    });
    return await modal.present();
  }

  async editTaskModal(data: any) {
    const modal = await this.modalController.create({
      component: TododPageModel,
      componentProps: {
        editMode: this.isEditMode,
        data: data,
        isFreeBoard : this.isFreeBoard
      }
    });
    modal.onDidDismiss().then(dataReturned => {
      if (dataReturned) {
        if (this.duration_type == 'MONTH') {
          const { firstDay, lastDay } = this.GFG_Fun();
          this.getDatedTask(firstDay, lastDay);
          return
        }
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
    var tomorrow = new Date(this.changeDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let date = this.formatDate(tomorrow);
    this.changeDate = date;
    this.handleChangeDate(this.changeDate);
  }

  decreaseDate() {
    var tomorrow = new Date(this.changeDate);
    tomorrow.setDate(tomorrow.getDate() - 1);
    let date = this.formatDate(tomorrow);
    this.changeDate = date;
    this.handleChangeDate(this.changeDate);
  }

  handleChangeDate(changeDate) {
    // debugger;
    if (this.duration_type == 'MONTH') {
      const { firstDay, lastDay } = this.GFG_Fun();
      this.getDatedTask(firstDay, lastDay);
      return
    }

    if (this.duration_type == 'WEEK') {
      const { firstDay, lastDay } = this.GFG_Fun();
      // const { firstWeekDay, lasyWeekDay } = 
      this.GFG_Fun_Week(firstDay, lastDay)
      // this.getDatedTask(firstDay, lastDay);
      return
    }

    this.changeDate = changeDate.slice(0, 10);
    this.getDatedTask(this.changeDate, this.changeDate);
  }


  GFG_Fun() {
    let date;
    if (this.duration_type !== 'WEEK') {
      date = new Date(this.changeDate);
    } else {
      date = new Date();
    }
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {
      firstDay,
      lastDay
    }
  }

  GFG_Fun_Week(firstDay, lastDay) {
    let sDate = new Date(firstDay).getDate();
    let eDate = new Date(lastDay).getDate();

    for (let i = 0; i <= eDate; i++) {
      console.log(i, "i");
      let currentDate: any = new Date("");
      let startDate: any = new Date(currentDate.getFullYear(), 0, 1);
      var days = Math.floor((currentDate - startDate) /
        (24 * 60 * 60 * 1000));

      var weekNumber = Math.ceil(days / 7);
      console.log("Week number of " + currentDate +
        " is :   " + weekNumber);
    }


    // Display the calculated result       

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

  async showInfo(startDate, endDate) {
    let message = "Task Start Date: " + startDate.slice(0, 10) + "<br><br> Task  End Date : " + endDate.slice(0, 10)
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'More details',
      message: message,

      buttons: [
        {
          text: 'close',
          handler: (data) => {

          }
        }
      ]
    });



    await alert.present();
  }

}
