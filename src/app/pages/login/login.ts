import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserServices } from '../../providers/user.services';
import { FormControl, FormGroup } from '@angular/forms';
import { UserOptions } from '../../interfaces/user-options';
import { LoginService } from "../../providers/login.services";
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoadingController, AlertController, Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})

export class LoginPage {

  public enableForgotPasswordScreen:Boolean;

  public loginData: any = { email: '', password: '' };
  public FPData: any = { email: '', code: '' , mobile:'' };
  constructor(
    public _userService: UserServices,
    public router: Router,
    public toastController: ToastController,
    public loadingController: LoadingController,
  ) {


  }





  public searchproductList:any=[]
   ngOnInit(): void {

    console.log("localStorage.getItem('AuthToken')",localStorage.getItem('AuthToken'))
    if (localStorage.getItem('AuthToken')) {
      this.router.navigateByUrl('/tabs/analytics')
    }

  }

  onLogin() {
    console.log(this.loginData, "form");
    this._userService.loginAdmin(this.loginData).subscribe(async result => {

      console.log("result", result);
      if(result.msg == "Invalid Email or Password"){
        const toast = await this.toastController.create({
          message: 'Invalid Credentials',
           duration: 3000,
           color:'danger',
          position: 'top',
          animated: true,
        });
        toast.present();
        return
      }


      localStorage.setItem("AuthToken", result.authToken)
      localStorage.setItem("adminId", result.AdminDetails._id);
      // localStorage.setItem("adminId", "601870f796b9f2834f045d1a");
      this.loginData = { email: '', password: '' };
      this.router.navigateByUrl('/finance')
    });
  }

  enableForgotPass(){
    this.enableForgotPasswordScreen = true;
  }

  enableLogin(){
    this.enableForgotPasswordScreen = false;
    this.enableResetPasswordScreen = false
  }

  changePsswordForm = new FormGroup({
    oldPassword: new FormControl(''),
    newPassword: new FormControl(''),
    confirmPassword: new FormControl(''),
    adminId: new FormControl(localStorage.getItem('adminId'))
  });



  public enableEntercode :Boolean = false;
  public enableResetPasswordScreen :Boolean = false
  sendCode(){
    if(!this.enableEntercode){
      this._userService.sendCode({
        email:this.FPData.email
      }).subscribe(async result => {
          console.log(result,"code data");
          const toast = await this.toastController.create({
            message: 'Code is send to your registered mobile check ',
             duration: 3000,
             color:'success',
            position: 'top',
            animated: true,
          });
          this.FPData.code =''

          toast.present();
          this.FPData.mobile = result.mobileNumber;
          this.enableEntercode = true
      });
    }else{
      this._userService.verifyCode(this.FPData.code,this.FPData.mobile).subscribe(result => {
          console.log(result,"code data");
          this.enableResetPasswordScreen = true;
          this.enableEntercode = false;
          this.enableForgotPasswordScreen = false
      });
    }
  }


  submit($event) {
    console.log($event);
    let payload = Object.assign({}, $event.value);
    console.log(payload, "payload")
    this.changePsswordForm.reset();

    if (payload.newPassword == payload.confirmPassword) {
      payload.adminId = localStorage.getItem("adminId")
      if(payload.adminId){
      this._userService.resetPassword(payload).subscribe(async (data: any) => {
        console.log("data", data);
        const toast = await this.toastController.create({
          message: 'Password Changed Successfully',
           duration: 3000,
           color:'secondary',
          position: 'bottom',
          animated: true,
        });
        toast.present();
        this.enableLogin();
      });
    }
    }

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }
}
