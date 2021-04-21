import { Component, OnInit } from '@angular/core';
import { DayManagementService } from '../../providers/day-management.service';
import { DatePipe } from '@angular/common';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { GoalPageModel } from './model/goal/goal.page';
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { GoalManagementService } from '../../providers/goal-management.service';


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

  constructor(
    private _goalManagementService: GoalManagementService, 
    private datePipe: DatePipe, 
    public actionSheetController: ActionSheetController,
    public modalController: ModalController) {
    this.dateFilter = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngOnInit() {
    // debugger
    this.getGoal();
    // this.getGoalType();
  }
  // getGoal() {
  //   // debugger
  //   this._goalManagementService.getGoal(localStorage.getItem('adminId')).subscribe((resp) => {
  //     this.goalList = resp.response;
  //   });
  // }
  getGoal() {
    
    this._goalManagementService.getGoal().subscribe((result) => {
      console.log("Goal result", result);
      this.goalList = result["response"];
    });
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
    modal.onDidDismiss().then((dataReturned) => {      this.getGoal();
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
    modal.onDidDismiss().then((dataReturned) => {      this.getGoal();
    });
    return await modal.present();
  }

  editGoal(data) {
    this.isEditMode = true;
    this.editGoalModal(data);
    this.getGoal();

  }

  filterGoal(event){
    // console.log(event.detail.value);
    const type = event.detail.value
    // debugger
    this._goalManagementService.getGoalType(type).subscribe((result) => {
      console.log("Goal result By Type", result);
      this.goalList = result["response"];
      
    });
  }
}
