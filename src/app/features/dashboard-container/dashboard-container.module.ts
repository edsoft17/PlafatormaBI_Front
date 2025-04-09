import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardContainerRoutingModule } from './dashboard-container-routing.module';
import { DashboardContainerComponent } from './dashboard-container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    DashboardContainerComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardContainerRoutingModule,
    NgChartsModule
  ]
})
export default class DashboardContainerModule { }
