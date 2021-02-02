import { Component } from '@angular/core';

import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  styleUrls: ['./settings.scss'],
})
export class SettingsPage {
  location = 'madison';
  conferenceDate = '2047-05-17';

  selectOptions = {
    header: 'Select a Location'
  };

  constructor(public popoverCtrl: PopoverController) { }

   
}
