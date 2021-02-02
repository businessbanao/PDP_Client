import { Clipboard } from '@ionic-native/clipboard/ngx';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AccountPage } from './account';
import { AccountPageRoutingModule } from './account-routing.module';
import {MatTabsModule} from '@angular/material/tabs';
import { ReactiveFormsModule} from '@angular/forms';
import { EditProfilePage } from "./modal/edit-profile/editProfile";
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { NotificationsService } from "../../providers/communication.service";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountPageRoutingModule,
    MatTabsModule,
    ReactiveFormsModule
  ],
  declarations: [AccountPage,EditProfilePage],
  entryComponents: [EditProfilePage],
  providers:[Camera,File,NotificationsService,Clipboard],
  bootstrap: [AccountPage],

})
export class AccountModule {}
