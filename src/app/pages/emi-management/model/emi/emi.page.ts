import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { EMIManagementService } from '../../../../providers/emi-management.service';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-emi",
  templateUrl: "./emi.page.html",
  styleUrls: ["./emi.page.scss"],
})
export class EMIPageModel implements OnInit {
  
  emiForm: FormGroup;
  public isEditMode: boolean = false;
  public data:any;
  public responseStr: string;
  
  constructor(
    public modalController: ModalController,
    public toast:ToastController,
    private _formBuilder: FormBuilder,
    private _emiManagementService:EMIManagementService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.initEmiForm();
    if(undefined != this.data){
      this.emiForm.patchValue(this.data);
      this.emiForm.get('id').setValue(this.data._id);
      this.emiForm.get('date').setValue(this.data.date.slice(0,10));
    }

  }
  
  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }

  updateEmi(payload) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    let id = this.emiForm.get("id").value;
    this._emiManagementService.updateEmi(id, formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      let toast = await this.toast.create({
        message:"Updated Successfully",
        color:'success',
        duration:2000
      })
      toast.present();
      this.emiForm.reset();
      this.closeModal();
    });
    this.isEditMode = false;
  }

  initEmiForm() {
    this.emiForm = this._formBuilder.group({
      task_name: new FormControl(),
      userId: new FormControl(),
      incompleted_task: new FormControl(),
      priority: new FormControl(),
      date: new FormControl(), 
      id: new FormControl(""),
    });
  }

  createEmi(payload: FormGroup) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    formData["userId"] = localStorage.getItem("adminId");
    formData["incompleted_task"] = "NO";
    this._emiManagementService.createEmi(formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      let toast = await this.toast.create({
        message:"created Successfully",
        color:'success',
        duration:2000
      })
      toast.present();
      this.emiForm.reset();
      this.closeModal();
    });
  }

}
