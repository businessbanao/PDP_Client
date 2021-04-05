import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ModalController, ToastController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";
import { UserServices } from '../../../../providers/user.services';

@Component({
  selector: "app-add-edit-stock",
  templateUrl: "./add-edit-stock.page.html",
  styleUrls: ["./add-edit-stock.page.scss"],
})
export class AddEditStockPageModel implements OnInit {
  myReactiveForm: FormGroup;
  isShow: boolean = false;
  isOn: boolean;
  editUserId;
  public type=[];
  formData;
  
  data: any;
  // public del: string;
  constructor(
    private user: UserServices,
    public toastController: ToastController,
    public alertController: AlertController,
    public modalController: ModalController
  ) {}

  async closeModal() {
    const onClosedData: string = "success";
    await this.modalController.dismiss(onClosedData);
  }

  ngOnInit() {
   
    this.myReactiveForm = new FormGroup({
      id:new FormControl(''),
      name: new FormControl(''),
      quantity: new FormControl(''),
      totalItem_count: new FormControl(''),
      description: new FormControl(''),
     
    });

    if(this.data){
      this.editStockManagement(this.data);
    }
  }

  onSubmit() {
    this.isShow = false;
    this.user.saveStock(this.myReactiveForm.value).subscribe((data) => {
      this.myReactiveForm.reset();
      this.presentToast("Stock added");
      this.closeModal();
      console.log("Added Stock",data);
      
    });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: "success",
    });
    toast.present();
  }

  editStockManagement(data) {
    this.isShow = true;
    //automatic set
    this.myReactiveForm.patchValue(data);

    // manual set
    this.myReactiveForm.get("id").setValue(data._id);
  }

  updateStockManagement(body) {
    //get value from form
    let id = this.myReactiveForm.get("id").value;

    this.user.editStock(body.value, id).subscribe((data) => {
      this.myReactiveForm.reset();
      this.isShow = false;
      this.closeModal();
      
    });
  }
 
  }



 

