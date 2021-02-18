import { Component, OnInit, Input } from "@angular/core";
import {
  ModalController,
  ActionSheetController,
  AlertController,
} from "@ionic/angular";

import { ShopService } from "../../../../providers/shop.services";
import { ToastController } from "@ionic/angular";


@Component({
  selector: "modal-manual-inventry",
  styleUrls: ["manual-inventry.scss"],
  templateUrl: "./manual-inventry.html",
})
export class ManualInventryPage implements OnInit {

  public inventryList=[]
  public OutgoinginventryList=[]
  public incomingAmount = 0;
  public outgonigAmount = 0;
  public Department=[];
  public changeDate:any= '';
  public payload={
    departmentName: '',
    departmentID: '',
    description: "",
    inventryType: "Incoming",
    ownerId: "601870f796b9f2834f045d1a",
    date: this.changeDate,
    amount:'',
    department:null
  }

  ngOnInit(): void {
    this.getDepartment('Incoming');
  }

  saveInventry(){
    if(!this.payload.date){
      return
    }

    this.payload.date = this.payload.date.slice(0,10);
    this.payload.departmentName = this.payload.department.departmentName;
    this.payload.departmentID =  this.payload.department._id;
    delete this.payload.department;
    console.log(this.payload,"payload");
    this.saveTransaction(this.payload);
  }

  getDepartment(type) {
    this._shopService.getDepartments(type).subscribe((data: any) => {
        this.Department = data.response;
        console.log(data, "--------------------------", this.Department)
    });
  }

  changeType(type){
    this.getDepartment(type);
  }

  async saveTransaction(payload) {
    this._shopService.SaveInventry(payload).subscribe(async (data: any) => {
      console.log(data);
      const toast = await this._toast.create({
        message: "Inventry Saved Successfully",
        duration: 3000,
        color: "success",
        position: "top",
        animated: true,
      });

      toast.present();
      this.resetData()
    });
  }

  resetData(){
    for(let key in this.payload){
        this.payload[key] = ''
    }
  }




handleChangeDate(changeDate: string) {
        // this.changeDate = changeDate;
        console.log(changeDate,"changeDate")
        this.changeDate = changeDate.slice(0,10);

}




  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }


  constructor(
    private modalController: ModalController,
    private _shopService: ShopService,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private _toast: ToastController,
  ) {}



}
