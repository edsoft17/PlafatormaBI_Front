import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IResponseModel } from '@shared/models/response-model.interface';
import { SpinnerService } from '@shared/services/spinner.service';
import { FlowRequestAdapter } from 'app/core/adapters/flow/flow-request.adapter';
import { LedgerAccountAdapter } from 'app/core/adapters/flow/ledger-account.adapter';
import { LedgerAccountGetEntity } from 'app/core/entities/flow/ledger-account-get.entity';
import { FlowHeaderRequest } from 'app/core/models/flow/flow-header-request';
import { FlowTypeGet } from 'app/core/models/flow/flow-type-get';
import { FlowService } from 'app/core/services/flow.service';
import { finalize } from 'rxjs';
import { DialogFlowStructurePresenter } from './dialog-flow-structure/dialog-flow-structure.presenter';
import { HierarchyNode, TreeNode } from './dialog-flow-structure/dialog-flow-structure.models';
import { FlowDataAccount } from 'app/core/models/flow/flow-data-account';
import { DialogFlowStructureComponent } from './dialog-flow-structure/dialog-flow-structure.component';
import { FlowHeaderGet } from 'app/core/models/flow/flow-header-get';

@Component({
  selector: 'app-dialog-flow-structure-container',
  template: `
    <ui-dialog-flow-structure
      [currentHeader]="data.currentHeader"
      [currentFlowType]="data.currentFlowType"
      [flowTyes]="data.flowTypes"
      [accountsTree]="accountsTree"
      (eventSaveFlow)="saveFlow($event)"
      (eventGetLedgerAccounts)="getLedgerAccounts()"
    >
    </ui-dialog-flow-structure>
  `,
  providers: [FlowRequestAdapter,LedgerAccountAdapter,DialogFlowStructurePresenter]
})
export class DialogFlowStructureContainerComponent {
  readonly data: { currentHeader: FlowHeaderGet | null, currentFlowType: number, flowTypes: FlowTypeGet[], flowData: FlowDataAccount } = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<DialogFlowStructureContainerComponent>);

  private readonly _spinnerService = inject(SpinnerService);
  private readonly _flowService = inject(FlowService);

  private readonly _flowRequestAdapter = inject(FlowRequestAdapter);
  private readonly _ledgerAccountAdapter = inject(LedgerAccountAdapter);
  private readonly _dialogFlowStructurePresenter = inject(DialogFlowStructurePresenter);
  private cd = inject(ChangeDetectorRef);

  accountsTree: HierarchyNode[] = [];
  @ViewChild(DialogFlowStructureComponent) dialogFlowStructureComponent!: DialogFlowStructureComponent;
  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    // ✅ Aquí ya puedes acceder a los métodos y propiedades del hijo
    console.log(this.dialogFlowStructureComponent);
    if(this.data.flowData) {
      const structures = this._dialogFlowStructurePresenter.convertFlowDataGetEntityToStructure(this.data.flowData.flows);
      const structuresTree = this._dialogFlowStructurePresenter.buildStructureTree(structures,this.data.flowData.accounts);
      console.log("structures: ",structuresTree);
      this.dialogFlowStructureComponent.flowStructureList = structuresTree;/* [
        {
            "order": 11,
            "levelName": "padre 1",
            "levelId": 1,
            "budgetAmount": 0,
            "unitQuantity": 0,
            "behaviorId": 0,
            "parentId": 0,
            "sourceDetailId": 1,
            "lastLevelId": 0,
            "children": [
                {
                    "order": 21,
                    "levelName": "hijo 1",
                    "levelId": 2,
                    "budgetAmount": 0,
                    "unitQuantity": 0,
                    "behaviorId": 0,
                    "parentId": 11,
                    "sourceDetailId": 1,
                    "lastLevelId": 0,
                    "children": [
                        {
                            "order": 31,
                            "levelName": "nieto 1",
                            "levelId": 3,
                            "budgetAmount": 5222,
                            "unitQuantity": 12,
                            "behaviorId": 0,
                            "parentId": 21,
                            "sourceDetailId": 1,
                            "lastLevelId": 1,
                            "children": []
                        },
                        {
                            "order": 32,
                            "levelName": "nieto 2",
                            "levelId": 3,
                            "budgetAmount": 9000,
                            "unitQuantity": 2,
                            "behaviorId": 0,
                            "parentId": 21,
                            "sourceDetailId": 1,
                            "lastLevelId": 1,
                            "children": []
                        }
                    ]
                },
                {
                    "order": 22,
                    "levelName": "hijo 2",
                    "levelId": 2,
                    "budgetAmount": 0,
                    "unitQuantity": 0,
                    "behaviorId": 0,
                    "parentId": 11,
                    "sourceDetailId": 1,
                    "lastLevelId": 0,
                    "children": [
                        {
                            "order": 31,
                            "levelName": "nieto 3",
                            "levelId": 3,
                            "budgetAmount": 5555,
                            "unitQuantity": 12,
                            "behaviorId": 0,
                            "parentId": 22,
                            "sourceDetailId": 1,
                            "lastLevelId": 1,
                            "children": []
                        }
                    ]
                }
            ]
        },
        {
            "order": 12,
            "levelName": "padre 2",
            "levelId": 1,
            "budgetAmount": 0,
            "unitQuantity": 0,
            "behaviorId": 0,
            "parentId": 0,
            "sourceDetailId": 1,
            "lastLevelId": 0,
            "children": [
                {
                    "order": 21,
                    "levelName": "hijo 3",
                    "levelId": 2,
                    "budgetAmount": 0,
                    "unitQuantity": 0,
                    "behaviorId": 0,
                    "parentId": 12,
                    "sourceDetailId": 1,
                    "lastLevelId": 0,
                    "children": []
                }
            ]
        },
        {
            "order": 13,
            "levelName": "padre 3",
            "levelId": 1,
            "budgetAmount": 0,
            "unitQuantity": 0,
            "behaviorId": 0,
            "parentId": 0,
            "sourceDetailId": 1,
            "lastLevelId": 0,
            "children": [
                {
                    "order": 21,
                    "levelName": "hijo 4",
                    "levelId": 2,
                    "budgetAmount": 0,
                    "unitQuantity": 0,
                    "behaviorId": 0,
                    "parentId": 13,
                    "sourceDetailId": 1,
                    "lastLevelId": 0,
                    "children": [
                        {
                            "order": 31,
                            "levelName": "nieto 4",
                            "levelId": 3,
                            "budgetAmount": 4500,
                            "unitQuantity": 23,
                            "behaviorId": 0,
                            "parentId": 21,
                            "sourceDetailId": 1,
                            "lastLevelId": 1,
                            "children": []
                        },
                        {
                            "order": 32,
                            "levelName": "nieto 5",
                            "levelId": 3,
                            "budgetAmount": 9533,
                            "unitQuantity": 23,
                            "behaviorId": 0,
                            "parentId": 21,
                            "sourceDetailId": 1,
                            "lastLevelId": 1,
                            "children": []
                        }
                    ]
                },
                {
                    "order": 22,
                    "levelName": "hijo 5",
                    "levelId": 2,
                    "budgetAmount": 0,
                    "unitQuantity": 0,
                    "behaviorId": 0,
                    "parentId": 13,
                    "sourceDetailId": 1,
                    "lastLevelId": 0,
                    "children": []
                },
                {
                    "order": 23,
                    "levelName": "hijo 6",
                    "levelId": 2,
                    "budgetAmount": 0,
                    "unitQuantity": 0,
                    "behaviorId": 0,
                    "parentId": 13,
                    "sourceDetailId": 1,
                    "lastLevelId": 0,
                    "children": []
                }
            ]
        }
    ]; */
    this.dialogFlowStructureComponent.dataSource.data = this.dialogFlowStructureComponent.flowStructureList;
    this.cd.detectChanges();
    /*this.dialogFlowStructureComponent.loadingTree.set(true);
     setTimeout(() => {
      this.dialogFlowStructureComponent.loadingTree.set(false);
    }, 1000); */
      console.log("si existe: ",this.data.flowData);
    }
    //this.dialogFlowStructureComponent.algunMetodo(); // Ejemplo
  }
  saveFlow(flow: FlowHeaderRequest): void {
    this._spinnerService.show();
    const entity = this._flowRequestAdapter.convertModelToEntity(flow);
    console.log("entity : ",entity);
    console.log("cuentas asociadas: ",this._flowRequestAdapter.extraerCuentasConOrden(entity.structureDetail.Estructura));
    this._flowService.saveFlow(entity).pipe(finalize(()=>this._spinnerService.hide())).subscribe({
      next: (data) => {
        this.dialogRef.close(true);
      }
    });
  }

  getLedgerAccounts(): void {
    this._spinnerService.show();
    this._flowService.getLedgerAccounts().pipe(finalize(()=>this._spinnerService.hide())).subscribe({
      next: (response: IResponseModel<LedgerAccountGetEntity[]>) => {
        if(response.status.status === 200) {
          const accounts = this._ledgerAccountAdapter.convertAccountsEntityToModelArray(response.data);
          //this.accountsTree = this._dialogFlowStructurePresenter.buildHierarchy(accounts);
          this.accountsTree = this._dialogFlowStructurePresenter.transformToHierarchy(accounts);
        }
      }
    })
  }
}
