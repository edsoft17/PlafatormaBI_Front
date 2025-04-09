import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DialogStructurePresenter } from './dialog-structure.presenter';
import { ButtonType } from '@shared/enums/button-type.enum';
import { TableColumnsDefInterface } from '@shared/models/ITableColumnsDefInterface';
import { FlowStructureRegister, Structure } from 'app/core/models/flow/flow-header-request';
import { DataDialogStructure } from './dialog-structure.models';

@Component({
  selector: 'ui-dialog-structure',
  templateUrl: './dialog-structure.component.html',
  styleUrl: './dialog-structure.component.scss',
  providers: [DialogStructurePresenter]
})
export class DialogStructureComponent implements OnInit {
  @Input() dataDialog!: DataDialogStructure;
  /* @Input() node: FlowStructureRegister | undefined;
  @Input() isEdit: boolean = false; */
  @Output() eventSendNodes: EventEmitter<Structure[]> = new EventEmitter<Structure[]>();
  
  private readonly _dialogStructurePresenter = inject(DialogStructurePresenter);
  private readonly _changeDetecttor = inject(ChangeDetectorRef);
  form!: FormGroup;

  //flowStructures: FlowStructureRegister[] = [];
  structures = signal<Structure[]>([]);
  buttonType = ButtonType;
  loading: boolean = false;
  invalidName: boolean = false;

  columnsHeaderStructure: TableColumnsDefInterface[] = [
      {
          id: 1,
          name: "levelName",
          displayedName: "Nombre",
          type: "string"
      },
      {
          id: 4,
          name: "parentName",
          displayedName: "Estructura padre",
          type: "string"
      },
      {
          id: 5,
          name: "none",
          displayedName: "Aciones",
          type: "acciones"
      }
    ];

  node!: Structure;
  list: Array<{levelName: string, parentName: string}> = [];

  constructor() {

  }

  ngOnInit(): void {
    this.node = this._dialogStructurePresenter.initStructure(this.dataDialog);
    console.log("nodo actual: ",this.dataDialog.currentNode);
    this.form = this._dialogStructurePresenter.initForm(this.dataDialog);
    this.form.get("levelName")?.valueChanges.subscribe(()=>this.invalidName = false);
  }

  addToTable(): void {
    if(this._dialogStructurePresenter.isNameValidated(this.form.get("levelName")?.value,this.list)) {
      const numOrder = this._dialogStructurePresenter.defineOrder(this.dataDialog,this.structures());
      this.node.order = numOrder;
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 600);
      
      this._dialogStructurePresenter.setValueNode(this.node,this.form);
      this.structures.update(current => [...current, {...this.node}]);
      this.form.reset();
      this.dataDialog.totalNodes++; //+= this.structures().length;
      this.list.push({ levelName: this.node.levelName, parentName: this.dataDialog?.currentNode?.levelName!});
      this.list = [...this.list];
      this.invalidName = false;
      this._changeDetecttor.detectChanges();
    } else {
      this.invalidName = true;
      console.log("inválido");
    }
  }

  sendNode(): void {
    if(this.dataDialog.isEdit) {
      this._dialogStructurePresenter.setValueNode(this.node,this.form);
      this.eventSendNodes.emit([this.node]);
    } else this.eventSendNodes.emit(this.structures());
  }

  deleteRow(data: {levelName: string, parentName: string}): void {
    this.list = this.list.filter(item => item.levelName !== data.levelName);
    console.log("data a eliminar ",data);
  }

  verificationError(controlName: string): string {
    return this._dialogStructurePresenter.verificationError(this.form,controlName);
  }
}
