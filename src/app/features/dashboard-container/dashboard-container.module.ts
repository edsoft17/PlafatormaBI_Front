import { NgModule } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

import { DashboardContainerRoutingModule } from './dashboard-container-routing.module';
import { DashboardContainerComponent } from './dashboard-container.component';
import { DashboardComponent, MonthYearDateAdapter, MY_DATE_FORMATS } from './dashboard/dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MatRippleModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AbsPipe } from 'app/core/pipe/abs.pipe';

@NgModule({
  declarations: [
    DashboardContainerComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardContainerRoutingModule,
    NgChartsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatRippleModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    NgClass,
    AbsPipe
  ],
  providers: [
    //provideNativeDateAdapter(),
    { provide: DateAdapter, useClass: MonthYearDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
    /* provideNativeDateAdapter({
      parse: {
        dateInput: 'MM/yyyy',
      },
      display: {
        dateInput: 'MM/yyyy',
        monthYearLabel: 'MMM yyyy',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM yyyy',
      },
    }) */
  ]
})
export default class DashboardContainerModule { }
