import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomerPage } from './components/customer/customer';
import { CustomerDetailsPage } from "./components/customer-details/customer-details";
import { CustomerManagementPageRoutingModule } from './customer-management-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerManagementPageRoutingModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,

  ],
  declarations: [
    CustomerPage,
    CustomerDetailsPage

  ],
  entryComponents: [

  ], providers: [SocialSharing]
})
export class CustomerManagementPageModule { }
