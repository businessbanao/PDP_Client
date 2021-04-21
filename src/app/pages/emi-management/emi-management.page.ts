import { Component, OnInit } from '@angular/core';
import { EMIManagementService } from '../../providers/emi-management.service';
import { DatePipe } from '@angular/common';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { EMIPageModel } from './model/emi/emi.page';
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { PopoverController, ToastController } from '@ionic/angular';


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
    public toastController: ToastController,
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

  deleteEmi(emiId){
    debugger;
    let responseMsg:String;
    this._emiManagementService.deleteEmi(emiId).subscribe(async resp => {
      this.presentToast("Emi deleted successfully.");
      this.getEmi();
    });
  }

  async presentToast(msg){
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: "bottom",
      color:'success',
      animated: true,
    });
    toast.present();
  }

  editEmi(data) {
    this.isEditMode = true;
    this.editEmiModal(data);
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
    modal.onDidDismiss().then((dataReturned) => {this.getEmi()});
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
    modal.onDidDismiss().then((dataReturned) => {this.getEmi()});
    return await modal.present();
  }
}
