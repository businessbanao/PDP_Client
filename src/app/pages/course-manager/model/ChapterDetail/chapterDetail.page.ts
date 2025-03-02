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
  public config: any;
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
    this.config = this.getConfigOfCKEditor();

  }

  public getConfigOfCKEditor(): any {
    const toolbarGroups = [
      '/',
      { name: 'document', groups: ['mode', 'doctools', 'document','Source'] },
      { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
      { name: 'forms', groups: ['forms'] },
      '/',
      { name: 'clipboard', groups: ['clipboard', 'undo'] },
      { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
      '/',
      { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
      { name: 'links', groups: ['links'] },
      { name: 'styles', groups: ['styles'] },
      { name: 'colors', groups: ['colors'] },
      { name: 'tools', groups: ['tools'] },
      { name: 'others', groups: ['others'] },
      { name: 'about', groups: ['about'] },
      { name: 'insert', groups: ['codesnippet'] }
    ];
    // const removeButtons: string = 'Templates,Save,NewPage,Print,Replace,Scayt,SelectAll,Form,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Blockquote,CreateDiv,Language,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,ShowBlocks,About,Checkbox,Find,Preview,Styles,Format,Anchor';

    return {
      toolbarGroups: toolbarGroups,
      removeButtons: '',
      disableNativeSpellChecker: false,
      ignoreEmptyParagraphValue: true,
      extraPlugins: "codesnippet",
      codeSnippet_theme: 'monokai',
      height:1500,
      removePlugins: 'notification,notificationaggregator',
      codeSnippet_languages: { javascript: 'JavaScript', html: 'html' }
    };
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
