import { Component, computed, effect, EventEmitter, inject, input, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NativeDateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { AccumulatedIncomed } from 'app/core/models/dashboard/accumulated-incomed';
import { AccumulatedMonthlyReport } from 'app/core/models/dashboard/accumulated-monthly-report.';
import { FlowTypeGet } from 'app/core/models/flow/flow-type-get';
import { ChartConfiguration, ChartData, ChartOptions, ChartType, ChartEvent, ChartDataset } from 'chart.js';
import { DateTime } from 'luxon';
import { DashboardPresenter } from './dashboard.presenter';
import { AccumulatedByType } from 'app/core/models/dashboard/accumulated-by-type';
import { DashboardService } from 'app/core/services/dashboard.service';
import { FlowHeaderGet } from 'app/core/models/flow/flow-header-get';
import { ParamToReport } from './dashboard.models';
import { DialogDetailComponent } from '../dialog/dialog-detail/dialog-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { FlowDataAccount } from 'app/core/models/flow/flow-data-account';

// Configuración personalizada de formatos
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

// Adaptador personalizado
export class MonthYearDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.indexOf('/') > -1) {
      const [month, year] = value.split('/');
      return new Date(Number(year), Number(month) - 1, 1);
    }
    return super.parse(value);
  }

  override format(date: Date, displayFormat: any): string {
    if (displayFormat === 'MM/YYYY') {
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    }
    return super.format(date, displayFormat);
  }
}

@Component({
  selector: 'ui-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [DashboardPresenter]
})
export class DashboardComponent {
  @Output() eventLoadInitDataDashboard: EventEmitter<{ structureId: number, dates: [Date,Date] }> = new EventEmitter<{ structureId: number, dates: [Date,Date] }>();
  @Output() eventGetChartReport: EventEmitter<ParamToReport> = new EventEmitter<ParamToReport>();
  @Output() eventGetChartDetail: EventEmitter<ParamToReport> = new EventEmitter<ParamToReport>();

  flowHeaders = input<FlowHeaderGet[]>([]);
  accumulated = input<AccumulatedIncomed[]>([]);
  monthlyAccumulatedIncomeList = input<AccumulatedMonthlyReport[]>([]);
  accumulatedIncomeDetailList = input<{
    firstGroup: AccumulatedMonthlyReport[],
    secondGroup: AccumulatedMonthlyReport[]
  } | null>(null);
  incomeReportList = input<AccumulatedByType[]>([]);
  expenseReportList = input<AccumulatedByType[]>([]);
  incomeReportChartList = input<AccumulatedMonthlyReport[]>([]);
  expenseReportChartList = input<AccumulatedMonthlyReport[]>([]);

  private readonly _dashboardService = inject(DashboardService);
  private readonly _dashboardPresenter = inject(DashboardPresenter);

  public readonly dialog = inject(MatDialog);

  endDate = new FormControl(new Date());
  startDate = new FormControl(new Date());
  selectedDate: DateTime = DateTime.now();
  currentHeaderFlow = 0;

  monthlyProfitabilityChartData!: any;

  incomeReportChartData!: { 
    chartData: ChartData<'bar' | 'line', number[], string>,
    chartOptions: ChartOptions<'bar' | 'line'>
  };

  expenseReportChartData!: { 
    chartData: ChartData<'bar' | 'line', number[], string>,
    chartOptions: ChartOptions<'bar' | 'line'>
  };
  
  dataSourceI: any[] = [];
  dataSourceE: any[] = [];
  loadingChartE = computed(()=>this._dashboardService.loadingChartE());
  loadingChartI = computed(()=>this._dashboardService.loadingChartI());
  loadingAccumulatedIncome = computed(()=>this._dashboardService.loadingAccumulatedIncome());
  loadingMonthlyAccumulatedIncome = computed(()=>this._dashboardService.loadingMonthlyAccumulatedIncome());
  loadingMonthlyIncomeDetails = computed(()=>this._dashboardService.loadingMonthlyIncomeDetails());
  loadingAccumulatedReportByTypeI = computed(()=>this._dashboardService.loadingAccumulatedReportByTypeI());
  loadingAccumulatedReportByTypeE = computed(()=>this._dashboardService.loadingAccumulatedReportByTypeE());

  monthlySalesVsCostsChartData: any;

  get formattedDate(): string {
    return this.selectedDate.setLocale('es').toFormat('LLLL yyyy'); // Abril 2025
  }

  constructor() {
    effect(() => {
      if(this.flowHeaders()?.length > 0)  {
        this.currentHeaderFlow = this.flowHeaders()[3].structureHeaderId;
        this.eventLoadInitDataDashboard.emit({structureId: this.currentHeaderFlow, dates: [this.startDate.value!,this.endDate.value!]})
      }
    });
    effect(() => {
      this.monthlyProfitabilityChartData = this._dashboardPresenter.initMonthlyProfitabilityChart(this.monthlyAccumulatedIncomeList());
    });
    effect(() => {
      this.monthlySalesVsCostsChartData = this._dashboardPresenter.initMonthlySalesVsCostsChart(this.accumulatedIncomeDetailList());
      console.log("this.monthlySalesVsCostsChartData: ",this.monthlySalesVsCostsChartData);
    });
    effect(() => {
      this.dataSourceI = this.incomeReportList();
      console.log("this.incomeReportList(): ",this.incomeReportList());
      if(this.incomeReportList()?.length > 0) this.showChartIncome(this.incomeReportList()[0],0)
      this.dataSourceE = this.expenseReportList();
      if(this.expenseReportList()?.length > 0) this.showChartExpense(null,this.expenseReportList()[0],0)
    });
    effect(() => {
      this.incomeReportChartData = this._dashboardPresenter.initMonthlyIncomeChart(this.incomeReportChartList());
    });
    effect(() => {
      this.expenseReportChartData = this._dashboardPresenter.initMonthlyExpenseChart(this.expenseReportChartList());
    });
  }

  ngOnInit(): void {
    const currentDate = new Date();
    currentDate?.setMonth(currentDate.getMonth() - 6)
    this.startDate.setValue(currentDate);
    /* this._dashboardPresenter.getDataChartDetailE$.subscribe({
      next: (data) => this.eventGetChartDetail.emit(data)
    }); */
  }

  setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Date>) {
    // Creamos una nueva fecha con el primer día del mes seleccionado
    const newValue = new Date(normalizedMonthAndYear.getFullYear(), normalizedMonthAndYear.getMonth(), 1);
    this.endDate.setValue(newValue);
    datepicker.close();
  }

  setMonthAndYear2(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Date>) {
    // Creamos una nueva fecha con el primer día del mes seleccionado
    const newValue = new Date(normalizedMonthAndYear.getFullYear(), normalizedMonthAndYear.getMonth(), 1);
    this.startDate.setValue(newValue);
    datepicker.close();
  }

  getDataDashboard(): void {
    this.eventLoadInitDataDashboard.emit({structureId: this.currentHeaderFlow, dates: [this.startDate.value!,this.endDate.value!]})
  }

  firstIndexTable = 0;
  secondIndexTable = 0;
  
  displayedColumns: string[] = ['parentLevelName', 'executedAmount', 'budgetedAmount', 'difference', 'percentage', 'acciones'];
  
  showChartIncome(row: AccumulatedByType, index: number): void {
    console.log("este es mi data: ",row);
    this.firstIndexTable = index;
    this.eventGetChartReport.emit({
      structureId: this.currentHeaderFlow,
      dates: [this.startDate.value!,this.endDate.value!],
      parentIdFlow: row.parentFlowStructureId,
      type: 'I'
    });
  }

  showChartExpense(event: any, row: AccumulatedByType, index: number): void {
    console.log("este es mi data: ",event);
    this.eventGetChartReport.emit({
      structureId: this.currentHeaderFlow,
      dates: [this.startDate.value!,this.endDate.value!],
      parentIdFlow: row.parentFlowStructureId,
      type: 'E'
    });
    this.secondIndexTable = index;
  }
  
  getAbsolutePercentage(value: number): number {
    const percent = Math.abs(value * 100);
    return percent > 100 ? 100 : percent;
  }

  getSafePercentage(value: number): number {
    // Nos aseguramos que la barra no se pase del 100%
    const absValue = Math.abs(value);
    return absValue > 100 ? 100 : absValue;
  }
  
  getChartDetailI(param: AccumulatedByType, type: 'I' | 'E'): void {
    this.eventGetChartDetail.emit({
      dates: [this.startDate.value!,this.endDate.value!],
      parentIdFlow: param.parentFlowStructureId,
      structureId: this.currentHeaderFlow,
      type: type,
      nameChild: param.parentLevelName
    });
  }

  openDialogDetails(data: any, name: string, dates: [Date,Date]): void {
    const respDialogo = this.dialog.open(DialogDetailComponent, {
      data: {...data, name: name, dates: dates},
      disableClose: true,
      //width: '800px',  // 100% del ancho de la ventana
      maxWidth: 'none', // Evita restricciones de Angular Material
      minWidth: "800px",
      height: "700px"
    });
    respDialogo.beforeClosed().subscribe(res => {
      if(res){
        /* this._toastrService.success("Se guardó la estructura exitosamente", "Éxito");
        this.eventGetFlowHeader.emit(this.flowType.value ?? 0); */
      }
    });
  }
}