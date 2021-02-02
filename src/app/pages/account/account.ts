import { ModalController } from '@ionic/angular';
import { Component, Output, EventEmitter } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServices } from '../../providers/user.services';
import { EditProfilePage } from "./modal/edit-profile/editProfile";
import { NotificationsService } from "../../providers/communication.service";
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage {

  @Output() searchItem: EventEmitter<any> = new EventEmitter();
  public isDataLoaded: Boolean = false;

  constructor(public popoverCtrl: PopoverController,
    public router: Router,
    public _userService: UserServices,
    public modalController:ModalController,
    public toastController: ToastController,
    private clipboard: Clipboard,
    private notificationsService: NotificationsService) { }


  public AdminProfile: any = {

  }

  async copy(code){
    console.log(code ,":: code ")
    this.clipboard.clear()
    this.clipboard.copy(code);
    const toast = await this.toastController.create({
      message: "Your Id has Copied",
      duration: 2000,
      position: "bottom",
      color:'success',
      animated: true,
    });
    toast.present();
  }

  searchWord: any

  tabs = ['Profile', 'Login & Security'];
  selected = new FormControl(0);


  ngOnInit(): void {
    this.getAdminProfile();

  }



  changepassword(index: number) {
    this.selected.setValue(2);
  }

  async editProfile(){
    console.log(this.AdminProfile, "---inside")
    const modal = await this.modalController.create({
      component: EditProfilePage,
      componentProps: {
        userData: this.AdminProfile
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      this.getAdminProfile();
    });

    return await modal.present();
  }

  public enableProfileOption:Boolean=true
  enableProfile(selected){

    if(selected == 'profile'){
        this.enableProfileOption =  false
    }else{
      this.enableProfileOption =  true
    }
  }

  getAdminProfile(){
    this._userService.getAdminProfile(localStorage.getItem('adminId')).subscribe(async (data: any) => {
      console.log("data", data);
       this.AdminProfile = data.data;
       this.isDataLoaded = true;
       this.AdminProfile["_dob"] = ( this.AdminProfile.dob) ? this.formateDate(
        this.AdminProfile.dob
      ) : '';
      this.searchItem.emit( this.AdminProfile);
    });
  }



  formateDate(date) {
    const d = new Date(date);
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);

    let Finaldate = `${da}-${mo}-${ye}`;
    console.log(`Finaldate`, Finaldate);
    return Finaldate;
  }



  changePsswordForm = new FormGroup({
    oldPassword: new FormControl(''),
    newPassword: new FormControl(''),
    confirmPassword: new FormControl(''),
    adminId: new FormControl(localStorage.getItem('adminId'))
  });

  async submit($event) {
    console.log($event);
    let payload = Object.assign({}, $event.value);
    console.log(payload, "payload")
    this.changePsswordForm.reset();

    if (payload.newPassword == payload.confirmPassword) {
      payload.adminId = localStorage.getItem("adminId")
      if(payload.adminId){
      this._userService.changePassword(payload).subscribe(async (data: any) => {
        console.log("data", data);

        if(data.msg == "Invalid Email or Password"){
          const toast = await this.toastController.create({
            message: 'Current Password is not matched',
             duration: 3000,
             color:'danger',
            position: 'top',
            animated: true,
          });
          toast.present();
          return
        }

        const toast = await this.toastController.create({
          message: 'Password Changed Successfully',
           duration: 3000,
           color:'secondary',
          position: 'bottom',
          animated: true,
        });
        this.logout()
        toast.present();
      });
    }
    }else{
        const toast = await this.toastController.create({
          message: 'Confirm Password is not matched',
           duration: 3000,
           color:'warning',
          position: 'top',
          animated: true,
        });
        toast.present();
        return
    }

  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login')
  }

  ngOnDestroy(){
    // clear message
    this.notificationsService.clearData();
}



}
