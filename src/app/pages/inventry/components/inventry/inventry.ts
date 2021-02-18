import { PreviewInventryPage } from "./../preview-inventry/preview-inventry";
import { Component, ViewChild, OnInit, Inject } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ShopService } from "../../../../providers/shop.services";
import {
  ModalController,
  ActionSheetController,
  LoadingController,
} from "@ionic/angular";
import { ToastController } from "@ionic/angular";
import { UserServices } from "../../../../providers/user.services";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AccountPage } from "../../model/accounts/accounts";
import { LedgerPage } from "../../model/ledger/ledger";
import { DatePipe } from "@angular/common";
import { ManualInventryPage } from "../../model/manual-inventry/manual-inventry";
import { VendorPage } from "../../model/vendor/vendor";
import { StaffSalaryPage } from "../../model/staff-salary/staff-salary";
import { MonthlyReportPage } from "../../model/monthly-report/monthly-report";

@Component({
  selector: "page-inventry",
  templateUrl: "inventry.html",
  styleUrls: ["./inventry.scss"],
})
export class InventryPage implements OnInit {
  public amount: Number;
  public selectedMethod: any = "";
  public description: any = "";
  public inventryType = "Incoming";
  public department;
  public filter: string = "none";
  public incomingAmount = 0;
  public outgonigAmount = 0;
  public currentDate = null;

  selected = new FormControl(0);
  tabs = ["Incoming", "Outgoing"];

  public innventryList: any = [];
  public backupinnventryList: any;
  public selectedoffer: any;
  public selectedProduct: any;
  public enableClearFilter = false;
  public expense: string = "none";
  public sDate = null;
  public eDate = null;

  @ViewChild("sectionSelect", null) sectionSelect: any;

  doFilter() {
    this.sectionSelect.open();
    console.log("hello");
  }

  @ViewChild("changeTime", null) changeDateTime: any;

  changeDate = "";

  ionViewDidLoad() {
    this.changeDateTime.updateText = () => {};
  }

  handleChangeDate(changeDate: string) {
    this.resetData();
    this.changeDate = changeDate;
    this.changeDateTime._text = changeDate;
    console.log(changeDate, "changeDate");
    this.changeDate = changeDate.slice(0, 10);
    this.getInventryList("Incoming");
    this.getInventryList("Outgoing");
  }

  public isIncomingPayment: Boolean = true;
  public _shopId: any;
  constructor(
    public modalController: ModalController,
    private _shopService: ShopService,
    private _userServices: UserServices,
    private _toast: ToastController,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public actionSheetController: ActionSheetController,
    private _formBuilder: FormBuilder,
    public loadingController: LoadingController
  ) {
    // let datePipe = new DatePipe('en-US');
    // this.changeDate = datePipe.transform(new Date(), 'yyyy-MM-dd');
  }
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  // Incoming Varibales
  openingBalenceFormGroup: FormGroup;
  zIndexFormGroup: FormGroup;
  cancelDiscountFormGroup: FormGroup;
  excessinCashFormGroup: FormGroup;
  DiscountFormGroup: FormGroup;
  PartySellFormGroup: FormGroup;
  exeesFormGroup: FormGroup;
  netSaleFormGroup: FormGroup;
  leftCashFormGroup: FormGroup;
  rahulSeJmaFormGroup: FormGroup;
  manojSeJmaFormGroup: FormGroup;
  hdfcSeJmaFormGroup: FormGroup;
  uddarJamaFormGroup: FormGroup;
  jmaFormGroup: FormGroup;
  totalCashFormGroup: FormGroup;

  // outgoing Varibales
  ManojParGyaFormGroup: FormGroup;
  RahulParGyaFormGroup: FormGroup;
  DhamajiParGyaFormGroup: FormGroup;
  hdfcParGyaFormGroup: FormGroup;
  extraSpentFormGroup: FormGroup;
  milkFormGroup: FormGroup;
  rumaliFormGroup: FormGroup;
  bikeFormGroup: FormGroup;
  koylaFormGroup: FormGroup;
  silenderFormGroup: FormGroup;
  electricityFormGroup: FormGroup;
  kushiKiranaFormGroup: FormGroup;
  MoKiranaFormGroup: FormGroup;
  kirayaFormGroup: FormGroup;
  bharatDeyriFormGroup: FormGroup;
  abdulaChikenFormGroup: FormGroup;
  chikenMuttonCashFormGroup: FormGroup;
  ZeesuVegFormGroup: FormGroup;
  GarhwalFormGroup: FormGroup;
  BechaCashFormGroup: FormGroup;
  vickyFormGroup: FormGroup;
  vikramFormGroup: FormGroup;
  tatachandFormGroup: FormGroup;
  ajayFormGroup: FormGroup;
  govindFormGroup: FormGroup;
  neerajDeliveryFormGroup: FormGroup;
  AnilSaifFormGroup: FormGroup;
  DineshSaifFormGroup: FormGroup;
  uddarGyaFormGroup: FormGroup;

  //VendorIncoming
  VI_Bharat_Dairy_Group: FormGroup;
  VI_Abdullah_Chicken_Group: FormGroup;
  VI_Chicken_Mutton_Cash: FormGroup;
  VI_Zeshu_Veg_Group: FormGroup;
  VI_Garhwal_Group: FormGroup;
  VI_Gas_Cylinder_Group: FormGroup;
  VI_Coal_Group: FormGroup;

  public isIncomingBtn = true;
  public isOutgoingBtn = false;
  public isVendorIncomingBtn = false;
  public type = "Incoming";

  public searchinnventryList: any = [];
  ngOnInit() {
    //incoming forms

    this.openingBalenceFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });

    this.zIndexFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });

    this.cancelDiscountFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.DiscountFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });

    this.exeesFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.excessinCashFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.PartySellFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });

    this.netSaleFormGroup = this._formBuilder.group({});

    this.leftCashFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });

    this.rahulSeJmaFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });

    this.manojSeJmaFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });

    this.hdfcSeJmaFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });

    this.uddarJamaFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });

    this.jmaFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });

    this.totalCashFormGroup = this._formBuilder.group({});

    //outgoingForms

    this.ManojParGyaFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.RahulParGyaFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.DhamajiParGyaFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.hdfcParGyaFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.extraSpentFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.milkFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.rumaliFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.bikeFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.koylaFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.silenderFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.electricityFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.kushiKiranaFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.MoKiranaFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.kirayaFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.bharatDeyriFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.abdulaChikenFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.chikenMuttonCashFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.ZeesuVegFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });

    this.GarhwalFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.BechaCashFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.vickyFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.vikramFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.tatachandFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.ajayFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.govindFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.neerajDeliveryFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.AnilSaifFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.DineshSaifFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.uddarGyaFormGroup = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });

    // Vendor Incoming
    this.VI_Bharat_Dairy_Group = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.VI_Abdullah_Chicken_Group = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.VI_Chicken_Mutton_Cash = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.VI_Zeshu_Veg_Group = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.VI_Garhwal_Group = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.VI_Gas_Cylinder_Group = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });
    this.VI_Coal_Group = this._formBuilder.group({
      amount: ["", Validators.required],
      description: [""],
    });

    this.getDepartment("Incoming");

    this._shopId = this.route.snapshot.params.id;
    console.log(this._shopId, "_shopId");
    this.selectedoffer = this._shopId;
  }

  public IncomingValues = [];
  public OutgoingValues = [];
  public ViIncomngValues = [];
  public total = 0;
  public outGoingTotal = 0;

  submit(_formName, depId, depName) {
    if (!_formName.value.amount) {
      return;
    }

    console.log(_formName.value);
    var len = Object.values(_formName.value).length;
    if (len) {
      if (!this.ischeckExists(depId)) {
        let payload = {
          departmentName: depName,
          departmentID: depId,
          description: "",
          inventryType: "Incoming",
          ownerId: "601870f796b9f2834f045d1a",
          date: this.changeDate,
          ..._formName.value,
        };
        this.IncomingValues.push(payload);
        if (_formName.value.amount != "") {
          if (
            depName == "Cancel Bill" ||
            depName == "Discount On  Sell" ||
            depName == "Short In Cash"
          ) {
            this.total = this.total - _formName.value.amount;
          } else {
            this.total = this.total + _formName.value.amount;
          }
        }
      } else {
        this.IncomingValues.forEach((val) => {
          if (val.departmentID == depId) {
            val.amount = _formName.value.amount;
          }

          let total_value = 0;

          this.IncomingValues.forEach(function (val) {
            if (
            val.departmentName == "Cancel Bill" ||
            val.departmentName == "Discount On  Sell" ||
            val.departmentName == "Short In Cash") {
              total_value = total_value - val.amount;
            } else {
              total_value = total_value + val.amount;
            }
          });
          this.total = total_value;
        });
      }
    }
    console.log("this.IncomingValues", this.IncomingValues, len);
  }

  submitOutgoing(_formName, depId, depName) {
    if (!_formName.value.amount) {
      return;
    }

    console.log(_formName.value);
    var len = Object.values(_formName.value).length;
    if (len) {
      if (!this.isOutgoniTranscheckExists(depId)) {
        let payload = {
          departmentName: depName,
          departmentID: depId,
          description: "",
          inventryType: "Outgoing",
          ownerId: "601870f796b9f2834f045d1a",
          date: this.changeDate,
          ..._formName.value,
        };
        this.OutgoingValues.push(payload);
        if (_formName.value.amount != "") {
          this.outGoingTotal = this.outGoingTotal - _formName.value.amount;
        }
      } else {
        this.OutgoingValues.forEach((val) => {
          if (val.departmentID == depId) {
            val.amount = _formName.value.amount;
          }
          let total_value = 0;
          this.OutgoingValues.forEach(function (val) {
            total_value = total_value - val.amount;
          });
          this.outGoingTotal = total_value;
        });
      }
    }
    console.log("this.OutgoingValues", this.OutgoingValues, len);
  }

  public VI_Total = 0;
  submitVendorIncoming(_formName, depId, depName) {
    if (!_formName.value.amount) {
      return;
    }

    console.log(_formName.value);
    var len = Object.values(_formName.value).length;
    if (len) {
      if (!this.isVITranscheckExists(depId)) {
        let payload = {
          departmentName: depName,
          departmentID: depId,
          description: "",
          inventryType: "Vendor_Incoming",
          ownerId: "601870f796b9f2834f045d1a",
          date: this.changeDate,
          ..._formName.value,
        };
        this.ViIncomngValues.push(payload);
        if (_formName.value.amount != "") {
          if (
            depName == "Cancel Bill" ||
            depName == "Discount On  Sell" ||
            depName == "Short In Cash"
          ) {
            this.VI_Total = this.VI_Total - _formName.value.amount;
          } else {
            this.VI_Total = this.VI_Total + _formName.value.amount;
          }
        }
      } else {
        this.ViIncomngValues.forEach((val) => {
          if (val.departmentID == depId) {
            val.amount = _formName.value.amount;
          }

          let total_value = 0;

          this.ViIncomngValues.forEach(function (val) {
            if ( val.departmentName == "Cancel Bill" ||
            val.departmentName == "Discount On  Sell" ||
            val.departmentName == "Short In Cash") {
              total_value = total_value - val.amount;
            } else {
              total_value = total_value + val.amount;
            }
          });
          this.VI_Total = total_value;
        });
      }
    }
    console.log("this.IncomingValues", this.IncomingValues, len);
  }

  ischeckExists(depId) {
    let isexists = false;
    this.IncomingValues.forEach((val) => {
      if (val.departmentID == depId) {
        isexists = true;
      }
    });
    return isexists;
  }

  isVITranscheckExists(depId) {
    let isexists = false;
    this.ViIncomngValues.forEach((val) => {
      if (val.departmentID == depId) {
        isexists = true;
      }
    });
    return isexists;
  }

  isOutgoniTranscheckExists(depId) {
    let isexists = false;
    this.OutgoingValues.forEach((val) => {
      if (val.departmentID == depId) {
        isexists = true;
      }
    });
    return isexists;
  }

  async finalIncomingSubmit() {
    if (this.inventryList.length == 0) {
      if (!this.IncomingValues.length) {
        const toast = await this._toast.create({
          message: "Inventry Can not be empty",
          duration: 4000,
          color: "warning",
          position: "top",
          animated: true,
        });
        toast.present();
        return;
      }

      console.log(this.IncomingValues, "IncomingValues");
      this.IncomingValues.forEach((obj) => {
        this.saveTransaction(obj);
      });

      this.presentLoading();
    } else {
      const toast = await this._toast.create({
        message: "you can not save two entry for Today",
        duration: 6000,
        color: "warning",
        position: "top",
        animated: true,
      });
      toast.present();
    }
  }

  async finalOutgoingSubmit() {
    if (this.OutgoinginventryList.length == 0) {
      if (!this.OutgoingValues.length) {
        const toast = await this._toast.create({
          message: "Inventry Can not be empty",
          duration: 4000,
          color: "warning",
          position: "top",
          animated: true,
        });
        toast.present();
        return;
      }

      console.log(this.OutgoingValues);
      this.OutgoingValues.forEach((obj) => {
        this.saveTransaction(obj);
      });
      // const toast = await this._toast.create({
      //   message: "Inventry Saved Successfully",
      //   duration: 6000,
      //   color: "success",
      //   position: "top",
      //   animated: true,
      // });
      // toast.present();

      this.presentLoading();
    } else {
      const toast = await this._toast.create({
        message: "you can not save two entry for Today",
        duration: 6000,
        color: "warning",
        position: "top",
        animated: true,
      });
      toast.present();
    }
  }

  async finalVendorIncomingSubmit() {
    if (this.ViIncomngValues.length == 0) {
      return;
    }

    console.log(this.ViIncomngValues);
    this.ViIncomngValues.forEach((obj) => {
      this.saveTransaction(obj);
    });
    const toast = await this._toast.create({
      message: "Inventry Saved Successfully",
      duration: 6000,
      color: "success",
      position: "top",
      animated: true,
    });
    toast.present();

    this.presentLoading();

    // } else {
    //   const toast = await this._toast.create({
    //     message: "you can not save two entry for Today",
    //     duration: 6000,
    //     color: "warning",
    //     position: "top",
    //     animated: true,
    //   });
    //   toast.present();
    // }
  }

  async saveTransaction(payload) {
    this._shopService.SaveInventry(payload).subscribe(async (data: any) => {
      console.log(data);
      // this.getInventryList("Incoming");
      // this.getInventryList("Outgoing");
    });
  }

  public isDiscountEnable = false;
  public discount;

  filterChange() {
    console.log("filter changed", this.sDate, this.eDate);
    this.enableClearFilter = true;
  }

  // changeView() {
  //   console.log(this.selected.value);
  //   if (this.selected.value == 0) {
  //     this.getDepartment("Incoming");
  //     this.getInventryList("Incoming");
  //   } else {
  //     this.getDepartment("Outgoing");
  //     this.getInventryList("Outgoing");
  //   }
  // }

  onselectMethod(event) {
    if (this.type == "Incoming") {
      this.isIncomingBtn = true;
      this.isOutgoingBtn = false;
      this.isVendorIncomingBtn = false;
    } else if (this.type == "Outgoing") {
      this.isOutgoingBtn = true;
      this.isIncomingBtn = false;
      this.isVendorIncomingBtn = false;
    } else if (this.type == "Vendor_Incoming") {
      this.isVendorIncomingBtn = true;
      this.isOutgoingBtn = false;
      this.isIncomingBtn = false;
    }
  }

  typeChange() {
    this.enableClearFilter = true;
  }

  resetFilter() {}

  formateDate(date) {
    const d = new Date(date);
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);

    let Finaldate = `${da} ${mo} ${ye}`;
    console.log(`Finaldate`, Finaldate);
    return Finaldate;
  }

  public refershDefault = {
    target: {
      complete: function () {
        return true;
      },
    },
  };

  async saveInventry() {
    console.log(this.department, "this.department");
    if (this.amount == null || this.department == "") {
      return;
    }

    this._shopService
      .SaveInventry({
        departmentName: this.department.departmentName,
        departmentID: this.department._id,
        date: this.currentDate,
        amount: this.amount,
        ownerId: "",
        inventryType: this.selected.value == 0 ? "Incoming" : "Outgoing",
        description: this.description,
      })
      .subscribe(async (data: any) => {
        console.log(data);
        if (data) {
          const toast = await this._toast.create({
            message: "Inventry Saved Successfully",
            duration: 3000,
            color: "success",
            position: "top",
            animated: true,
          });
          this.department = "";
          this.amount = null;
          this.inventryType = "";
          this.description = "";
          toast.present();
        }
      });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Please wait...",
      duration: 5000,
    });
    await loading.present();

    const toast = await this._toast.create({
      message: "Inventry Saved Successfully",
      duration: 4000,
      color: "success",
      position: "top",
      animated: true,
    });
    toast.present();

    setTimeout(() => {
      this.openLedgerModal();
    }, 5000);

    const { role, data } = await loading.onDidDismiss();
    console.log("Loading dismissed!");
  }

  openDialog(description) {
    this.dialog.open(DescriptionModelDialog, {
      data: {
        des: description,
      },
    });
  }

  async presentActionSheet() {
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
          text: "Ledger",
          role: "destructive",
          icon: "folder-outline",

          handler: () => {
            this.openLedgerModal();
          },
        },
        {
          text: "Manual Entry",
          role: "destructive",
          icon: "calendar-outline",

          handler: () => {
            this.openManualEntryModal();
          },
        },
        {
          text: "Check Balance",
          role: "destructive",
          icon: "card-outline",

          handler: () => {
            this.openVendorBalenceModal();
          },
        },
        {
          text: "Staff Salary Management",
          role: "destructive",
          icon: "calculator-outline",

          handler: () => {
            this.openStaffSalaryModal();
          },
        },
        {
          text: "Monthly Report",
          role: "destructive",
          icon: "calendar-outline",

          handler: () => {
            this.openMonthlyReportModal();
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
      component: AccountPage,
    });

    modal.onDidDismiss().then((dataReturned) => {});

    return await modal.present();
  }

  async openVendorBalenceModal() {
    const modal = await this.modalController.create({
      component: VendorPage,
    });

    modal.onDidDismiss().then((dataReturned) => {});

    return await modal.present();
  }

  async openManualEntryModal() {
    const modal = await this.modalController.create({
      component: ManualInventryPage,
    });

    modal.onDidDismiss().then((dataReturned) => {});

    return await modal.present();
  }

  async openLedgerModal() {
    this.resetData();
    const modal = await this.modalController.create({
      component: LedgerPage,
    });

    modal.onDidDismiss().then((dataReturned) => {
      // this.resetData()
    });

    return await modal.present();
  }

  async openStaffSalaryModal() {
    this.resetData();
    const modal = await this.modalController.create({
      component: StaffSalaryPage,
    });

    modal.onDidDismiss().then((dataReturned) => {
      // this.resetData()
    });

    return await modal.present();
  }

  async openMonthlyReportModal() {
    this.resetData();
    const modal = await this.modalController.create({
      component: MonthlyReportPage,
    });

    modal.onDidDismiss().then((dataReturned) => {
      // this.resetData()
    });

    return await modal.present();
  }

  async openPreviewModel(list, type) {
    let total = 0;
    if (type == "Incoming") {
      total = this.total;
    } else if (type == "Outgoing") {
      total = this.outGoingTotal;
    } else if (type == "Vendor Incoming") {
      total = this.VI_Total;
    }

    const modal = await this.modalController.create({
      component: PreviewInventryPage,
      componentProps: {
        inventryList: list,
        total: total,
        type: type,
      },
    });

    modal.onDidDismiss().then((dataReturned) => {
      // this.resetData()
    });

    return await modal.present();
  }

  public Department;
  getDepartment(type) {
    this._shopService.getDepartments(type).subscribe((data: any) => {
      this.Department = data.response;
      console.log(data, "--------------------------", this.Department);
    });
  }

  public inventryList = [];
  public OutgoinginventryList = [];
  getInventryList(type) {
    this._shopService
      .listInventry(type, this.changeDate)
      .subscribe((data: any) => {
        if (type == "Incoming") {
          this.inventryList = data.response;
          // this.incomingAmount = this.sum(this.inventryList, "amount");
        } else {
          this.OutgoinginventryList = data.response;
          // this.outgonigAmount = this.sum(this.OutgoinginventryList, "amount");
        }
        this.sum(this.inventryList, "amount");
        console.log(data, "--------------------------", this.inventryList);
      });
  }

  sum(items, prop) {
    let total_value = 0;
    items.forEach(function (val) {
      if ( val.departmentName == "Cancel Bill" ||
      val.departmentName == "Discount On  Sell" ||
      val.departmentName == "Short In Cash") {
        total_value = total_value - val.amount;
      } else {
        total_value = total_value + val.amount;
      }
    });
    return total_value;
  }



  resetData() {
    this.openingBalenceFormGroup.reset();
    this.zIndexFormGroup.reset();
    this.cancelDiscountFormGroup.reset();
    this.excessinCashFormGroup.reset();
    this.DiscountFormGroup.reset();
    this.PartySellFormGroup.reset();
    this.exeesFormGroup.reset();
    this.netSaleFormGroup.reset();
    this.leftCashFormGroup.reset();
    this.rahulSeJmaFormGroup.reset();
    this.manojSeJmaFormGroup.reset();
    this.hdfcSeJmaFormGroup.reset();
    this.uddarJamaFormGroup.reset();
    this.jmaFormGroup.reset();
    this.totalCashFormGroup.reset();

    // outgoing Varibales
    this.ManojParGyaFormGroup.reset();
    this.RahulParGyaFormGroup.reset();
    this.DhamajiParGyaFormGroup.reset();
    this.hdfcParGyaFormGroup.reset();
    this.extraSpentFormGroup.reset();
    this.milkFormGroup.reset();
    this.rumaliFormGroup.reset();
    this.bikeFormGroup.reset();
    this.koylaFormGroup.reset();
    this.silenderFormGroup.reset();
    this.electricityFormGroup.reset();
    this.kushiKiranaFormGroup.reset();
    this.MoKiranaFormGroup.reset();
    this.kirayaFormGroup.reset();
    this.bharatDeyriFormGroup.reset();
    this.abdulaChikenFormGroup.reset();
    this.chikenMuttonCashFormGroup.reset();
    this.ZeesuVegFormGroup.reset();
    this.GarhwalFormGroup.reset();
    this.BechaCashFormGroup.reset();
    this.vickyFormGroup.reset();
    this.vikramFormGroup.reset();
    this.tatachandFormGroup.reset();
    this.ajayFormGroup.reset();
    this.govindFormGroup.reset();
    this.neerajDeliveryFormGroup.reset();
    this.AnilSaifFormGroup.reset();
    this.DineshSaifFormGroup.reset();
    this.uddarGyaFormGroup.reset();

    this.VI_Bharat_Dairy_Group.reset();
    this.VI_Abdullah_Chicken_Group.reset();
    this.VI_Chicken_Mutton_Cash.reset();
    this.VI_Zeshu_Veg_Group.reset();
    this.VI_Garhwal_Group.reset();
    this.VI_Gas_Cylinder_Group.reset();
    this.VI_Coal_Group.reset();

    this.IncomingValues = [];
    this.OutgoingValues = [];
    // this.vendo
    this.ViIncomngValues = [];
    this.total = 0;
    this.outGoingTotal = 0;
    this.VI_Total = 0;
    // this.changeDate ='';
  }
}

@Component({
  selector: "dialog-elements-example-dialog",
  templateUrl: "description-model.html",
})
export class DescriptionModelDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _formBuilder: FormBuilder
  ) {}
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ["", Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required],
    });
  }
}
