import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ShopService } from "../../../../providers/shop.services";
import { ToastController } from '@ionic/angular';

@Component({
    selector: 'modal-addCategory',
    templateUrl: './addCategory.html'
})
export class AddCategoryPage {


    @Input() editData: any;

    public searchproductList:any=[]
   ngOnInit(): void {
        if (this.editData) {
            this.addCategoryForm.patchValue(this.editData)
        }
    }

    addCategoryForm = new FormGroup({
        categoryName: new FormControl(''),
        description: new FormControl(''),
        logo: new FormControl(''),
    });

    constructor(
        private modalController: ModalController,
        private _shopService: ShopService,
        private toastController: ToastController
    ) {
    }

    submit($event) {
        console.log($event);

        if (this.editData) {
            this.edit($event)
        } else {
            this.create($event)
        }
    }

    create($event) {
        console.log($event);
        let payload = Object.assign({}, $event.value);
        payload.ownerId = localStorage.getItem('adminId')
        console.log(payload, "payload")
        this._shopService.createCategory(payload).subscribe(async (data: any) => {
            console.log("data", data);
            const toast = await this.toastController.create({
                message: 'Category Saved Successfully',
                 duration: 3000,
                color:'secondary',
                position: 'bottom',
                animated: true,
            });
            toast.present();
            this.closeModal()
        });
    }

    edit($event) {
        let payload = Object.assign({}, $event.value);
        console.log(payload, "payload")
        // payload.categoryId = this.editData._id
        this._shopService.editCategory( this.editData._id,payload).subscribe(async (data: any) => {
            console.log("data", data);
            const toast = await this.toastController.create({
                message: 'Category Updated Successfully',
                 duration: 3000,
                color:'secondary',
                position: 'bottom',
                animated: true,
            });
            toast.present();
            this.closeModal()
        });
    }

    async closeModal() {
        const onClosedData: string = "Address Added";
        await this.modalController.dismiss(onClosedData);
    }



}
