import { inject, Injectable, signal } from '@angular/core';
import { UserCompany } from '../models/user-company';
import { MenuEntity } from '../entities/menu/menu.entity';
import { IResponseModel } from '@shared/models/response-model.interface';
import { FlowTypeGetEntity } from '../entities/flow/flow-type-get.entity';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FlowHeaderGetEntity } from '../entities/flow/flow-header-get.entity';
import { FlowHeaderEntityRequest } from '../entities/flow/flow-header-request.entity';
import { LedgerAccountGetEntity } from '../entities/flow/ledger-account-get.entity';
import { FlowDataAccountEntity } from '../entities/flow/flow-data-account.entity';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class FlowService {
    private _user = JSON.parse(localStorage.getItem("usuario")!) as User;
    private _companyId = Number(localStorage.getItem("currentCompany"));

    loadingTableFlow = signal(false);

    private readonly _http = inject(HttpClient);

    constructor(){ }

    getFlowData(structureHeaderId: number): Observable<IResponseModel<FlowDataAccountEntity>> {
        const url = `${environment.baseUrlBI}/api/Flujo/ListarDatosEstructura/${this._user.id}/${this._companyId}/${structureHeaderId}`;

        return this._http.get<IResponseModel<FlowDataAccountEntity>>(url);
    }

    getFlowTypes(): Observable<IResponseModel<FlowTypeGetEntity[]>> {
        const url = `${environment.baseUrlBI}/api/Flujo/ObtenerTiposFlujo/${this._user.id}/${this._companyId}`;

        return this._http.get<IResponseModel<FlowTypeGetEntity[]>>(url);
    }

    getFlowHeaders(flowTypeId: number): Observable<IResponseModel<FlowHeaderGetEntity[]>> {
        const url = `${environment.baseUrlBI}/api/Flujo/ListarCabeceras`;
        const httpParams = new HttpParams().append("idUsuario",this._user.id)
                                            .append("idEmpresa",this._companyId)
                                            .append("idTipoFlujo",flowTypeId)
                                            .append("estado",1)

        return this._http.get<IResponseModel<FlowHeaderGetEntity[]>>(url, { params: httpParams });
    }

    saveFlow(flow: FlowHeaderEntityRequest): Observable<any> {
        const url = `${environment.baseUrlBI}/api/Flujo/InsertarFlujo`;

        return this._http.post<IResponseModel<any[]>>(url,flow);
    }

    getLedgerAccounts(): Observable<IResponseModel<LedgerAccountGetEntity[]>> {
        const url = `${environment.baseUrlBI}/api/Flujo/ListarCuentasContables/${this._user.id}/${this._companyId}`;

        return this._http.get<IResponseModel<LedgerAccountGetEntity[]>>(url);
    }
}
