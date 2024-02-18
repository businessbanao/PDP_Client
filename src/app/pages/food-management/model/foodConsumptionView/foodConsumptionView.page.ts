import { Component, OnInit } from "@angular/core";
import { AlertController, ModalController, ToastController } from "@ionic/angular";
import { FormBuilder } from "@angular/forms";

import { FoodManagementService } from "../../../../providers/food-management.service";


@Component({
  selector: "app-foodConsumptionView",
  templateUrl: "./foodConsumptionView.page.html",
  styleUrls: ["./foodConsumptionView.page.scss"],
})

export class FoodConsumptionViewPageModel implements OnInit {
  
  public foodConsumptionData;

  public processConsumption;

  public nutrientsUnit: any = {
    calory: "cal",
    protein: "g",
    cholesterol: "mg",
    saturated_fat: "g",
    carbohydrates: "g",
    dietary_fiber: "g",
    fat: "g",
    sodium: "mg",
    sugar: "g",
    magnesium: "mg",
    potassium: "mg",
    iron: "mg",
    calcium: "mg",
    vitamin_a: "IU",
    vitamin_b: "mg",
    vitamin_c: "mg",
    vitamin_d: "IU",
    vitamin_e: "mg",
    vitamin_k: "μg"
  };
  
  constructor(
    private _foodManagementService: FoodManagementService,
    public modalController: ModalController,
    public toast:ToastController,
    private _formBuilder: FormBuilder,
    private _foodManagerService:FoodManagementService,
    private alertController: AlertController
  ) {
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
  
  getNutrients(): { key: string; value: any }[] {
    const result = Object.entries(this.processConsumption).map(([key, value]) => ({ key, value }));
    return result;
   }

  titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
 }
  

  ngOnInit() {
    const key = {};
    for(let consumption of this.foodConsumptionData){
       const serving = consumption.serving;
       if(key['calory']){
         key['calory'] += Math.round(consumption.foodDetails.calory * serving);
       }else{
        key['calory'] = Math.round(consumption.foodDetails.calory * serving);

       }
       
       if(consumption.foodDetails.nutrition)
       for(let [_key,_value] of Object.entries(consumption.foodDetails.nutrition)){
          if(key[_key]){
            key[_key] += Math.round(_value as number) * serving;
          }else{
            key[_key] = Math.round(_value as number) * serving;
          }
       }

    }
    this.processConsumption = key;
  }
 
 
}


