import { Component, OnInit } from "@angular/core";
import { ActionSheetController, AlertController, ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm, Validators, FormArray } from "@angular/forms";
import { NoteManagementService } from '../../../../providers/note-management.service';
import { ActivatedRoute } from "@angular/router";
import {
  Camera,
  CameraOptions,
  PictureSourceType,
} from "@ionic-native/camera/ngx";
import { environment } from "../../../../../environments/environment";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { FoodManagementService } from "../../../../providers/food-management.service";
import { FoodPageModel } from "../food/food.page";


@Component({
  selector: "app-foodConsumption",
  templateUrl: "./foodConsumption.page.html",
  styleUrls: ["./foodConsumption.page.scss"],
})

export class FoodConsumptionPageModel implements OnInit {
  
  foodConsumptionForm: FormGroup;
  public isEditMode: boolean = false;
  public data:any;
 
  public responseStr: string;
  public foodList:any;
  public timeSlot:string
  public date:string;
  public selected = false;
  public foodOptions = ["Global", localStorage.getItem("adminId")];
  public searchText:string = '';
  public searchedFood = []
  constructor(
    private _foodManagementService: FoodManagementService,
    public modalController: ModalController,
    public toast:ToastController,
    private _formBuilder: FormBuilder,
    private _foodManagerService:FoodManagementService,
    private alertController: AlertController
  ) {
    this.getFoodItems();
    this.searchedFood = this.getSearchedFoodItems();
  }

  getSearchedFoodItems(){
    if(this.searchText.trim() === '' ) return this.foodList;
    return this.foodList.filter((item)=> { return item.name.includes(this.searchText)} );
    
  }

  async getFoodItems(){
    this._foodManagementService.getFoodItems({owner:this.foodOptions[Number(this.selected)]}).subscribe((resp)=>{
      this.foodList = resp.object.response;
      console.log(this.foodList);
      this.searchedFood = this.getSearchedFoodItems();
    })
  }

  
  toggleChanged(){
    this.getFoodItems();
  }
  
  onChangeUpdateSearchedFood(){
    console.log("called");
    this.searchedFood = this.getSearchedFoodItems()
  }
  

  ngOnInit() {
    this.initNoteForm();
    if(this.timeSlot){
      this.foodConsumptionForm.get('timeSlot').setValue(this.timeSlot);
    }
    if(this.date){
      this.foodConsumptionForm.get('date').setValue(this.date);
    }
    if(this.data){
      this.isEditMode=true;
      this.foodConsumptionForm.patchValue(this.data);
      this.foodConsumptionForm.get('id').setValue(this.data._id);
    }

  }
  async openAddEditModal(data,isEditMode=false){
    if(data !== null && !this.selected) return;

    const modal = await this.modalController.create({
       component:FoodPageModel,
       componentProps:{
           data:data,
           isEditMode:isEditMode
       }
     });
     modal.onDidDismiss().then((dataReturned) => {
       this.getFoodItems();
      //  this.getFoodConsumptionList();
     });
     return await modal.present();  
   }
 
  async openServingSizeModel(id,inEdit=false) {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Enter Serving',
      inputs: [
        {
          name: 'serving',
          type: 'number',
          placeholder: 'Enter Serving',
          value: inEdit?this.data.serving:1
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
            if(data.serving <= 0){ 
              this.toast.create({
                message:"minimum serving should be 1",
                color:'success',
                duration:2000
              }).then((t)=>{
                t.present();
              })
              return false;
             }
            console.log('Confirm Ok', data);
            // this.createFeature(data,id)
            this.foodConsumptionForm.get('serving').setValue(data.serving);
            this.foodConsumptionForm.get('foodId').setValue(id);
          //  this.isEditMode addFoodConsumption()
           if(inEdit==false)  this.addFoodConsumption(this.foodConsumptionForm);
           else {
              this.updateFoodConsumption(this.foodConsumptionForm);
           }


          }
        }
      ]
    });

   

    await alert.present();
  }
 
  
  updateFoodConsumption(payload) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    formData['userId']=localStorage.getItem('adminId');
    let id = this.foodConsumptionForm.get("id").value;
    this._foodManagerService.updateFoodConsumption(id, formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      let toast = await this.toast.create({
        message:"Updated Successfully",
        color:'success',
        duration:2000
      })
      toast.present();
      this.foodConsumptionForm.reset();
      this.closeModal();
    });
    this.isEditMode = false;
  }


  initNoteForm() {
    this.foodConsumptionForm = this._formBuilder.group({
      id: new FormControl(),
      foodId: new FormControl('', Validators.compose([Validators.required])),
      serving: new FormControl(1),
      timeSlot: new FormControl('Breakfast'),
      date: new FormControl('')
    });
  }

  addFoodConsumption(payload: FormGroup) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    formData['userId']=localStorage.getItem('adminId');
    console.log(formData);
    this._foodManagerService.createFoodConsume(formData).subscribe(async (resp)=>{
        this.responseStr = resp.response;
      let toast = await this.toast.create({
        message:"Food created Successfully",
        color:'success',
        duration:2000
      })
      toast.present();
      this.foodConsumptionForm.reset();
      this.closeModal();
    });
  }
  async closeModal() {
    await this.modalController.dismiss();
  }
 
}


