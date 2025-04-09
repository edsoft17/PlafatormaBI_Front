import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IResponseModel } from '@shared/models/response-model.interface';
import { FlowHeaderGetAdapter } from 'app/core/adapters/flow/flow-header.adapter';
import { FlowTypeGetAdapter } from 'app/core/adapters/flow/flow-type.adapter';
import { FlowHeaderGetEntity } from 'app/core/entities/flow/flow-header-get.entity';
import { FlowTypeGetEntity } from 'app/core/entities/flow/flow-type-get.entity';
import { FlowHeaderGet } from 'app/core/models/flow/flow-header-get';
import { FlowTypeGet } from 'app/core/models/flow/flow-type-get';
import { FlowService } from 'app/core/services/flow.service';
import { FlowStructureComponent } from './flow-structure/flow-structure.component';
import { finalize, forkJoin, Observable } from 'rxjs';
import { SpinnerService } from '@shared/services/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { FlowDataAccountEntity } from 'app/core/entities/flow/flow-data-account.entity';
import { FlowDataGetAdapter } from 'app/core/adapters/flow/flow-data-account.adapter';

@Component({
  selector: 'app-flow-structure-container',
  template: `
    <ui-flow-structure 
      class="w-full"
      [flowTypes]="flowTypes"
      [flowHeaders]="flowHeaders"
      (eventGetFlowHeader)="getFlowHeaders($event)"
      (eventLoadInitDataDialog)="loadInitDataDialog($event)"
    >
    </ui-flow-structure>
  `,
  providers: [FlowTypeGetAdapter,FlowHeaderGetAdapter,FlowDataGetAdapter]
})
export class FlowStructureContainerComponent implements OnInit {
  private readonly _flowService = inject(FlowService);
  private readonly _spinnerService = inject(SpinnerService);
  private readonly _toastrService = inject(ToastrService);

  private readonly _flowTypeGetAdapter = inject(FlowTypeGetAdapter);
  private readonly _flowHeaderGetAdapter = inject(FlowHeaderGetAdapter);
  private readonly _flowDataGetAdapter = inject(FlowDataGetAdapter);

  flowTypes: FlowTypeGet[] = [];
  flowHeaders: FlowHeaderGet[] = [];

  @ViewChild(FlowStructureComponent) flowStructureComponent!: FlowStructureComponent;

  ngOnInit(): void {
    this.getFlowTypes();  
  }

  getFlowTypes(): void {
    this._spinnerService.show();
    this._flowService.getFlowTypes().pipe(finalize(()=>this._spinnerService.hide())).subscribe({
      next: (response: IResponseModel<FlowTypeGetEntity[]>) => {
        if(response.status.status === 200)
          this.flowTypes = this._flowTypeGetAdapter.convertEntityToModelArray(response.data);
      }, 
      error: (data: HttpErrorResponse) => {
        if(data.status === 500) this._toastrService.error("Error de conexión con el servidor", "Error");
        console.log("mi data es: ",data);
      }
    });
  }

  getFlowHeaders(flowTypeId: number): void {
    this._flowService.loadingTableFlow.set(true);
    this._flowService.getFlowHeaders(flowTypeId).pipe(finalize(()=>this._flowService.loadingTableFlow.set(false))).subscribe({
      next: (response: IResponseModel<FlowHeaderGetEntity[]>) => {
        if(response.status.status) this.flowHeaders = this._flowHeaderGetAdapter.convertEntityToModelArray(response.data);
        console.log("this.flowHeaders: ",this.flowHeaders);
      }
    });
  }

  loadInitDataDialog(structureHeader: FlowHeaderGet | null): void {
    //this.flowStructureComponent.openDialogFlowStructure([]);
    const arrObs: [Observable<IResponseModel<FlowTypeGetEntity[]>>,Observable<IResponseModel<FlowDataAccountEntity>>] = [
      this._flowService.getFlowTypes(),
      this._flowService.getFlowData((structureHeader) ? structureHeader.structureHeaderId : 0)
    ];
    this._spinnerService.show();
    forkJoin(arrObs).pipe(finalize(()=>this._spinnerService.hide())).subscribe({
      next: (response: [IResponseModel<FlowTypeGetEntity[]>,IResponseModel<FlowDataAccountEntity>]) => {
        const flowTypes = this._flowTypeGetAdapter.convertEntityToModelArray(response[0].data);
        const flowData = (response[1].data.flujo.length > 0) ? this._flowDataGetAdapter.convertEntityToModel(response[1].data) : null;
        console.log("flowData ",flowData);
        this.flowStructureComponent.openDialogFlowStructure(structureHeader, flowTypes, flowData);
      }
    });
  }
}
