import { Component, computed, EventEmitter, inject, Input, Output } from '@angular/core';
import { IconOption } from '@shared/models/IGenericIcon';
import { TableColumnsDefInterface } from '@shared/models/ITableColumnsDefInterface';
import { HeaderFlow } from 'app/core/models/header-flow.model';
import { FlowStructurePresenter } from './flow-structure.presenter';
import { MatDialog } from '@angular/material/dialog';
import { DialogFlowStructureContainerComponent } from '../dialog/dialog-flow-structure-container/dialog-flow-structure-container.component';
import { FormControl, Validators } from '@angular/forms';
import { FlowTypeGet } from 'app/core/models/flow/flow-type-get';
import { FlowHeaderGet } from 'app/core/models/flow/flow-header-get';
import { ActionEntity, MenuEntity } from 'app/core/entities/menu/menu.entity';
import { ToastrService } from 'ngx-toastr';
import { FlowService } from 'app/core/services/flow.service';
import { FlowDataAccount } from 'app/core/models/flow/flow-data-account';

@Component({
  selector: 'ui-flow-structure',
  templateUrl: './flow-structure.component.html',
  styleUrl: './flow-structure.component.scss',
  providers: [FlowStructurePresenter]
})
export class FlowStructureComponent {
  @Input() flowTypes: FlowTypeGet[] = [];
  @Input() flowHeaders: FlowHeaderGet[] = [
    {
        "structureHeaderId": 27,
        "name": "Cuarto flujo f2",
        "state": true
    },
    {
        "structureHeaderId": 17,
        "name": "Flujo control costos",
        "state": true
    },
    {
        "structureHeaderId": 33,
        "name": "Flujo de linea",
        "state": true
    },
    {
        "structureHeaderId": 32,
        "name": "Octavo flujo",
        "state": true
    },
    {
        "structureHeaderId": 19,
        "name": "Primer flujo",
        "state": true
    },
    {
        "structureHeaderId": 20,
        "name": "Primer flujo",
        "state": true
    },
    {
        "structureHeaderId": 21,
        "name": "Primer flujo",
        "state": true
    },
    {
        "structureHeaderId": 22,
        "name": "Primer flujo modificado",
        "state": true
    },
    {
        "structureHeaderId": 28,
        "name": "Quinto flujo",
        "state": true
    },
    {
        "structureHeaderId": 23,
        "name": "Segundo flujo",
        "state": true
    },
    {
        "structureHeaderId": 24,
        "name": "Segundo flujo",
        "state": true
    },
    {
        "structureHeaderId": 25,
        "name": "Segundo flujo",
        "state": true
    },
    {
        "structureHeaderId": 31,
        "name": "Séptimo flujo",
        "state": true
    },
    {
        "structureHeaderId": 29,
        "name": "Sexto flujo",
        "state": true
    },
    {
        "structureHeaderId": 30,
        "name": "Sexto flujo",
        "state": true
    },
    {
        "structureHeaderId": 26,
        "name": "Tercer flujo",
        "state": true
    }
];

  @Output() eventGetFlowHeader: EventEmitter<number> = new EventEmitter<number>();
  @Output() eventLoadInitDataDialog: EventEmitter<FlowHeaderGet | null> = new EventEmitter<FlowHeaderGet | null>();

  columnsHeaderFlow: TableColumnsDefInterface[] = [
    {
        id: 0,
        name: "structureHeaderId",
        displayedName: "Código",
        type: "number"
    },
    {
        id: 1,
        name: "name",
        displayedName: "Nombre",
        type: "string"
    },
    {
        id: 4,
        name: "state",
        displayedName: "Estado",
        type: "estado"
    },
    {
        id: 5,
        name: "none",
        displayedName: "Aciones",
        type: "acciones"
    }
  ];

  private readonly _flowService = inject(FlowService);

  listActions = JSON.parse(localStorage.getItem("actions")!) as ActionEntity[];

  loading = computed(()=>this._flowService.loadingTableFlow());
  iconsFlowStructure!: IconOption<any>[];

  public readonly dialog = inject(MatDialog);
  private readonly _flowStructurePresenter = inject(FlowStructurePresenter);
  private readonly _toastrService = inject(ToastrService);

  flowType = new FormControl<number>(0,[Validators.required]);
  buttonsActions: ActionEntity[] = [];

  ngOnInit(): void {
    /* this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000); */
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    //this.iconsFlowStructure = this._flowStructurePresenter.defineIconsFunctions(this.openDialogFlowStructure);
  }
  
  openDialogFlowStructure = (currentHeader: FlowHeaderGet | null, flowTypes: FlowTypeGet[], flowData: FlowDataAccount | null) => {
    const respDialogo = this.dialog.open(DialogFlowStructureContainerComponent, {
      data: {currentHeader: currentHeader, currentFlowType: this.flowType.value, flowTypes: flowTypes, flowData: flowData},
      disableClose: true,
      //width: '100vw',  // 90% del ancho del viewport
      //height: '90vh', // 90% del alto del viewport
      //maxWidth: 'none', // Evita que Material limite el ancho
      width: '95vw',  // 100% del ancho de la ventana
  //height: '100vh', // 100% del alto de la ventana
      maxWidth: 'none', // Evita restricciones de Angular Material
      minWidth: "800px"
    });
    respDialogo.beforeClosed().subscribe(res => {
      if(res){
        this._toastrService.success("Se guardó la estructura exitosamente", "Éxito");
        this.eventGetFlowHeader.emit(this.flowType.value ?? 0);
      }
    });
  }

  actionButton(code: string) {
    if(code === "ctrflo_a03") {
      this.eventLoadInitDataDialog.emit(null);
    }
  }

  getFlowHeaders(): void {
    this.eventGetFlowHeader.emit(this.flowType.value ?? 0);
  }

  editRow(strutureHeader: FlowHeaderGet): void {
    this.eventLoadInitDataDialog.emit(strutureHeader);
  }
}
