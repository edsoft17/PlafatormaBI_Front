import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { DashboardContainerPresenter } from './dashboard-container.presenter';
import { FlowService } from 'app/core/services/flow.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IResponseModel } from '@shared/models/response-model.interface';
import { FlowTypeGetEntity } from 'app/core/entities/flow/flow-type-get.entity';
import { finalize, forkJoin } from 'rxjs';
import { SpinnerService } from '@shared/services/spinner.service';
import { FlowHeaderGetAdapter } from 'app/core/adapters/flow/flow-header.adapter';
import { FlowTypeGet } from 'app/core/models/flow/flow-type-get';
import { FlowTypeGetAdapter } from 'app/core/adapters/flow/flow-type.adapter';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'app/core/services/dashboard.service';
import { AccumulatedIncomedEntity } from 'app/core/entities/dashboard/accumulated-incomed.entity';
import { AccumulatedMonthlyReportAdapter } from 'app/core/adapters/dashboard/accumulated-monthly-report.adapter';
import { AccumulatedMonthlyReportEntity } from 'app/core/entities/dashboard/accumulated-monthly-report.entity';
import { AccumulatedIncomed } from 'app/core/models/dashboard/accumulated-incomed';
import { AccumulatedIncomedGetAdapter } from 'app/core/adapters/dashboard/accumulated-incomed.adapter';
import { AccumulatedMonthlyReport } from 'app/core/models/dashboard/accumulated-monthly-report.';
import { AccumulatedByTypeAdapter } from 'app/core/adapters/dashboard/accumulated-by-type.adapter';
import { AccumulatedByType } from 'app/core/models/dashboard/accumulated-by-type';
import { FlowHeaderGetEntity } from 'app/core/entities/flow/flow-header-get.entity';
import { FlowHeaderGet } from 'app/core/models/flow/flow-header-get';
import { ParamToReport } from './dashboard/dashboard.models';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EnterpriseReport } from 'app/core/models/dashboard/enterprise-report';
import { EnterpriseReportEntity } from 'app/core/entities/dashboard/enterprise-report.entity';
import { EnterpriseReportAdapter } from 'app/core/adapters/dashboard/enterprise-report.adapter';

@Component({
  selector: 'app-dashboard-container',
  template: `
    <ui-dashboard
      [flowHeaders]="flowHeaders"
      [accumulated]="accumulated"
      [monthlyAccumulatedIncomeList]="monthlyAccumulatedIncomeList"
      [accumulatedIncomeDetailList]="accumulatedIncomeDetailList"
      [incomeReportList]="incomeReportList"
      [expenseReportList]="expenseReportList"
      [incomeReportChartList]="incomeReportChartList"
      [expenseReportChartList]="expenseReportChartList"
      [enterpriseReport]="enterpriseReport"
      (eventLoadInitDataDashboard)="loadInitDataDashboard($event)"
      (eventGetChartReport)="getAccumulatedDetailsReportByType($event)"
      (eventGetChartDetail)="getChartDetail($event)"

    >
    </ui-dashboard>
  `,
  providers: [
    DashboardContainerPresenter,
    FlowTypeGetAdapter,
    AccumulatedMonthlyReportAdapter,
    AccumulatedIncomedGetAdapter,
    AccumulatedByTypeAdapter,
    FlowHeaderGetAdapter,
    EnterpriseReportAdapter
  ]
})
export class DashboardContainerComponent implements OnInit {

  private readonly _cd = inject(ChangeDetectorRef);
  private readonly _spinnerService = inject(SpinnerService);
  private readonly _flowService = inject(FlowService);
  private readonly _toastrService = inject(ToastrService);
  private readonly _dashboardService = inject(DashboardService);

  private readonly _flowHeaderGetAdapter = inject(FlowHeaderGetAdapter);
  private readonly _dashboardContainerPresenter = inject(DashboardContainerPresenter);
  private readonly _flowTypeGetAdapter = inject(FlowTypeGetAdapter);
  private readonly _accumulatedMonthlyReportAdapter = inject(AccumulatedMonthlyReportAdapter);
  private readonly _accumulatedIncomedGetAdapter = inject(AccumulatedIncomedGetAdapter);
  private readonly _accumulatedByTypeAdapter = inject(AccumulatedByTypeAdapter);
  private readonly _enterpriseReportAdapter = inject(EnterpriseReportAdapter);

  flowTypes: FlowTypeGet[] = [];
  accumulated: AccumulatedIncomed[] = []; 
  monthlyAccumulatedIncomeList: AccumulatedMonthlyReport[] = [];
  accumulatedIncomeDetailList: {
    firstGroup: AccumulatedMonthlyReport[],
    secondGroup: AccumulatedMonthlyReport[]
  } | null = null;
  incomeReportList: AccumulatedByType[] = [];
  expenseReportList: AccumulatedByType[] = [];
  incomeReportChartList: AccumulatedMonthlyReport[] = [];
  expenseReportChartList: AccumulatedMonthlyReport[] = [];
  flowHeaders: FlowHeaderGet[] = [];
  enterpriseReport!: EnterpriseReport;

  @ViewChild(DashboardComponent) dashboardComponent!: DashboardComponent;

  ngOnInit(): void {
    this._dashboardContainerPresenter.getDataFromRoute();
    this.getFlowTypes();
    this.getFlowHeaders();
    this.getReportEnterprise();
  }

  getReportEnterprise(): void {
    this._dashboardService.loadingEnterpriseReport.set(true);
    this._dashboardService.getReportEnterprise().pipe(finalize(()=>this._dashboardService.loadingEnterpriseReport.set(false))).subscribe({
      next: (data: IResponseModel<EnterpriseReportEntity>) => {
        if(data.status.status === 200) this.enterpriseReport = this._enterpriseReportAdapter.convertEntityToModel(data.data);
        console.log("this.enterpriseReport: ",this.enterpriseReport);
      }
    });
  }

  getFlowTypes(): void {
    this._spinnerService.show();
    this._flowService.getFlowTypes().pipe(finalize(()=>this._spinnerService.hide())).subscribe({
      next: (response: IResponseModel<FlowTypeGetEntity[]>) => {
        if(response.status.status === 200){
          this.flowTypes = this._flowTypeGetAdapter.convertEntityToModelArray(response.data);
          this._flowService.currentTypeFlow.set(this.flowTypes[0].flowTypeId);
        }
      }, 
      error: (data: HttpErrorResponse) => {
        if(data.status === 500) this._toastrService.error("Error de conexión con el servidor", "Error");
        console.log("mi data es: ",data);
      }
    });
  }

  loadInitDataDashboard(event: { structureId: number, dates: [Date,Date] }): void {
    //this._spinnerService.show();
    const arrObs = [
      this._dashboardService.getAccumulatedIncome(event.structureId,event.dates[0],event.dates[1]),
      this._dashboardService.getMonthlyAccumulatedIncome(event.structureId,event.dates[0],event.dates[1]),
      this._dashboardService.getMonthlyIncomeDetails(event.structureId,event.dates[0],event.dates[1]),
      this._dashboardService.getAccumulatedReportByType(event.structureId,event.dates[0],event.dates[1],'I'),
      this._dashboardService.getAccumulatedReportByType(event.structureId,event.dates[0],event.dates[1],'E')
    ];

    this._dashboardService.loadingAccumulatedIncome.set(true);
    this._dashboardService.loadingMonthlyAccumulatedIncome.set(true);
    this._dashboardService.loadingMonthlyIncomeDetails.set(true);
    this._dashboardService.loadingAccumulatedReportByTypeI.set(true);
    this._dashboardService.loadingAccumulatedReportByTypeE.set(true);
    this._dashboardService.loadingChartE.set(true);
    this._dashboardService.loadingChartI.set(true);
    forkJoin(arrObs).pipe(
      finalize(()=>{
        this._dashboardService.loadingAccumulatedIncome.set(false);
        this._dashboardService.loadingMonthlyAccumulatedIncome.set(false);
        this._dashboardService.loadingMonthlyIncomeDetails.set(false);
        this._dashboardService.loadingAccumulatedReportByTypeI.set(false);
        this._dashboardService.loadingAccumulatedReportByTypeE.set(false);
        this._dashboardService.loadingChartE.set(false);
        this._dashboardService.loadingChartI.set(false);
      })).subscribe({
      next: (response: any) => {
        this.accumulated = this._accumulatedIncomedGetAdapter.convertEntityToModelArray(response[0].data);
        this.monthlyAccumulatedIncomeList = this._accumulatedMonthlyReportAdapter.convertEntityToModelArray(response[1].data);
        this.accumulatedIncomeDetailList = {
          firstGroup: this._accumulatedMonthlyReportAdapter.convertEntityToModelArray(response[2].data.primerGrupo),
          secondGroup: this._accumulatedMonthlyReportAdapter.convertEntityToModelArray(response[2].data.segundoGrupo)
        }
        this.incomeReportList = this._accumulatedByTypeAdapter.convertEntityToModelArray(response[3].data);
        this.expenseReportList = this._accumulatedByTypeAdapter.convertEntityToModelArray(response[4].data);
        /* if(this.incomeReportList.length > 0) 
          this.getAccumulatedDetailsReportByType({ structureId: event.structureId, dates: event.dates, type: 'I', parentIdFlow: this.incomeReportList[0].parentFlowStructureId })
        if(this.expenseReportList.length > 0) 
          this.getAccumulatedDetailsReportByType({ structureId: event.structureId, dates: event.dates, type: 'E', parentIdFlow: this.expenseReportList[0].parentFlowStructureId }) */

        console.log("el response: ", response);
        console.log("this.accumulatedIncomeDetailList: ",this.accumulatedIncomeDetailList);
      },
      error: (data: HttpErrorResponse) => {
        if(data.status === 500) this._toastrService.error("Error de conexión con el servidor", "Error");
      }
    });
  }

  getAccumulatedDetailsReportByType(param: ParamToReport): void {
    console.log("getAccumulatedDetailsReportByType: ",param);
    if(param.type === 'I') {
      console.log("aca estoy I");
      this._dashboardService.loadingChartI.set(true);
      this._cd.detectChanges();
    }
    else if(param.type === 'E') {
      console.log("aca estoy E");
      this._dashboardService.loadingChartE.set(true);
      this._cd.detectChanges();
    } 
    this._dashboardService.getAccumulatedDetailsReportByType(param.structureId,param.dates[0],param.dates[1],param.type,param.parentIdFlow).
    pipe(
      finalize(() => {
        if(param.type === 'I') this._dashboardService.loadingChartI.set(false);
    else if(param.type === 'E') this._dashboardService.loadingChartE.set(false);
      })
    ).subscribe({
      next: (response: IResponseModel<AccumulatedMonthlyReportEntity[]>) => {
        if(response.status.status === 200) {
          if(param.type === 'I') this.incomeReportChartList = this._accumulatedMonthlyReportAdapter.convertEntityToModelArray(response.data)
          else if(param.type === 'E') this.expenseReportChartList = this._accumulatedMonthlyReportAdapter.convertEntityToModelArray(response.data)
        }
      }
    });  
  }

  getFlowHeaders(): void {
    this._flowService.getFlowHeaders(1).pipe(finalize(()=>{
      this._flowService.loadingTableFlow.set(false);
      this._spinnerService.hide();
    })).subscribe({
      next: (response: IResponseModel<FlowHeaderGetEntity[]>) => {
        if(response.status.status) this.flowHeaders = this._flowHeaderGetAdapter.convertEntityToModelArray(response.data);
        console.log("this.flowHeaders: ",this.flowHeaders);
      }
    });
  }

  getChartDetail(param: ParamToReport) {
    console.log("param: ",param);
    this._spinnerService.show();
    this._dashboardService.getChildTypeReportDetail(param.structureId,param.dates[0],param.dates[1],param.type,param.parentIdFlow).pipe(
      finalize(()=>this._spinnerService.hide())
    ).subscribe({
      next: (data => {
        this.dashboardComponent.openDialogDetails(
          data.data, 
          param.nameChild!, 
          param.dates,
          param.executedAmount!,
          param.budgetedAmount!
        );
      })
    });
  }
}
