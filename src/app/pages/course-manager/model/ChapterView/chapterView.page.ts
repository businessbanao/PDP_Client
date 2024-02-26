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

@Component({
  selector: "app-note-list",
  templateUrl: "./chapterView.page.html",
  styleUrls: ["./chapterView.page.scss"],
})
export class ChapterViewPageModel implements OnInit {
  public chapter;

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
    if(this.chapter.content === undefined){
      this.chapter.content = '';
    }
  }
  async toastMessage(msg:string){
    const t = await this.toastController.create({message: msg,color: 'secondary'});
    t.present();
  }

  async openChapterEdit(){
    const modal = await this.modalController.create({
      component: ChapterDetailPageModel,
      componentProps: {
         chapter:this.chapter
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      console.log("fetch new data");
      this._courseManagerService.getCourse();
    });

    return await modal.present();  
  }
  
 

  closeModal(){
    this.modalController.dismiss();
  }

  async deleteChapter(){
    const chapterId = this.chapter._id;
    this._courseManagerService.deleteChapter(chapterId).subscribe((data)=>{
      console.log(data);
      if(!((data as {error:boolean}).error)){
         this.toastMessage("chapter deleted successfully")
      }else{
        this.toastMessage("something went wrong while  deleting chapter successfully")
      }
      this.closeModal();
    });
  }



}
