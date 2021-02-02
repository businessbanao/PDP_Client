import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AnalyticsPage } from './analytics';
import { NgPaymentCardModule } from 'ng-payment-card';
import { AnalyticsPageRoutingModule } from './analytics-routing.module';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
declare var require: any;
require('highcharts/highcharts-3d')(Highcharts);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnalyticsPageRoutingModule,
    NgPaymentCardModule,
    HighchartsChartModule
  ],
  declarations: [
    AnalyticsPage,

  ],
  entryComponents: [

  ]
})
export class AnalyticsPageModule { }
