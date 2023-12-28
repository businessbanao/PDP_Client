import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FoodManagementService } from '../../providers/food.service'; // Import your food service here

@Component({
  selector: 'app-food-management',
  templateUrl: 'food-management.page.html',
  styleUrls: ['food-management.page.scss'],
})
export class FoodManagement implements OnInit {
  foodForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private foodService: FoodManagementService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.foodForm = this.formBuilder.group({
      name: ['', Validators.required],
      imageUrl: ['', Validators.required],
      category: [[]], // Default to an empty array
      nutrition: this.formBuilder.group({
        // Define your nutrition fields here
      }),
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Options',
      buttons: [
        {
          text: 'Add Food',
          handler: () => {
            this.presentAddFoodModal();
          },
        },
        // Add more actions as needed
      ],
    });
    await actionSheet.present();
  }

  async presentAddFoodModal() {
    const modal = await this.modalCtrl.create({
      component: AddFoodPage, // Create an AddFoodPage for adding a new food
      componentProps: { form: this.foodForm },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      // Handle the data returned from the modal (e.g., new food added)
      this.addFood(data);
    }
  }

  addFood(newFood: any) {
    // Call your food service to add the new food
    this.foodService.addFood(newFood).subscribe(
      (response) => {
        // Handle success
        console.log('Food added successfully:', response);
      },
      (error) => {
        // Handle error
        console.error('Error adding food:', error);
      }
    );
  }

  async presentConfirmationAlert(foodId: string) {
    const alert = await this.alertController.create({
      header: 'Delete Food',
      message: 'Are you sure you want to delete this food?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteFood(foodId);
          },
        },
      ],
    });
    await alert.present();
  }

  deleteFood(foodId: string) {
    // Call your food service to delete the food
    this.foodService.deleteFood(foodId).subscribe(
      (response) => {
        // Handle success
        console.log('Food deleted successfully:', response);
      },
      (error) => {
        // Handle error
        console.error('Error deleting food:', error);
      }
    );
  }
}
