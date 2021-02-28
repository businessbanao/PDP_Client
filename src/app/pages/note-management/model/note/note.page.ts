import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";
import { NoteManagementService } from '../../../../providers/note-management.service';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-note",
  templateUrl: "./note.page.html",
  styleUrls: ["./note.page.scss"],
})
export class NotePageModel implements OnInit {
  
  noteForm: FormGroup;
  public isEditMode: boolean = false;
  public data:any;
  public responseStr: string;
  public filder_list:any;

  constructor(
    public modalController: ModalController,
    public toast:ToastController,
    private _formBuilder: FormBuilder,
    private _noteManagementService:NoteManagementService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.initNoteForm();
    if(undefined != this.data){
      this.noteForm.patchValue(this.data);
      this.noteForm.get('id').setValue(this.data._id);
      this.noteForm.get('date').setValue(this.data.date.slice(0,10));
    }

  }
  
  async closeModal() {
    const onClosedData: string = "Address Added";
    await this.modalController.dismiss(onClosedData);
  }

  updateNote(payload) {
    let formData = JSON.parse(JSON.stringify(payload.value));
    let id = this.noteForm.get("id").value;
    formData["date"] = this.dateFormater(formData.date); 
    this._noteManagementService.updateNote(id, formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      let toast = await this.toast.create({
        message:"Updated Successfully",
        color:'success',
        duration:2000
      })
      toast.present();
      this.noteForm.reset();
      this.closeModal();
    });
    this.isEditMode = false;
  }

  initNoteForm() {
    this.noteForm = this._formBuilder.group({
      title: new FormControl(),
      userId: new FormControl(),
      content: new FormControl(),
      images: new FormControl(),
      folder_id: new FormControl(), 
      date: new FormControl(), 
      id: new FormControl(""),
    });
  }

  createNote(payload: FormGroup) {
    debugger
    let formData = JSON.parse(JSON.stringify(payload.value));
    formData["userId"] = localStorage.getItem("adminId");
    formData["date"] = this.dateFormater(formData.date); 
    this._noteManagementService.createNote(formData).subscribe(async (resp) => {
      this.responseStr = resp.response;
      let toast = await this.toast.create({
        message:"Note created Successfully",
        color:'success',
        duration:2000
      })
      toast.present();
      this.noteForm.reset();
      this.closeModal();
    });
  }

  dateFormater(inputDate) {
    let tempDate = new Date(inputDate);
    let date = tempDate.getDate() < 10 ? "0" + tempDate.getDate() : tempDate.getDate();
    let month = (tempDate.getMonth() + 1) ? "0" + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1;
    let year = tempDate.getFullYear();
    return isNaN(tempDate.getTime()) ? "" : month + '-' + date + '-' + year; 
  }

}
