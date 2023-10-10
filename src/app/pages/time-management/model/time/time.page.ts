import { Component, OnInit } from "@angular/core";
import { ActionSheetController, ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TimeManagementService } from "../../../../providers/time-management.service";
import { TaskManagementService } from "../../../../providers/task-management.service";

@Component({
  selector: "app-time",
  templateUrl: "./time.page.html",
  styleUrls: ["./time.page.scss"],
})
export class TimePageModel implements OnInit {

  taskForm: FormGroup;
  public isEditMode: boolean = false;
  public data: any;
  public responseStr: string;

  constructor(
    public modalController: ModalController,
    public toast: ToastController,
    private _formBuilder: FormBuilder,
    private _timeManagementService: TimeManagementService,
    private activatedRoute: ActivatedRoute,
    private _taskManagementService: TaskManagementService,
    public actionSheetController: ActionSheetController,


  ) { }

  ngOnInit() {
    this.initTaskForm();
    this.getTaskList();
    
  }

  async closeModal(isCreated: boolean) {
    await this.modalController.dismiss(isCreated);
  }

  updateTask(payload) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    let id = this.taskForm.get("id").value;
    this._timeManagementService.updateTime(id, formData).subscribe(async (resp) => {
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
      task_id: new FormControl('', Validators.compose([Validators.required])),
      status: new FormControl(''),
      due_date: new FormControl(''),
      due_time: new FormControl(''),
      duration_start_time: new FormControl(),
      duration_end_time: new FormControl(),
      userId: new FormControl(),
    });
  }

  createTask(payload: FormGroup) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    formData["userId"] = localStorage.getItem("adminId");
    formData["incompleted_task"] = "NO";
    this._timeManagementService.createTime(formData).subscribe(async (resp) => {
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

  public taskList=[];
  getTaskList() {
    let payload = {};

    this._timeManagementService.getTask(payload).subscribe(resp => {
      // debugger
      this.taskList = resp.object.response;
      if (this.data) {
        this.taskForm.patchValue(this.data);
        this.taskForm.get('id').setValue(this.data._id);
        this.taskForm.get('due_date').setValue(this.data.due_date.slice(0, 10));
        this.taskForm.get('task_id').setValue(this.data.task_id ? this.data.task_id._id : "");
      }
       
    });
  }

  

}