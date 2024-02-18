import { Component } from '@angular/core';

import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'page-food-tab',
  templateUrl: 'FoodTab.html',
  styleUrls: ['./FoodTab.scss'],
})
export class FoodTab {
  location = 'add-food';
 

  constructor(public popoverCtrl: PopoverController) { }

   
}
