import { Component, OnInit } from '@angular/core';
import { EMIManagementService } from '../../providers/emi-management.service';
import { DatePipe } from '@angular/common';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { EMIPageModel } from './model/emi/emi.page';
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";


@Component({
  selector: 'app-emiManagement',
  templateUrl: './emi-management.page.html',
  styleUrls: ['./emi-management.page.scss'],
  providers: [DatePipe]
})

export class EMIManagementPage implements OnInit {

  public emiList:any = [];
  respMsg:String;
  public isEditMode: boolean;
  emiForm: FormGroup;

  constructor(
    private _emiManagementService: EMIManagementService, 
    private datePipe: DatePipe, 
    public actionSheetController: ActionSheetController,
    public modalController: ModalController) {
  }

  ngOnInit() {
    this.getEmi();
  }

  getEmi() {
    this._emiManagementService.getEmi(localStorage.getItem('adminId')).subscribe((resp) => {
      this.emiList = resp.response;
    });
  }

  deleteEmi(taskId){
    let responseMsg:String;
    this._emiManagementService.deleteEmi(taskId).subscribe(resp => {
      responseMsg = resp.error?"Task Deletion Failed":"Task Deleted Succesfully";
      // toster this msg
    });
  }

  dateFormater(inputDate) {
    let tempDate = new Date(inputDate);
    let date = tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate();
    let month = (tempDate.getMonth() + 1) ? "0" + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1;
    let year = tempDate.getFullYear();
    return isNaN(tempDate.getTime()) ? "" : year + '-' + month + '-' + date; 
  }

  async openEmiModal() {
    const modal = await this.modalController.create({
      component: EMIPageModel
    });
    modal.onDidDismiss().then((dataReturned) => {});
    return await modal.present();
  }
  
  async editEmiModal(data: any) {
    const modal = await this.modalController.create({
      component: EMIPageModel,
      componentProps:{
        editMode : this.isEditMode,
        data : data
      }
    });
    modal.onDidDismiss().then((dataReturned) => {});
    return await modal.present();
  }

  editEmi(data) {
    this.isEditMode = true;
    this.editEmiModal(data);
  }
}
