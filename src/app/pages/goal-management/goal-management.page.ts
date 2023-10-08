import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { GoalPageModel } from './model/goal/goal.page';
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { GoalManagementService } from '../../providers/goal-management.service';
import { AlertController } from "@ionic/angular";


@Component({
  selector: 'app-goalManagement',
  templateUrl: './goal-management.page.html',
  styleUrls: ['./goal-management.page.scss'],
  providers: [DatePipe]
})

export class GoalManagementPage implements OnInit {

  public goalList:any = [];
  goalTypeList=[];
  public isShow:Boolean;
  public highPrioritygoalList:any = [];
  public medPrioritygoalList:any = [];
  public lowPrioritygoalList:any = [];  
  startDate: String;
  endDate: String; 
  dateFilter;
  respMsg:String;
  public isEditMode: boolean;
  goalForm: FormGroup;
  public status = '';
  public type = '';
  public detailsGoalList=[];
  public taskList: any = [];
  public highPriorityGoalList: any = [];
  public medPriorityGoalList: any = [];
  public lowPriorityGoalList: any = [];

  constructor(
    private _goalManagementService: GoalManagementService, 
    private datePipe: DatePipe, 
    public alertController: AlertController,

    public actionSheetController: ActionSheetController,
    public modalController: ModalController) {
    this.dateFilter = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngOnInit() {
    this.getGoal();
  }





  getDatedGoal(startDate, endtDate) {
    let payload = {};

    if (this.status) {
      payload["status"] = this.status;
    }


    if (this.type) {
      payload["type"] = this.type;
    }

    if(startDate && endtDate){
      payload["startDate"] = startDate;
      payload["endDate"] = endtDate;
    }


    this._goalManagementService.getGoal(payload).subscribe(resp => {
      this.detailsGoalList = resp.response;
      this.highPriorityGoalList = this.goalList.filter(
        goal => goal.type == "short_term"
      );
      this.medPriorityGoalList = this.goalList.filter(
        goal => goal.type == "med_term"
      );
      this.lowPriorityGoalList = this.goalList.filter(
        goal => goal.type == "long_term"
      );
    });
  }

  getGoal() {
    let date = this.dateFormater(this.dateFilter);
    this.getDatedGoal(date,date);
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

  

  deleteGoal(goalId){
    // debugger
    let responseMsg:String;
    this._goalManagementService.deleteGoal(goalId).subscribe(resp => {
      responseMsg = resp.error?"goal Deletion Failed":"goal Deleted Succesfully";
      this.getGoal();

      // toster this msg
      // this.getGoal();
    });
  }

  async openGoalModal() {
    const modal = await this.modalController.create({
      component: GoalPageModel
    });
    modal.onDidDismiss().then((dataReturned) => {  
          this.getGoal();
    });
    return await modal.present();
  }
  
  async editGoalModal(data: any) {
    const modal = await this.modalController.create({
      component: GoalPageModel,
      componentProps:{
        editMode : this.isEditMode,
        data : data
      }
    });
    modal.onDidDismiss().then((dataReturned) => {    
        this.getGoal();
    });
    return await modal.present();
  }

  editGoal(data) {
    this.isEditMode = true;
    this.editGoalModal(data);
    this.getGoal();

  }

  filterGoal(event) {
    this.type = event.detail.value;
    this.getGoal();
  }

  filterGoalByStatus(event) {
  this.status = event.detail.value;
  this.getGoal();
}

getDateGoal(event) {
  console.log(this.dateFilter,"date filter");
  this.getGoal();
}

  async goalCompleted(goal) {
    let self = this;
    // debugger
    const alert = await this.alertController.create({
      header: 'Goal',
      message: "Sure! Your Goal completed?",
      buttons: [
        {
          text: 'No',
  
          role: 'No',
          cssClass: 'secondary',
          handler: () => {
            goal.isCompleted = 'false'
          }
        }, {
          text: 'Yes',
          handler: () => {
        //  task.isCompleted='true'
         this.updateIsCompleted(goal) 
         this.getGoal()
          
          }
        }
      ]
    });
    await alert.present();
    // debugger
  }
  updateIsCompleted(goal) {
    let id = goal._id
    var data =
     {"title" :goal.title,
    "isCompleted" :'true',
    "type" :goal.type,
    "expectedCompleteddate":goal.expectedCompleteddate,
    "completeddate":goal.completeddate,


    };
    this._goalManagementService.updateGoal(id,data ).subscribe(async (resp) => {
      console.log("Updated goal");
      this.getGoal()
    });
  
  }






}
