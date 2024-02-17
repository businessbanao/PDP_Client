import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  NgForm,
  Validators,
} from "@angular/forms";
import { TaskManagementService } from "../../../../providers/task-management.service";
import { ActivatedRoute } from "@angular/router";
import { TimeManagementService } from "../../../../providers/time-management.service";

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
  public isFreeBoard:boolean = false;
  constructor(
    public modalController: ModalController,
    public toast: ToastController,
    private _formBuilder: FormBuilder,
    private _taskManagementService: TaskManagementService,
    private activatedRoute: ActivatedRoute,
    private _timeManagementService: TimeManagementService,
  ) {}

  ngOnInit() {
    this.initTaskForm();
    if (this.data) {
      this.taskForm.patchValue(this.data);
      this.taskForm.get("id").setValue(this.data._id);
      this.taskForm
        .get("duration_start_date")
        .setValue(this.data.duration_start_date.slice(0, 10));
      this.taskForm
        .get("duration_end_date")
        .setValue(this.data.duration_end_date.slice(0, 10));
    }
  }

  async closeModal(isCreated: boolean) {
    await this.modalController.dismiss(isCreated);
  }

  updateTask(payload) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    let id = this.taskForm.get("id").value;
    this._taskManagementService
      .updateTask(id, formData)
      .subscribe(async (resp) => {
        console.log(resp.object.response);
        this.responseStr = resp.response;
        if (!resp.error) {
          let toast = await this.toast.create({
            message: "Updated Successfully",
            color: "success",
            duration: 2000,
          });

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
      task_name: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      category: new FormControl("IMP_WORK"),
      priority: new FormControl("MED", Validators.compose([Validators.required])),
      duration_type: new FormControl("day"),
      duration_start_date: new FormControl(this.isFreeBoard?'2000-01-01':this.formatDate(new Date()), [
        Validators.required,
      ]),
      duration_start_time: new FormControl(''),
      duration_end_date: new FormControl(this.isFreeBoard?'2000-01-01':this.formatDate(new Date()), [
        Validators.required,
      ]),
      recurring: new FormControl(),
      tag: new FormControl(),
      userId: new FormControl(),
    });
  }

  getMonthEndDate(inputDate) {
    // Copy the input date to avoid modifying the original date
    const date = new Date(inputDate);
  
    // Set the date to the last day of the current month
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
  
    return date;
  }

  handleDurationChange() {
    const selectedValue = this.taskForm.get('duration_type').value
    console.log("Selected Duration Type:", selectedValue);
    const startDate = this.taskForm.get('duration_start_date').value;
    const date = new Date(startDate);
    switch (selectedValue) {
      case "day":
        const defaultValue = this.formatDate(date);
        this.taskForm.setValue({
          ...this.taskForm.value,
          ...{ duration_end_date: defaultValue },
        });
        break;
      case "week":
        const nearestSunday = this.formatDate(this.getNearestSunday(date));
        console.log(nearestSunday);
        this.taskForm.setValue({
          ...this.taskForm.value,
          ...{ duration_end_date: nearestSunday },
        });
        break;
      case "month":
        const nearestMonth = this.formatDate(this.getMonthEndDate(date));
        console.log(nearestMonth);
        this.taskForm.setValue({
          ...this.taskForm.value,
          ...{ duration_end_date: nearestMonth },
        });
        break;
    }
  }

  getNearestSunday(inputDate) {
    // Copy the input date to avoid modifying the original date
    const date = new Date(inputDate);

    // Calculate the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = date.getDay();

    // Calculate the difference between the current day and Sunday
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

    // Adjust the date by adding the difference
    date.setDate(date.getDate() + daysUntilSunday);

    return date;
  }

  // // Example usage:
  // const currentDate = new Date(); // You can replace this with any date
  // const nearestSunday = getNearestSunday(currentDate);
  // console.log(nearestSunday);

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  submit(form: any) {
    if (form.status === "INVALID") {
      form.controls.task_name.markAllAsTouched();
      form.controls.category.markAllAsTouched();
      form.controls.priority.markAllAsTouched();
      form.controls.duration_type.markAllAsTouched();
      form.controls.duration_start_date.markAllAsTouched();
      form.controls.duration_end_date.markAllAsTouched();
      return;
    }

    if (!this.data) {
      this.createTask(this.taskForm);
    } else {
      this.updateTask(this.taskForm);
    }
  }

  createTask(payload: FormGroup) {
    let { duration_start_time,...formData} = JSON.parse(JSON.stringify(payload.value));
    formData["userId"] = localStorage.getItem("adminId");
    formData["incompleted_task"] = "NO";
    this._taskManagementService.createTask(formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      console.log('task_id',resp.object.response._id);
      if (!resp.error) {
        if(duration_start_time !== '' && formData.duration_type == 'day'){
           this.createTimeTask({date:formData.duration_start_date,duration_start_time,task_id:resp.object.response._id})
        }
        let toast = await this.toast.create({
          message: "created Successfully",
          color: "success",
          duration: 2000,
        });
        toast.present();
        this.closeModal(true);
      } else {
        this.closeModal(false);
      }
      this.taskForm.reset();
    });
  }



  // initTaskForm() {
  //   this.taskForm = this._formBuilder.group({
  //     id: new FormControl(""),
  //     task_id: new FormControl('', Validators.compose([Validators.required])),
  //     status: new FormControl(''),
  //     duration_start_time: new FormControl('', [Validators.required]),
  //     duration_end_time: new FormControl('', [Validators.required]),
  //     date: new FormControl(this.formatDate(new Date()), [Validators.required]),
  //     userId: new FormControl(),
  //   });
  // }

  createTimeTask(payload){
      payload["userId"] = localStorage.getItem("adminId");
      payload["incompleted_task"] = "NO";
      this._timeManagementService.createTime(payload).subscribe(async (resp) => {
        console.log(resp);
      })

  }
  
  // createTimeTask(payload) {
  //   let formData = JSON.parse(JSON.stringify(payload.value));
  //   formData["userId"] = localStorage.getItem("adminId");
  //   formData["incompleted_task"] = "NO";
  //   this._timeManagementService.createTime(formData).subscribe(async (resp) => {
  //     this.responseStr = resp.response;
  //     if (!resp.error) {
  //       let toast = await this.toast.create({
  //         message: "created Successfully",
  //         color: 'success',
  //         duration: 2000
  //       })
  //       toast.present();
  //       this.closeModal(true);
  //     } else {
  //       this.closeModal(false);
  //     }
  //     this.taskForm.reset();
  //   });
  // }




}



