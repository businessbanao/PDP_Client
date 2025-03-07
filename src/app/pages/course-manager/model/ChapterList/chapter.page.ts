import { Component, OnInit } from "@angular/core";
import {
  ActionSheetController,
  AlertController,
  ModalController,
  ToastController,
} from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { NoteManagementService } from "../../../../providers/note-management.service";
import { ActivatedRoute } from "@angular/router";
import { CourseManagementService } from "../../../../providers/course-management.service";
import { ChapterDetailPageModel } from "../ChapterDetail/chapterDetail.page";
import { ChapterViewPageModel } from "../ChapterView/chapterView.page";

@Component({
  selector: "app-note-list",
  templateUrl: "./chapter.page.html",
  styleUrls: ["./chapter.page.scss"],
})
export class ChapterPageModel implements OnInit {
  public courseId;
  public courseName;
  public chapterList: any = [];

  constructor(
    public actionSheetController:ActionSheetController,
    public _courseManagerService: CourseManagementService,
    public modalController: ModalController,
    public toastController: ToastController,
    public alertController: AlertController,
    private _formBuilder: FormBuilder,
    private _noteManagementService: NoteManagementService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getChapter();
  }

  public bkpchapterList = [];
  searchChapter(value) {
    if (value && value.length) {
      this.chapterList = this.bkpchapterList.filter((obj) => {
        return obj.name ? obj.name.toLowerCase().includes(value.toLowerCase()) : false;
      })
    } else {
      this.chapterList = JSON.parse(JSON.stringify(this.bkpchapterList))
    }
  }

  handleRefresh(event) {
    setTimeout(() => {
     this.ngOnInit();
      event.target.complete();
    }, 2000);
  }

  async getChapter(){
    this._courseManagerService.getChapter(this.courseId).subscribe((resp)=>{
      this.chapterList = resp.object.response;
      this.bkpchapterList = JSON.parse(JSON.stringify(resp.object.response));
      console.log(this.chapterList)
    });
  }

  closeModal(){
    this.modalController.dismiss();
  }


  async openChapterDetails(chapter){
    const modal = await this.modalController.create({
      component: ChapterViewPageModel,
      componentProps: {
         chapter:chapter
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      console.log("fetch new data");
      this._courseManagerService.getCourse();
    });

    return await modal.present();  
  }

  async updateChapterStatus(chapter){
    console.log("update status",chapter);
    const status = chapter.status;
    const courseId = chapter._id;
    console.log(status,courseId);
    this._courseManagerService.updateChapterStatus(courseId,{status}).subscribe((data)=>{

    });
  }

  async addChapter() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: `Create Chapter for ${this.courseName}`,
      inputs: [
        {
          name: "name",
          type: "text",
          placeholder: "Enter chapter Name",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: "Ok",
          handler: (data) => {
            console.log("Confirm Ok", data);
            this._courseManagerService
              .createChapter({
                ...data,
                courseId: this.courseId
              })
              .subscribe(() => {
                this.getChapter();

                console.log("Course");
              });
          },
        },
      ],
    });
    await alert.present();
    alert.onDidDismiss().then(() => {
    });
  }


  
}
