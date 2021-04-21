import { Component, OnInit } from '@angular/core';
import { DayManagementService } from '../../providers/day-management.service';
import { DatePipe } from '@angular/common';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { TaskPageModel } from './model/task/task.page';
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { AlertController } from "@ionic/angular";



@Component({
  selector: 'app-dayManagement',
  templateUrl: './day-management.page.html',
  styleUrls: ['./day-management.page.scss'],
  providers: [DatePipe]
})

export class DayManagementPage implements OnInit {

  public taskList:any = [];
  public highPrioritytaskList:any = [];
  public medPrioritytaskList:any = [];
  public lowPrioritytaskList:any = [];  
  startDate: String;
  endDate: String; 
  dateFilter;
  respMsg:String;
  public isEditMode: boolean;
  taskForm: FormGroup;
  detailsList=[];
  TaskList=[]

  constructor(
    private _dayManagementService: DayManagementService, 
    private datePipe: DatePipe, 
    public alertController: AlertController,

    public actionSheetController: ActionSheetController,
    public modalController: ModalController) {
    this.dateFilter = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngOnInit() {
    this.getDatedTask(this.dateFilter, this.dateFilter);
    this.getTask()
    this.getTaskdetails();
  }

  getDatedTask(startDate, endtDate) {
    this._dayManagementService.getTask(startDate, endtDate).subscribe((resp) => {
      this.taskList = resp.response;
      this.highPrioritytaskList = this.taskList.filter(task => task.priority == "HIGH");
      this.medPrioritytaskList = this.taskList.filter(task => task.priority == "MED");
      this.lowPrioritytaskList = this.taskList.filter(task => task.priority == "LOW");
    });
  }

  getTaskdetails() {
    
    this._dayManagementService.getTaskdetails().subscribe((result) => {
      console.log("Task result", result);
      this.detailsList = result["response"];
    });
  }
  


  deleteTask(taskId){
    let responseMsg:String;
    this._dayManagementService.deleteTask(taskId).subscribe(resp => {
      responseMsg = resp.error?"Task Deletion Failed":"Task Deleted Succesfully";
      if(!resp.error){
        this.getTask();
      }
      this.getTaskdetails()

    });
  }

  getTask(){
    let date = this.dateFormater(this.dateFilter);
    this.getDatedTask(date, date);
  }

  dateFormater(inputDate) {
    let tempDate = new Date(inputDate);
    let date = tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate();
    let month = (tempDate.getMonth() + 1) ? "0" + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1;
    let year = tempDate.getFullYear();
    return isNaN(tempDate.getTime()) ? "" : year + '-' + month + '-' + date; 
  }

  async openTaskModal() {
    const modal = await this.modalController.create({
      component: TaskPageModel
    });
    modal.onDidDismiss().then((dataReturned) => {
      if(dataReturned){
        this.getTask();
      }
      this.getTaskdetails()

    });
    return await modal.present();
  }
  
  async editTaskModal(data: any) {
    const modal = await this.modalController.create({
      component: TaskPageModel,
      componentProps:{
        editMode : this.isEditMode,
        data : data
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if(dataReturned){
        this.getTask();
      }
      this.getTaskdetails()
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
      header: 'Task',
      message: "Sure! Your task completed?",
      buttons: [
        {
          text: 'No',
  
          role: 'No',
          cssClass: 'secondary',
          handler: () => {
            task.isCompleted = 'false'
          }
        }, {
          text: 'Yes',
          handler: () => {
        //  task.isCompleted='true'
         this.updateIsCompleted(task) 
         this.getTaskdetails();
          
          }
        }
      ]
    });
    await alert.present();
    // debugger
  }
  updateIsCompleted(task) {
    let id = task._id
    var data =
     {"task_name" :task.task_name,
    "isCompleted" :'true',
    "priority" :task.priority,
    "date":task.date,
    };
    this._dayManagementService.updateTask(id,data ).subscribe(async (resp) => {
      console.log("Updated Task");
      this.getTaskdetails();
    });
  
  }



  //filters
  
  filterTask(event){
    const priority = event.detail.value
    // debugger
    this._dayManagementService.getTaskPriority(priority).subscribe((result) => {
      console.log("Goal result By Type", result);
     
      this.detailsList = result["response"];
    
  })

}

filterTaskByStatus(event){
  const status = event.detail.value
  // debugger
  this._dayManagementService.getTaskStatus(status).subscribe((result) => {
    console.log("Goal result By Status", result);
    this.detailsList = result["response"];

})
}


getDateTask(event) {
  // debugger
  const date = event.detail.value
  this._dayManagementService.getDateTask(date).subscribe((result) => {
    console.log("Task result", result);
    // this.filterTask(event);
    // this.filterTaskByStatus(event)
    this.detailsList = result["response"];
  });
}


}
