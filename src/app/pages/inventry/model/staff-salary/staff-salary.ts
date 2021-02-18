import { Component, OnInit, Input } from "@angular/core";
import {
  ModalController,
  ActionSheetController,
  AlertController,
} from "@ionic/angular";

import { ShopService } from "../../../../providers/shop.services";
import { ToastController } from "@ionic/angular";
import { VendorReportPage } from '../vendor-report/vendor-report';

@Component({
  selector: "modal-staff-salary",
  styleUrls: ["staff-salary.scss"],
  templateUrl: "./staff-salary.html",
})
export class StaffSalaryPage implements OnInit {
  public Department = [];


  // public staffIds = [
  //   "5f9c719fb158285771155d4c",
  //   "5f9c71b2b158285771155d4d",
  //   "5f9c71cfb158285771155d4e",
  //   "5f9c71e5b158285771155d4f",
  //   "5f9c71f6b158285771155d50",
  //   "5f9c7227b158285771155d51",
  //   "5f9c723fb158285771155d52",
  //   "5f9c7255b158285771155d53",
  //   "5fc284488e60a18b5f26e769",
  //   "5fc269d18e60a18b5f26e713",
  //   "5fc073d08e60a18b5f26e4e8"
  // ];

  public staffIds = [
   {
     name: 'Vickey',
     id: "601870f796b9f2834f045d1a",
     salary:9000,
     initBalance:4092,
     calculatedSalary:0
   },
   {
    name: 'Vikram',
    id: "5ff027fc59a8e08e4b397dfa",
    salary:8000,
    initBalance:8302,
    calculatedSalary:0
  },
   {
    name: 'Ajay',
    id: "5ff0280859a8e08e4b397dfb",
    salary:8000,
    initBalance:0,
    calculatedSalary:0

  }, {
    name: 'Govind',
    id: "5ff0281859a8e08e4b397dfc",
    salary:20000,
    initBalance:12168,
    calculatedSalary:0
  },
  {
    name: 'Sanjeev',
    id: "5ff2aa8b59a8e08e4b397fe1",
    salary:9000,
     initBalance:4092,
     calculatedSalary:0
  },
   {
    name: 'Anil',
    id: "5ff0285c59a8e08e4b397dfe",
    salary:14000,
    initBalance:13488,
    calculatedSalary:0
  }, {
    name: 'Dinesh',
    id: "5ff0287559a8e08e4b397dff",
    salary:16500,
    initBalance:14114,
    calculatedSalary:0
  }, {
    name: 'Hayat',
    id: "5ff1fc7f59a8e08e4b397f05",
    salary:8000,
    initBalance:10692,
    calculatedSalary:0
  }, {
    name: 'Arjun',
    id: "5ff1fdf159a8e08e4b397f07",
    salary:4000,
    initBalance:2000,
    calculatedSalary:0
  }, {
    name: 'Sunil',
    id: "5ff18f9d59a8e08e4b397ea3",
    salary:7000,
    initBalance:5164,
    calculatedSalary:0
  },{
    name:'neeraj',
    id:'5ff0283359a8e08e4b397dfd',
    salary:9000,
     initBalance:0,
     calculatedSalary:0
  },{
    name:'Mustak',
    id:"5ff173e359a8e08e4b397e1c",
    salary:9000,
     initBalance:0,
     calculatedSalary:0
  },
  {
    name:'Sanjeev',
    id:'5ff2aa8b59a8e08e4b397fe1',
    salary:9000,
     initBalance:0,
     calculatedSalary:0
  }
  ];



  constructor(
    private modalController: ModalController,
    private _shopService: ShopService,
    private toastController: ToastController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.getDepartment();
  }

  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }

  public VendorList = [];
  public StaffList = [];

  getDepartment() {
    this._shopService.getDepartments("Outgoing").subscribe((data: any) => {
      this.Department = data.response;

      this.StaffList = this.Department.filter((dep) => {
        let staff = this.getStaff(dep._id);
        if(staff){
          dep['salary']= staff.salary;
           dep['initBalance']= staff.initBalance;
           dep['calculatedSalary']= 0;
           dep['account_balance']= dep.account_balance;
           return dep
          }
        });
        
        
        console.log(this.StaffList ,"this.StaffList")
      console.log(data, "--------------------------", this.Department);
    });
  }


  getStaff(id){
    return this.staffIds.filter(function(v) {
      return v.id === id;
    })[0];
  }

  async openVendorDetailsModal(id) {
    const modal = await this.modalController.create({
      component: VendorReportPage,
      componentProps: {
        'depId': id,
      }
    });

    modal.onDidDismiss().then((dataReturned) => {});

    return await modal.present();
  }



  async presentAlertPrompt(name,data) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Calculat Salary of '+name,
      inputs: [
        {
          name: 'working_days',
          type: 'number',
          placeholder: 'Working Days'
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
          handler: (val) => {
            console.log('Confirm Ok',val);
            this.calculatSalary(val.working_days,data)
          }
        }
      ]
    });

    await alert.present();
  }


  calculatSalary(days,staffData){
    let perDaySalary = staffData.salary/30;

   let calculatedSalary =  perDaySalary * days ;

   this.StaffList.filter(val=>{
     if(val._id == staffData._id){
       val['calculatedSalary'] = calculatedSalary  - staffData.account_balance
       val['calculatedSalary'] =  val['calculatedSalary'].toFixed(2);
     }
   })
  //  let staff = this.getStaff(staffData._id);


  //  alert(calculatedSalary)
  }


}
