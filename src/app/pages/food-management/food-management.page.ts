import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from "@ionic/angular";
import { FoodPageModel } from "./model/food/food.page";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { PopoverController, ToastController } from "@ionic/angular";
import { FoodManagementService } from "../../providers/food-management.service";
import { FoodConsumptionPageModel } from "./model/foodConsuption/foodConsumption.page";

@Component({
  selector: "app-foodManagement",
  templateUrl: "./food-management.page.html",
  styleUrls: ["./food-management.page.scss"],
  providers: [DatePipe],
})
export class FoodManagementPage implements OnInit {
  public foodItems: any[] = []
  public selectedDate = this.formatDate(new Date());
  public foodConsumptionList: any[] = []

  constructor(
    private _foodManagementService: FoodManagementService,
    private datePipe: DatePipe,
    public alertController: AlertController,

    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    public modalController: ModalController,
  ) {}
  
  private formatDate(date: Date): string {
    // Format the date as 'YYYY-MM-DD' (the format expected by the input type="date")
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  ngOnInit() {
    this.getFoodItems();
    this.getFoodConsumptionList();
  }

  mapFoodConsumptionList() {
    // Map food consumption list to include details from food items
    this.foodConsumptionList = this.foodConsumptionList.map((consumptionItem) => {
      const matchingFoodItem = this.foodItems.find((foodItem) => foodItem._id === consumptionItem.foodId);
      // If a matching food item is found, add its details to the consumption item
      return matchingFoodItem
        ? { ...consumptionItem, foodDetails: matchingFoodItem }
        : consumptionItem;
    });
  }

getTotalCaloryByMeal(meal){
 return  this.foodConsumptionList.reduce((prev,curr)=>{
         if(curr.timeSlot === meal) return curr.foodDetails.calory * curr.serving + prev;
         return prev;
  },0)
}

getTotalCalory(){
  return  this.foodConsumptionList.reduce((prev,curr)=>{
           return curr.foodDetails.calory * curr.serving + prev;
   },0)
 }


 
async getFoodItems(){
  this._foodManagementService.getFoodItems().subscribe((resp)=>{
    this.foodItems = resp.object.response;
    console.log(this.foodItems);
    this.mapFoodConsumptionList()
    console.log(this.foodConsumptionList)
  })
}

async getFoodConsumptionList(){
  this._foodManagementService.getFoodConsumptionList(this.selectedDate).subscribe((resp)=>{
    this.foodConsumptionList = resp.object.response;
    console.log(this.foodConsumptionList);
    this.mapFoodConsumptionList();
    console.log(this.foodConsumptionList)

  })
}

async presentAlertConfirm(id) {
  let self = this;
  const alert = await this.alertController.create({
    header: 'Delete Note',
    message: "Are you sure you want to delete?",
    buttons: [
      {
        text: 'Cancel',

        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {

        }
      }, {
        text: 'Okay',
        handler: () => {
          self.deleteFood(id)
        }
      }
    ]
  });

  await alert.present();
}

async deleteFood(id){
  console.log("called");
  this._foodManagementService.deleteFood(id).subscribe(resp=>{
    console.log(resp);
  });
}

async presentActionSheet(data) {
  const actionSheet = await this.actionSheetController.create({
    header: "",
    cssClass: "my-custom-class",
    buttons: [
      {
        text: `Edit Food`,
        role: "destructive",
        icon: "key-outline",
        handler: () => {
          this.openAddEditModal(data,true);
        },
      },
      {
        text: "Delete Food",
        role: "destructive",
        icon: "key-outline",
        handler: () => {
          this.presentAlertConfirm(data._id);
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

addFoodConsumption(timeSlot){
  console.log(this.selectedDate);
  this.openFoodConsumptionAddEdit(null,timeSlot); 
}

increaseDate() {
  var tomorrow = new Date(this.selectedDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  let date = this.formatDate(tomorrow);
  this.selectedDate = date;
  this.getFoodConsumptionList();
}

decreaseDate() {
  var tomorrow = new Date(this.selectedDate);
  tomorrow.setDate(tomorrow.getDate() - 1);
  let date = this.formatDate(tomorrow);
  this.selectedDate = date;
  this.getFoodConsumptionList();
}

async openFoodConsumptionAddEdit(data,timeSlot){
  const modal = await this.modalController.create({
    component:FoodConsumptionPageModel,
    componentProps:{
        data:data,
        timeSlot:timeSlot,
        foodList:this.foodItems,
        date:this.selectedDate
    }
  });
  modal.onDidDismiss().then((dataReturned) => {
    this.getFoodItems();
    this.getFoodConsumptionList();
    });
  return await modal.present(); 
}

 async openAddEditModal(data,isEditMode=false){
   const modal = await this.modalController.create({
      component:FoodPageModel,
      componentProps:{
          data:data,
          isEditMode:isEditMode
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.getFoodItems();
      this.getFoodConsumptionList();
    });
    return await modal.present();  
  }
}
