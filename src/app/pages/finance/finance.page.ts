import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FinanceService } from "../../providers/finance.service";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { ActionSheetController, ModalController } from "@ionic/angular";
import { AccountPageModel } from "./model/account/account.page";
import { AccountService } from "../../providers/account.service";
import { LedgerPageModel } from "./model/ledger/ledger.page";
import { DatePipe } from "@angular/common";
import { environment } from "../../../environments/environment";
import {
  Camera,
  CameraOptions,
  PictureSourceType,
} from "@ionic-native/camera/ngx";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { format } from "highcharts";
import { PaymentPageModel } from "./model/payment/payment.page";
import { SwUpdate } from "@angular/service-worker";

@Component({
  selector: "app-finance",
  templateUrl: "./finance.page.html",
  styleUrls: ["./finance.page.scss"],
  providers: [DatePipe],
})
export class FinancePage implements OnInit {
  images = [];
  public myphoto: any;
  public baseUrl: String = environment.baseUrl + "/";
  public url;
  today: any;
  selectedDate: any;
  public dateFilter;
  public accountFilter = "";
  public inventryTypeFilter = "";
  prevInventoryList: any = [];

  public isEditMode: boolean;
  public finance: string;
  public responseStr: string;
  public inventory_data: any;
  inventoryList: any = [];
  inventoryForm: FormGroup;
  fileForm: FormGroup;
  tabName: string = "mannual_entry";
  accounts: any;

  totalIncoming: number = 0;
  totalOutgoing: number = 0;



  constructor(
    private _datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private _financeService: FinanceService,
    private _accountService: AccountService,
    private _formBuilder: FormBuilder,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    private camera: Camera,
    private transfer: FileTransfer,
    private swUpdate: SwUpdate,

  ) {
    swUpdate.available.subscribe((swupdate)=>{
      console.log({swupdate});
    })
   }

  ngOnInit() {
    this.finance = this.activatedRoute.snapshot.paramMap.get("id");
    this.initFileForm();
    this.getAccounts();
    // this.dateFilter = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.dateFilter = this.dateFormater(new Date()).slice(0,7);
    this.applyFilter();
    this.initinventoryForm();
  }

  formatDate(currentDate) {
    if (!currentDate) {
      return;
    }
    // alert("Called")
    var d = new Date(currentDate),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  initinventoryForm() {
    this.inventoryForm = this._formBuilder.group({
      account_id: new FormControl(),
      inventryType: new FormControl('debit'),
      userId: new FormControl(),
      amount: new FormControl(),
      description: new FormControl(),
      date: new FormControl(this.formatDate(new Date())),
      id: new FormControl(""),
    });
    // this.inventoryForm.get('date').setValue(this.formatDate(new Date()));
    // this.inventoryForm.get('account_id').valueChanges.subscribe(()=>{
      //   this.inventoryForm.get('inventryType').setValue("debit");
      // })
    }
    
        initFileForm(){
          this.fileForm = this._formBuilder.group({
            file: new FormControl()
          });
        }

        onFileChange(event: any): void {
          const file = (event.target as HTMLInputElement).files[0];
          console.log(file);
          this.fileForm.patchValue({
            file: file
          });
          this.fileForm.get('file').updateValueAndValidity();
        }

        onSubmit(formGroup:FormGroup): void {
          // const formData = JSON.parse(formGroup.value);
          const formData = new FormData();
          formData.append('file', formGroup.get('file').value);
          this._financeService.uploadFile(formData).subscribe(data => {
            console.log(data);
          })

          // Handle the form submission here, including the file
          // const formData = new FormData();
          // console.log(this.fileForm.get('file').value);
          // let formData = JSON.parse(JSON.stringify(payload.value));

          // formData.append('file', this.fileForm.get('file').value);
          // console.log('Form data to submit:', formData);
          // Perform the actual form submission using a service or API call
        }

  createInventory(payload: FormGroup) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    formData["userId"] = localStorage.getItem("adminId");
    this._financeService.createInventory(formData).subscribe((resp) => {
      this.responseStr = resp.response;
      this.tabName = "inventory_list";
      this.isEditMode = false;
      this.applyFilter();
    });
  }

  editInventory(data) {
    this.tabName = "mannual_entry";
    this.isEditMode = true;
    this.inventoryForm.patchValue(data);
    this.inventoryForm.get("id").setValue(data._id);
    this.inventoryForm.get("account_id").setValue(data.account_id._id);
    this.inventoryForm.get("date").setValue(data.date.slice(0, 10));
  }

  updateInventory(payload: FormGroup) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    let id = this.inventoryForm.get("id").value;
    this._financeService.updateInventory(id, formData).subscribe((resp) => {
      this.responseStr = resp.response;
      this.tabName = "inventory_list";
      this.isEditMode = false;
      this.applyFilter();
    });
  }

  deleteInventory(id) {
    this._financeService.deleteInventory(id).subscribe((resp) => {
      this.responseStr = resp.response;
      this.tabName = "inventory_list";
      this.isEditMode = false;
      this.applyFilter();
    });
  }

  // getInventory() {
  //   this._financeService.getInventory(this.page).subscribe((resp) => {
  //     this.inventoryList = resp.response;
  //   });
  // }

  public bkpInvenrryList = []
  applyFilter() {
    let dateTemp = new Date(this.dateFilter);
    var firstDay = this.dateFormater(new Date(dateTemp.getFullYear(), dateTemp.getMonth(), 1));
    var lastDay = this.dateFormater(new Date(dateTemp.getFullYear(), dateTemp.getMonth() + 1, 0));

    let payload = {
      startDate: firstDay,
      endDate: lastDay,
    };

    if (this.inventryTypeFilter) {
      payload['inventryType'] = this.inventryTypeFilter
    }

    if (this.accountFilter) {
      payload['account_id'] = this.accountFilter
    }

    this._financeService
      .filterInventory(payload)
      .subscribe((resp: any) => {
        this.inventoryList = resp.object.response;
        this.bkpInvenrryList = JSON.parse(JSON.stringify(this.inventoryList));



        // if (this.inventryTypeFilter == "debit" || this.inventryTypeFilter == "credit") {
        //   this.inventoryList = this.bkpInvenrryList.filter((list) => {
        //     return list.inventryType == this.inventryTypeFilter
        //   })
        // }

        // if (this.accountFilter) {
        //   this.inventoryList = this.bkpInvenrryList.filter((list) => {
        //     return list.account_id == this.accountFilter
        //   })
        // }

        // if (this.dateFilter == '2023-07') {
        //   this.inventoryList = this.bkpInvenrryList.filter((list) => {
        //     return list.date ? list.date.slice(0, 7) == '2023-07' : false
        //   })
        // }

        // if (this.dateFilter == '2023-08') {
        //   this.inventoryList = this.bkpInvenrryList.filter((list) => {
        //     return list.date ? list.date.slice(0, 7) == '2023-08' : false
        //   })
        // }

        // if (this.dateFilter == '2023-09') {
        //   this.inventoryList = this.bkpInvenrryList.filter((list) => {
        //     return list.date ? list.date.slice(0, 7) == '2023-09' : false
        //   })
        // }


        this.totalIncoming = 0;
        this.totalOutgoing = 0;

        this.inventoryList.filter(invntry => invntry.inventryType == "credit").forEach(element => {
          this.totalIncoming += Number(element.amount);
        });
        this.inventoryList.filter(invntry => invntry.inventryType == "debit").forEach(element => {
          this.totalOutgoing += Number(element.amount);
        });
      });
  }

  dateFormater(inputDate) {
    let tempDate = new Date(inputDate);
    let date =
      tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate();
    let month =
      tempDate.getMonth() + 1
        ? "0" + (tempDate.getMonth() + 1)
        : tempDate.getMonth() + 1;
    let year = tempDate.getFullYear();
    if (!isNaN(tempDate.getTime())) {
      return year + "-" + month + "-" + date;
    } else {
      return "";
    }
  }

  async presentActionSheet() {
    this.isEditMode = false;
    const actionSheet = await this.actionSheetController.create({
      header: "",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Accounts",
          role: "destructive",
          icon: "key-outline",
          handler: () => {
            this.openAaccountsModal();
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

  async openAaccountsModal() {
    const modal = await this.modalController.create({
      component: AccountPageModel,
    });
    modal.onDidDismiss().then((dataReturned) => { });
    return await modal.present();
  }

  async openLedgerModal() {
    const modal = await this.modalController.create({
      component: LedgerPageModel,
    });
    modal.onDidDismiss().then((dataReturned) => { });
    return await modal.present();
  }

  async openPaymentModal(){
    const modal = await this.modalController.create({
      component: PaymentPageModel
    });
    modal.onDidDismiss().then((dataReturned) => { });
    return await modal.present();
    }

  segmentChanged(tabData: any) {
    console.log(this.tabName)
    if (this.tabName == "mannual_entry" && this.isEditMode) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
      this.inventoryForm.reset();
    }
    this.tabName = tabData.detail.value;

    if(this.tabName == 'ledger'){
      this.openLedgerModal();
    }

    if(this.tabName === 'pay'){
      this.openPaymentModal();
    }
  }

  getAccounts() {
    this._accountService

      .getAccount(localStorage.getItem("adminId"))
      .subscribe((resp) => {
        this.accounts = resp.object.response;
      });
  }

  public page = {
    limit: 5,
    skip: 0,
  };

  loadData(event) {
    // let date = this.dateFormater(this.dateFilter);
    // this.page.limit = this.page.limit;
    // this.page.skip = this.page.skip + 5;

    // this._financeService.filterInventory(date, date, this.accountFilter, this.inventryTypeFilter, this.page).subscribe((resp:any) => {
    //   if (event) {
    //     setTimeout(() => {
    //       event.target.complete();
    //       // debugger
    //       this.inventoryList = this.inventoryList.concat(resp.response);
    //       // this.getAvgReview();
    //     }, 1800);
    //   }
    // });

    // this._financeService.getInventory(this.page).subscribe((resp) => {
    //   // this.inventoryList = resp.response;

    //   if (event) {
    //     setTimeout(() => {
    //       event.target.complete();
    //       this.inventoryList = this.inventoryList.concat(resp.response);
    //       // this.getAvgReview();
    //     }, 1800);
    //   }
    // });
  }

  async selectImagefromMobille() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [
        {
          text: "Load from Library",
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: "Use Camera",
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    };

    this.camera.getPicture(options).then(
      (imageData) => {
        this.myphoto = "data:image/jpeg;base64," + imageData;
        this.uploadImage();
      },
      (err) => {
        console.log("err: ", err);
      }
    );
  }

  uploadImage() {
    const fileTransfer: FileTransferObject = this.transfer.create();
    var random = Math.floor(Math.random() * 100);
    let options: FileUploadOptions = {
      fileKey: "photo",
      fileName: "myImage_" + random + ".jpg",
      chunkedMode: false,
      httpMethod: "post",
      mimeType: "image/jpeg",
      headers: {
        __authorization_x_token: localStorage.getItem("AuthToken") || "",
      },
    };

    let result;

    console.log("this.baseUrl", this.baseUrl);

    fileTransfer
      .upload(
        this.myphoto,
        `${this.baseUrl}api/v1/Admin/saveAllImages`,
        options
      )
      .then(
        async (data) => {
          result = data;
          console.log(result, "success");
          let _data = JSON.parse(result.response);
          console.log(data);
          this.url = _data.response.s3Url;

          console.log(this.url, "url");
          this.inventoryForm.get("images").setValue(this.url);
          alert(
            "data " +
            JSON.stringify(result) +
            JSON.parse(result.response).object
          );

          console.log(this.images, "this.images");
        },
        (err) => {
          console.log(err);
          alert("Error" + err + JSON.stringify(err));
          // loader.dismiss();
        }
      );
  }
}
