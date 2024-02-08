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

@Component({
  selector: "app-note-list",
  templateUrl: "./chapterDetail.page.html",
  styleUrls: ["./chapterDetail.page.scss"],
})
export class ChapterDetailPageModel implements OnInit {
  public chapter;
  ckeditorContent: string = '<p>Some html</p>';

  constructor(
    public actionSheetController:ActionSheetController,
    public _courseManagerService: CourseManagementService,
    public modalController: ModalController,
    public toastController: ToastController,
    public alertController: AlertController,
    private _formBuilder: FormBuilder,
    private _noteManagementService: NoteManagementService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.chapter.content=this.chapter.content+' ';
  }

  addLink() {
    // Assuming you want to add an empty link
    this.chapter.link.push('');
  }



  removeLink(index: number) {
    // Confirm before removing the link
    this.presentRemoveLinkConfirm(index);
  }

  async presentRemoveLinkConfirm(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to remove this link?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Do nothing if canceled
          },
        },
        {
          text: 'Remove',
          handler: () => {
            // Remove the link if confirmed
            this.chapter.link.splice(index, 1);
          },
        },
      ],
    });

    await alert.present();
  }


  addVideoLink() {
    // Assuming you want to add an empty video link
    this.chapter.videoId.push('');
  }

  removeVideoLink(index: number) {
    // Confirm before removing the video link
    this.presentRemoveVideoLinkConfirm(index);
  }

  async presentRemoveVideoLinkConfirm(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to remove this video link?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Do nothing if canceled
          },
        },
        {
          text: 'Remove',
          handler: () => {
            // Remove the video link if confirmed
            this.chapter.videoId.splice(index, 1);
          },
        },
      ],
    });

    await alert.present();
  }


  saveChapter(){
    console.log(this.chapter);
    this._courseManagerService.updateChapterStatus(this.chapter._id,this.chapter).subscribe(()=>{
      console.log("updated chapter");
    });
  }
 
  trackByIndex(index: number, obj: any): any {
    return index;
  }
 

  closeModal(){
    this.modalController.dismiss();
  }



}
