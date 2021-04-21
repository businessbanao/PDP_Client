import { Component, OnInit } from "@angular/core";
import { DayManagementService } from "../../providers/day-management.service";
import { DatePipe } from "@angular/common";
import { ActionSheetController, ModalController } from "@ionic/angular";
import { TaskPageModel } from "./model/task/task.page";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-dayManagement",
  templateUrl: "./day-management.page.html",
  styleUrls: ["./day-management.page.scss"],
  providers: [DatePipe]
})
export class DayManagementPage implements OnInit {
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

  constructor(
    private _dayManagementService: DayManagementService,
    private datePipe: DatePipe,
    public alertController: AlertController,

    public actionSheetController: ActionSheetController,
    public modalController: ModalController
  ) {
    this.dateFilter = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  }

  ngOnInit() {
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

    if(startDate && endtDate){
      payload["startDate"] = startDate;
      payload["endDate"] = endtDate;
    }


    this._dayManagementService.getTask(payload).subscribe(resp => {
      this.detailsList = resp.response;
      this.highPrioritytaskList = this.taskList.filter(
        task => task.priority == "HIGH"
      );
      this.medPrioritytaskList = this.taskList.filter(
        task => task.priority == "MED"
      );
      this.lowPrioritytaskList = this.taskList.filter(
        task => task.priority == "LOW"
      );
    });
  }

  

  deleteTask(taskId) {
    let responseMsg: String;
    this._dayManagementService.deleteTask(taskId).subscribe(resp => {
      responseMsg = resp.error
        ? "Task Deletion Failed"
        : "Task Deleted Succesfully";
      if (!resp.error) {
        this.getTask();
      }
    });
  }

  getTask() {
    let date = this.dateFormater(this.dateFilter);
    this.getDatedTask(date,date);
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
      component: TaskPageModel
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
      component: TaskPageModel,
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
    this._dayManagementService.updateTask(id, data).subscribe(async resp => {
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
    console.log(this.dateFilter,"date filter");
    this.getTask();
  }
}
