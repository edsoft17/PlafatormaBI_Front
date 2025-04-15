import { inject, Injectable, signal } from '@angular/core';
import { UserCompany } from '../models/user-company';
import { MenuEntity } from '../entities/menu/menu.entity';
import { Observable } from 'rxjs';
import { IResponseModel } from '@shared/models/response-model.interface';
import { AccumulatedIncomedEntity } from '../entities/dashboard/accumulated-incomed.entity';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FlowDataAccountEntity } from '../entities/flow/flow-data-account.entity';
import { User } from '../models/user.model';
import { AccumulatedMonthlyReport } from '../models/dashboard/accumulated-monthly-report.';
import { AccumulatedByTypeEntity } from '../entities/dashboard/accumulated-by-type.entity';
import { AccumulatedMonthlyReportEntity } from '../entities/dashboard/accumulated-monthly-report.entity';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private _user = JSON.parse(localStorage.getItem("usuario")!) as User;
    private _companyId = Number(localStorage.getItem("currentCompany"));
    
    listMenu = signal<MenuEntity | null>(null);
    loadingAccumulatedIncome = signal(false);
    loadingMonthlyAccumulatedIncome = signal(false);
    loadingMonthlyIncomeDetails = signal(false);
    loadingAccumulatedReportByTypeI = signal(false);
    loadingAccumulatedReportByTypeE = signal(false);
    loadingChartI = signal(false);
    loadingChartE = signal(false);
    loadingChartDetails = signal(false);

    private readonly _http = inject(HttpClient);

    constructor(){ }

    getAccumulatedIncome(flowHeaderId: number, startDate: Date, endDate: Date): Observable<IResponseModel<AccumulatedIncomedEntity[]>> {
        const startDateString = startDate.toISOString().split('T')[0];
        const endDateString = endDate.toISOString().split('T')[0];
        const url = `${environment.baseUrlBI}/api/Dashboard/ObtenerRentaAcumulada`;
        const operationCode = localStorage.getItem("currentOperation");

        const httParams = new HttpParams().append("idUsuario",this._user.id)
                                        .append("idEmpresa",this._companyId)
                                        .append("IdEstructuraFlujo_Cabecera",flowHeaderId)
                                        .append("FechaIni",startDateString)
                                        .append("FechaFin",endDateString)
                                        .append("code_operacion",operationCode!);

        return this._http.get<IResponseModel<AccumulatedIncomedEntity[]>>(url, { params: httParams });
    }

    getMonthlyAccumulatedIncome(flowHeaderId: number, startDate: Date, endDate: Date): Observable<IResponseModel<AccumulatedMonthlyReportEntity[]>> {
        const url = `${environment.baseUrlBI}/api/Dashboard/ObtenerRentaAcumuladaMensual`;
        const startDateString = startDate.toISOString().split('T')[0];
        const endDateString = endDate.toISOString().split('T')[0];
        const operationCode = localStorage.getItem("currentOperation");
        
        const httParams = new HttpParams().append("idUsuario",this._user.id)
                                        .append("idEmpresa",this._companyId)
                                        .append("IdEstructuraFlujo_Cabecera",flowHeaderId)
                                        .append("FechaIni",startDateString)
                                        .append("FechaFin",endDateString)
                                        .append("code_operacion",operationCode!);

        return this._http.get<IResponseModel<AccumulatedMonthlyReportEntity[]>>(url, { params: httParams });
    }

    getMonthlyIncomeDetails(flowHeaderId: number, startDate: Date, endDate: Date): Observable<IResponseModel<{ primerGrupo: AccumulatedMonthlyReportEntity[], segundoGrupo: AccumulatedMonthlyReportEntity[]}>> {
        const url = `${environment.baseUrlBI}/api/Dashboard/ObtenerRentaAcumuladaMensualDetalle`;
        const startDateString = startDate.toISOString().split('T')[0];
        const endDateString = endDate.toISOString().split('T')[0];
        const operationCode = localStorage.getItem("currentOperation");

        const httParams = new HttpParams().append("idUsuario",this._user.id)
                                        .append("idEmpresa",this._companyId)
                                        .append("IdEstructuraFlujo_Cabecera",flowHeaderId)
                                        .append("FechaIni",startDateString)
                                        .append("FechaFin",endDateString)
                                        .append("code_operacion",operationCode!)

        return this._http.get<IResponseModel<{ primerGrupo: AccumulatedMonthlyReportEntity[], segundoGrupo: AccumulatedMonthlyReportEntity[]}>>(url, { params: httParams });
    }

    getAccumulatedReportByType(flowHeaderId: number, startDate: Date, endDate: Date, type: 'I' | 'E'): Observable<IResponseModel<AccumulatedByTypeEntity[]>> {
        const url = `${environment.baseUrlBI}/api/Dashboard/ObtenerReporteTipoAcum`;
        const startDateString = startDate.toISOString().split('T')[0];
        const endDateString = endDate.toISOString().split('T')[0];
        const operationCode = localStorage.getItem("currentOperation");

        const httParams = new HttpParams().append("idUsuario",this._user.id)
                                        .append("idEmpresa",this._companyId)
                                        .append("IdEstructuraFlujo_Cabecera",flowHeaderId)
                                        .append("FechaIni",startDateString)
                                        .append("FechaFin",endDateString)
                                        .append("code_operacion",operationCode!)
                                        .append("tipo",type);

        return this._http.get<IResponseModel<AccumulatedByTypeEntity[]>>(url, { params: httParams });
    }

    getAccumulatedDetailsReportByType(flowHeaderId: number, startDate: Date, endDate: Date, type: 'I' | 'E', parentIdFlow: number): Observable<IResponseModel<AccumulatedMonthlyReportEntity[]>> {
        const url = `${environment.baseUrlBI}/api/Dashboard/ObtenerReporteTipoGrafico`;
        const startDateString = startDate.toISOString().split('T')[0];
        const endDateString = endDate.toISOString().split('T')[0];
        const operationCode = localStorage.getItem("currentOperation");

        const httParams = new HttpParams().append("idUsuario",this._user.id)
                                        .append("idEmpresa",this._companyId)
                                        .append("IdEstructuraFlujo_Cabecera",flowHeaderId)
                                        .append("FechaIni",startDateString)
                                        .append("FechaFin",endDateString)
                                        .append("code_operacion",operationCode!)
                                        .append("IdHijo",parentIdFlow)
                                        .append("tipo",type)

        return this._http.get<IResponseModel<AccumulatedMonthlyReportEntity[]>>(url, { params: httParams });
    }
    
    getChildTypeReportDetail(flowHeaderId: number, startDate: Date, endDate: Date, type: 'I' | 'E', parentIdFlow: number): Observable<IResponseModel<any[]>> {
        const url = `${environment.baseUrlBI}/api/Dashboard/ObtenerReporteTipoHijoDetalle`;
        const operationCode = localStorage.getItem("currentOperation");

        const httParams = new HttpParams().append("idUsuario",this._user.id)
                                        .append("idEmpresa",this._companyId)
                                        .append("IdEstructuraFlujo_Cabecera",flowHeaderId)
                                        .append("FechaIni",this.formatDate(startDate))
                                        .append("FechaFin",this.formatDate(endDate))
                                        .append("code_operacion",operationCode!)
                                        .append("IdHijo",parentIdFlow)
                                        .append("tipo",type)

        return this._http.get<IResponseModel<any[]>>(url, { params: httParams });
    }

    formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
      
        return `${day}/${month}/${year}`;
    }
}
