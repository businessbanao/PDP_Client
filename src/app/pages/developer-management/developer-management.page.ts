import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatAccordion} from '@angular/material';
import { DatePipe } from '@angular/common';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { AddEditModulePageModel } from './model/add-edit-module/add-edit-module.page';
import { ToastController } from '@ionic/angular';
import { DeveloperManagementService } from '../../providers/developer-management.service';


@Component({
  selector: 'app-developerManagement',
  templateUrl: './developer-management.page.html',
  styleUrls: ['./developer-management.page.scss'],
  providers: [DatePipe]
})

export class DeveloperManagementPage implements OnInit {

  public parentModuleList:any = [];
  public childModulesList=[];
  respMsg:String;
  public featuresList = [];
  panelOpenState: boolean;
  //  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    private _developerManagementService: DeveloperManagementService, 
    private datePipe: DatePipe, 
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    public modalController: ModalController,
    public alertController: AlertController) {
  }

  @ViewChild(MatAccordion,{
    static:true
  }) accordion: MatAccordion;
  displayMode: string = 'default';
  multi = false;
  hideToggle = false;
  disabled = false;
  showPanel3 = true;
  expandedHeight: string;
  collapsedHeight: string;

  ngOnInit() {
    this.getParentModulesList();
  }

  getState(id){
    alert("called")
    let len = this.featuresList.length;

    if(len){
      return id == this.featuresList[0].praentId
    }else{
      return false
    }
  }

  // get folders
  getParentModulesList(){
    this.childModulesList = [];
    this._developerManagementService.getParentModuleList().subscribe((resp) => {
      this.parentModuleList = resp.response;
      console.log(this.parentModuleList);
    });
  }

  getChildModulesList(parentId){
    this.childModulesList = [];

    this._developerManagementService.getChildModuleList(parentId).subscribe((resp) => {
      this.childModulesList = resp.response;
    });
  }

  getFeaturesList(parentId){
    this.featuresList = [];

    this._developerManagementService.getFeaturesList(parentId).subscribe((resp) => {
      this.featuresList = resp.response;
    });
  }

  async openAddFeatureModel(id) {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Add Feature',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Feature Name'
        },
       
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok', data);
            this.createFeature(data,id)

          }
        }
      ]
    });

   

    await alert.present();
  }

  createFeature(data,id){

    let payload ={
      name:data.name,
      assignId:id,
      isActive:true
    }
    this._developerManagementService.createFeature(payload).subscribe(async(resp) => {
      const toast = await this.toastController.create({
        message: "added",
        duration: 3000,
        position: "top",
        color:'success',
        animated: true,
      });
      toast.present();
      this.getFeaturesList(id);
    });

  }

  updateActive(id,isActive,moduleId){
    this._developerManagementService.updateFeature(id,{
      isActive:!isActive
    }).subscribe(async(resp) => {
      const toast = await this.toastController.create({
        message: "Updated",
        duration: 3000,
        position: "top",
        color:'success',
        animated: true,
      });
      toast.present();
      this.getFeaturesList(moduleId);
    });

    
  }


  // format date
  dateFormater(inputDate) {
    let tempDate = new Date(inputDate);
    let date = tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate();
    let month = (tempDate.getMonth() + 1) ? "0" + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1;
    let year = tempDate.getFullYear();
    return isNaN(tempDate.getTime()) ? "" : year + '-' + month + '-' + date; 
  }

  // show action options/sheet
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
       header: "",
       cssClass: "my-custom-class",
       buttons: [
         {
           text: "Create Folder",
           role: "destructive",
           icon: "key-outline",
           handler: () => {
           },
         },
         {
           text: "Cancel",
           icon: "close",
           role: "cancel",
           handler: () => {
             console.log("Cancel clicked");
           },
         },
       ],
     });
     await actionSheet.present();
   }

  // notification msg
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

  // add doc model
  async openAddEditDeveloperModal(type,data ={}) {
    const modal = await this.modalController.create({
      component: AddEditModulePageModel,
      componentProps:{
        moduleType : type,
        data:data
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getParentModulesList();
    });
    return await modal.present();
  }
  
  
  
   
}
