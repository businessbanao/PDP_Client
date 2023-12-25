import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm, Validators } from "@angular/forms";
import { RoutineManagementService } from '../../../../providers/routine-management.service';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-addEditRoutine",
  templateUrl: "./addEditRoutine.page.html",
  styleUrls: ["./addEditRoutine.page.scss"],
})
export class AddEditRoutineModel implements OnInit {

  routineForm: FormGroup;
  public isEditMode: boolean = false;
  public data: any;
  public responseStr: string;

  constructor(
    public modalController: ModalController,
    public toast: ToastController,
    private _formBuilder: FormBuilder,
    private _routineManagementService: RoutineManagementService,
  ) { }

  ngOnInit() {
    this.initroutineForm();

    if (this.data) {
      this.routineForm.patchValue(this.data);
      this.routineForm.get('id').setValue(this.data._id);
    }
  }

  async closeModal(isCreated: boolean) {
    await this.modalController.dismiss(isCreated);
  }

  updateRoutine(payload) {
    // let formData = JSON.parse(JSON.stringify(payload.value));
    // let id = this.routineForm.get("id").value;
    // this._routineManagementService.updateTask(id, formData).subscribe(async (resp) => {
    //   this.responseStr = resp.response;
    //   if (!resp.error) {
    //     let toast = await this.toast.create({
    //       message: "Updated Successfully",
    //       color: 'success',
    //       duration: 2000
    //     })
    //     toast.present();
    //     this.closeModal(true);
    //   } else {
    //     this.closeModal(false);
    //   }
    //   this.routineForm.reset();
    // });
    // this.isEditMode = false;
  }

  initroutineForm() {
    this.routineForm = this._formBuilder.group({
      id: new FormControl(""),
      name: new FormControl('', Validators.compose([Validators.required])),
      period: new FormControl('night', Validators.compose([Validators.required])),
      userId: new FormControl(),
    });
  }

  submit(form:any) {

    if (form.status === "INVALID") {
      form.controls.name.markAllAsTouched();
      form.controls.period.markAllAsTouched();
      return
    }

    if (!this.data) {
      this.createRoutine(this.routineForm);
    } else {
      this.updateRoutine(this.routineForm);
    }
  }

  createRoutine(payload: FormGroup) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    formData["userId"] = localStorage.getItem("adminId");
    this._routineManagementService.createRoutine(formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      if (!resp.error) {
        let toast = await this.toast.create({
          message: "created Successfully",
          color: 'success',
          duration: 2000
        })
        toast.present();
        this.closeModal(true);
      } else {
        this.closeModal(false);
      }
      this.routineForm.reset();
    });
  }

}
