import { Component, OnInit } from "@angular/core";
import { ActionSheetController, ModalController, ToastController } from "@ionic/angular";
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


@Component({
  selector: "app-note",
  templateUrl: "./food.page.html",
  styleUrls: ["./food.page.scss"],
})

export class FoodPageModel implements OnInit {
  
  public baseUrl: String = environment.baseUrl + "/";
  foodForm: FormGroup;
  public isEditMode: boolean = false;
  public data:any;
  public responseStr: string;
  public folder_list:any;

 
  
  constructor(
    public modalController: ModalController,
    public toast:ToastController,
    private _formBuilder: FormBuilder,
    private _foodManagerService:FoodManagementService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private camera: Camera,
    private transfer: FileTransfer,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.getFolders();
    this.initFoodForm();
    console.log(this.data);
    try {
      if(this.data){
        this.isEditMode=true;
        try {
          
          this.foodForm.patchValue(this.data);
        } catch (error) {
          
        }
        this.foodForm.get('id').setValue(this.data._id);
        const category = this.data.category.map(item=>({display:item,value:item}));
  
        this.foodForm.get('category').setValue(category);
        console.log(this.data.nutrition);
        for(let [key,value] of Object.entries(this.data.nutrition)){
          this.nutritionArray.push(this._formBuilder.group({
            key: [key, Validators.required],
            value: [value, Validators.required],
          }));
        }
        console.log(this.foodForm.value);
        // this.noteForm.get('date').setValue(this.data.date.slice(0,10));
        // this.noteForm.get('content').setValue(this.data.content)
      }
    } catch (error) {
       console.log(error);
    }

  }

  getFolders(){
    
  }

  // printFoodForm(payload){

  //   let formData = JSON.parse(JSON.stringify(payload.value));
  //   let id = this.foodForm.get("id").value;
  //   formData['category'] = formData['category'].map((list)=>{
  //     return list.value;
  //   }) 
  //   console.log(formData);

  // }
  
  updateFood(payload) {
    debugger;
    let formData = JSON.parse(JSON.stringify(payload.value));
    console.log(formData);
    let id = this.foodForm.get("id").value;
    formData['category'] = formData['category'].map((list)=>{
      return list.value;
    }) 

    const nutrition = {}
    formData.nutrition.reduce((prev,curr)=>{
     prev[curr.key] = curr.value;
     return prev;
    },nutrition);

    formData.nutrition = nutrition;

    this._foodManagerService.updateFood(id, formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      let toast = await this.toast.create({
        message:"Updated Successfully",
        color:'success',
        duration:2000
      })
      toast.present();
      this.foodForm.reset();
      this.closeModal();
    });
    this.isEditMode = false;
  }

  public nutritionArray= new FormArray([]);

  initFoodForm() {
    this.foodForm = this._formBuilder.group({
      id: new FormControl(),
      name: new FormControl('', Validators.compose([Validators.required])),
      imageUrl: new FormControl(),
      category:new FormControl(),
      calory: new FormControl(),
      nutrition:this.nutritionArray
    });
  }

 

  addNutrientField() {
    this.nutritionArray.push(this._formBuilder.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
    }));
  }

  removeNutrientField(index: number) {
    this.nutritionArray.removeAt(index);
  }

  addFood(payload: FormGroup) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    formData['category'] = formData['category'].map((list)=>{
      return list.value;
    });
    const nutrition = {}
    formData.nutrition.reduce((prev,curr)=>{
      return prev[curr.key] = curr.value;
    },nutrition);

    formData.nutrition = nutrition;
    console.log(formData);
    this._foodManagerService.createFood(formData).subscribe(async (resp)=>{
        this.responseStr = resp.response;
      let toast = await this.toast.create({
        message:"Food created Successfully",
        color:'success',
        duration:2000
      })
      toast.present();
      this.foodForm.reset();
      this.closeModal();
    });
  }
  async closeModal() {
    await this.modalController.dismiss();
  }
 
}


