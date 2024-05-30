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
// import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
// import { HtmlEmbed } from '@ckeditor/ckeditor5-html-embed';
import HtmlEmbed from '@ckeditor/ckeditor5-html-embed/src/htmlembed';

@Component({
  selector: "app-note-list",
  templateUrl: "./chapterView.page.html",
  styleUrls: ["./chapterView.page.scss"],
})
export class ChapterViewPageModel implements OnInit {
  public chapter;

  constructor(
    public actionSheetController: ActionSheetController,
    public _courseManagerService: CourseManagementService,
    public modalController: ModalController,
    public toastController: ToastController,
    public alertController: AlertController,
    private _formBuilder: FormBuilder,
    private _noteManagementService: NoteManagementService,
    private activatedRoute: ActivatedRoute,
  ) { }

  public config: any;
  ngOnInit() {
    if (!this.chapter.content) {
      this.chapter.content = '';
    }
    this.config = this.getConfigOfCKEditor();
    this.config.readOnly = true;
    
  //   this.config.iframe_attributes = function (iframe) {
  //     var youtubeOrigin = 'https://www.youtube.com'

  //     if (youtubeOrigin.indexOf(iframe.attributes.src) !== -1) {
  //       return { sandbox: "allow-scripts allow-same-origin" }
  //     }

  //     return { sandbox: "" };
  //   }

  //   this.config.iframe_attributes = {
  //     sandbox: 'allow-scripts allow-same-origin',
  //     allow: 'autoplay'
  // }
  
  // Defines that embedSemantic should be used (regardless of whether embed is defined).
// this.config.autoEmbed_widget = 'embedSemantic';
// this.config.pasteFromWordRemoveFontStyles = false;


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
      codeSnippet_languages: { javascript: 'JavaScript', html: 'html' }
    };
  }
  async toastMessage(msg: string) {
    const t = await this.toastController.create({ message: msg, color: 'secondary' });
    t.present();
  }

  async openChapterEdit() {
    const modal = await this.modalController.create({
      component: ChapterDetailPageModel,
      componentProps: {
        chapter: this.chapter
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      console.log("fetch new data");
      this._courseManagerService.getCourse();
    });

    return await modal.present();
  }



  closeModal() {
    this.modalController.dismiss();
  }

  async deleteChapter() {
    const chapterId = this.chapter._id;
    this._courseManagerService.deleteChapter(chapterId).subscribe((data) => {
      console.log(data);
      if (!((data as { error: boolean }).error)) {
        this.toastMessage("chapter deleted successfully")
      } else {
        this.toastMessage("something went wrong while  deleting chapter successfully")
      }
      this.closeModal();
    });
  }



}
