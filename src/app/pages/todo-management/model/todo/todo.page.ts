import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm, Validators } from "@angular/forms";
import { TaskManagementService } from '../../../../providers/task-management.service';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-todo",
  templateUrl: "./todo.page.html",
  styleUrls: ["./todo.page.scss"],
})
export class TododPageModel implements OnInit {

  taskForm: FormGroup;
  public isEditMode: boolean = false;
  public data: any;
  public responseStr: string;

  constructor(
    public modalController: ModalController,
    public toast: ToastController,
    private _formBuilder: FormBuilder,
    private _taskManagementService: TaskManagementService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.initTaskForm();
    if (this.data) {
      this.taskForm.patchValue(this.data);
      this.taskForm.get('id').setValue(this.data._id);
      this.taskForm.get('duration_start_date').setValue(this.data.duration_start_date.slice(0, 10));
      this.taskForm.get('duration_end_date').setValue(this.data.duration_end_date.slice(0, 10));
    }
  }

  async closeModal(isCreated: boolean) {
    await this.modalController.dismiss(isCreated);
  }

  updateTask(payload) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    let id = this.taskForm.get("id").value;
    this._taskManagementService.updateTask(id, formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      if (!resp.error) {
        let toast = await this.toast.create({
          message: "Updated Successfully",
          color: 'success',
          duration: 2000
        })
        toast.present();
        this.closeModal(true);
      } else {
        this.closeModal(false);
      }
      this.taskForm.reset();
    });
    this.isEditMode = false;
  }

  initTaskForm() {
    this.taskForm = this._formBuilder.group({
      id: new FormControl(""),
      task_name: new FormControl('', Validators.compose([Validators.required])),
      category: new FormControl('DAILY_ROUTINE'),
      priority: new FormControl('', Validators.compose([Validators.required])),
      duration_type: new FormControl('day'),
      duration_start_date: new FormControl('',[Validators.required]),
      duration_end_date: new FormControl('',[Validators.required]),
      recurring: new FormControl(),
      tag: new FormControl(),
      userId: new FormControl(),
    });
  }

  submit(form:any) {

    if (form.status === "INVALID") {
      form.controls.task_name.markAllAsTouched();
      form.controls.category.markAllAsTouched();
      form.controls.priority.markAllAsTouched();
      form.controls.duration_type.markAllAsTouched();
      form.controls.duration_start_date.markAllAsTouched();
      form.controls.duration_end_date.markAllAsTouched();
      return
    }


    if (!this.data) {
      this.createTask(this.taskForm);
    } else {
      this.updateTask(this.taskForm);
    }
  }

  createTask(payload: FormGroup) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    formData["userId"] = localStorage.getItem("adminId");
    formData["incompleted_task"] = "NO";
    this._taskManagementService.createTask(formData).subscribe(async (resp) => {
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
      this.taskForm.reset();
    });
  }

}
