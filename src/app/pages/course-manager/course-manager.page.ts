import { Component, OnInit } from '@angular/core';
import { EMIManagementService } from '../../providers/emi-management.service';
import { DatePipe } from '@angular/common';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { ChapterPageModel } from './model/ChapterList/chapter.page';
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { PopoverController, ToastController } from '@ionic/angular';
import { NoteManagementService } from '../../providers/note-management.service';
import { CourseManagementService } from '../../providers/course-management.service';


@Component({
  selector: 'app-noteManagement',
  templateUrl: './course.page.html',
  styleUrls: ['./course.page.scss'],
  providers: [DatePipe]
})

export class CourseManagerPage implements OnInit {

  public courseList: any = [];

   
  
  constructor(
    // private _noteManagementService: NoteManagementService,
    private _courseManagerService: CourseManagementService,
    private datePipe: DatePipe,
    public alertController: AlertController,

    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    public modalController: ModalController) {
  }

  ngOnInit() {
    this.getCourse();
  }


  async presentActionSheet(course) {

    const actionSheet = await this.actionSheetController.create({
      header: "Update Status",
      cssClass: 'actionsheet',
      buttons: [
        {
          text: "IN_PROGRESS",
          handler: () => {
            course.status = "IN_PROGRESS";
            this.updateCourseStatus(course);
          },
        },
        {
          text: "COMPLETED",
          handler: () => {
            course.status = "COMPLETED";

            this.updateCourseStatus(course);
          },
        },
        {
          text: "TODO",
          handler: () => {
            course.status = "TODO";

            this.updateCourseStatus(course);
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
            this.getCourse();
          },
        },
      ],
    });
    await actionSheet.present();
  }

  // get folders
  getCourse() {
    this._courseManagerService.getCourse().subscribe((resp) => {
      this.courseList = resp.object.response;
      console.log(resp.object.response);
    });
  }

 async openAddCourseModal(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Create Course',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Enter course Name',
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
          handler: (data) => {
            console.log('Confirm Ok', data);
             this._courseManagerService.createCourse({...data,userId:localStorage.getItem('adminId')}).subscribe(()=>{
              console.log('Course');
              this.getCourse();
             });
          }
        }
      ]
    });
    await alert.present();
    alert.onDidDismiss().then( ()=>{
      //  this.getCourse();
    });
    
  }


  async closeModal() {
    await this.modalController.dismiss();
  }


 async previewCourse(list){
    const modal = await this.modalController.create({
      component: ChapterPageModel,
      componentProps: {
         courseId: list._id,
         courseName:list.name
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      this._courseManagerService.getCourse();
    });

    return await modal.present();  }


  async updateCourseStatus(course){
    console.log("updateCourseStatus",course);
    const status = course.status;
    const courseId = course._id;
    console.log(status,courseId);
    this._courseManagerService.updateCourseStatus(courseId,{status}).subscribe((data)=>{
      console.log(data);
      this.getCourse();
    });
  }

}
