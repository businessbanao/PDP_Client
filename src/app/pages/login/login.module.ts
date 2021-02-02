import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login';
import { LoginPageRoutingModule } from './login-routing.module';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { SocketService  } from "../../providers/socket.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ReactiveFormsModule

  ],
  declarations: [
    LoginPage,
  ],
  providers:[GooglePlus,SocketService]
})

export class LoginModule { }
