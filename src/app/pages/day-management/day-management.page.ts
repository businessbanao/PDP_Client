import { Component, OnInit } from '@angular/core';
import { DayManagementService } from '../../providers/day-management.service';
import { DatePipe } from '@angular/common';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { TaskPageModel } from './model/task/task.page';
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";


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

  constructor(
    private _dayManagementService: DayManagementService, 
    private datePipe: DatePipe, 
    public actionSheetController: ActionSheetController,
    public modalController: ModalController) {
    this.dateFilter = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngOnInit() {
    this.getDatedTask(this.dateFilter, this.dateFilter);
  }

  getDatedTask(startDate, endtDate) {
    this._dayManagementService.getTask(startDate, endtDate).subscribe((resp) => {
      this.taskList = resp.response;
      this.highPrioritytaskList = this.taskList.filter(task => task.priority == "HIGH");
      this.medPrioritytaskList = this.taskList.filter(task => task.priority == "MED");
      this.lowPrioritytaskList = this.taskList.filter(task => task.priority == "LOW");
    });
  }

  deleteTask(taskId){
    let responseMsg:String;
    this._dayManagementService.deleteTask(taskId).subscribe(resp => {
      responseMsg = resp.error?"Task Deletion Failed":"Task Deleted Succesfully";
      if(!resp.error){
        this.getTask();
      }
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
    });
    return await modal.present();
  }

  editTask(data) {
    this.isEditMode = true;
    this.editTaskModal(data);
  }
}
