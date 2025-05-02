import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, signal, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { FormGroup } from '@angular/forms';
import { DialogFlowStructurePresenter } from './dialog-flow-structure.presenter';
import { ButtonType } from '@shared/enums/button-type.enum';
import { DialogStructureContainerComponent } from '../../dialog-structure-container/dialog-structure-container.component';
import { MatDialog } from '@angular/material/dialog';
import { FlowTypeGet } from 'app/core/models/flow/flow-type-get';
import { FlowHeaderRequest, FlowStructureRegister, Structure } from 'app/core/models/flow/flow-header-request';
import { DataDialogStructure } from '../../dialog-structure-container/dialog-structure/dialog-structure.models';
import { HierarchyNode } from './dialog-flow-structure.models';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { LedgerAccountGet } from 'app/core/models/flow/ledger-account-get';
import { FlowHeaderGet } from 'app/core/models/flow/flow-header-get';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

@Component({
  selector: 'ui-dialog-flow-structure',
  encapsulation: ViewEncapsulation.None,
  /* changeDetection: ChangeDetectionStrategy.OnPush, */
  templateUrl: './dialog-flow-structure.component.html',
  styleUrl: './dialog-flow-structure.component.scss',
  providers: [DialogFlowStructurePresenter]
})
export class DialogFlowStructureComponent implements OnInit {
  @Input() currentFlowType?: number;
  @Input() currentHeader?: FlowHeaderGet | null;
  @Input() flowTyes: FlowTypeGet[] = [];
  @Input() accountsTree: HierarchyNode[] = [];
  @Output() eventSaveFlow: EventEmitter<FlowHeaderRequest> = new EventEmitter<FlowHeaderRequest>();
  @Output() eventGetLedgerAccounts: EventEmitter<void> = new EventEmitter<void>();
  @Output() selectedAccountsChange = new EventEmitter<LedgerAccountGet[]>();

  private readonly _dialogFlowStructurePresenter = inject(DialogFlowStructurePresenter);
  private cd = inject(ChangeDetectorRef);
  treeControl = new NestedTreeControl<Structure>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Structure>();

  canShowTree = false;
  currentFlowTypeId: number = 0;
  currentFlowTypeName: string = "";
  currentNode: Structure | null = null;
  nameFlow: string = "";
  flowStructureList: Structure[] = [];
  loadingTree = signal<boolean>(false);
  selectedFilters: string[] = [];
  selectedAccounts!: LedgerAccountGet[];
  filteredAccounts!: LedgerAccountGet[];
  showAssociatedAccount: boolean = false;
  menuContextNode!: Structure;
  tabIndex = 0;
  
  public readonly dialog = inject(MatDialog);

  assignedAccountCodes = new Set<string>();

  
  constructor() {
    this.dataSource.data = this.flowStructureList;
  }
  
  hasChild = (_: number, node: Structure) => !!node.children && node.children.length > 0;
  
  filterForm!: FormGroup;
  form!: FormGroup;
  buttonType = ButtonType;

  ngOnInit(): void {
    this.filterForm = this._dialogFlowStructurePresenter.initFormFilters();
    this.form = this._dialogFlowStructurePresenter.initForm(this.currentHeader?.name, this.currentFlowType);
    if(this.currentHeader && this.currentFlowType) this.showTree();
    // Escuchar cambios en los filtros
    this.filterForm.valueChanges.subscribe(values => {
      this.updateFilters(values);
    });
  }

  updateFilters(values: any) {
    this.selectedFilters = [];
    if (values.filter90) this.selectedFilters.push('90');
    if (values.filter94) this.selectedFilters.push('94');
    if (values.filter95) this.selectedFilters.push('95');
    
    // Si no hay filtros seleccionados o están todos seleccionados, mostrar todos
    if (this.selectedFilters.length === 0 || this.selectedFilters.length === 3) {
      this.selectedFilters = []; // Mostrar todos
    }
  }

  openDialogStructure(params: DataDialogStructure): void {
    console.log("antes de abrir : ",params);
    params.totalNodes = this._dialogFlowStructurePresenter.totalNodesBranch(this.flowStructureList,params )
    const respDialogo = this.dialog.open(DialogStructureContainerComponent, {
      data: params,/* {node: node, isEdit: isEdit}, */
      disableClose: true,
      width: "550px",
      minWidth: "300px",
    });
    respDialogo.beforeClosed().subscribe((paramCloseDialog: { nodes: Structure[], isEdit: boolean }) => {
        if(paramCloseDialog) {
          const {nodes, isEdit} = paramCloseDialog
          console.log("mis nodos: ",{...nodes});
          if(!isEdit) {
            if(params.currentNode) {
              //params.currentNode.children.push(...nodes);
              params.currentNode.children = [...params.currentNode.children,...nodes]
              let found = this._dialogFlowStructurePresenter.findObjectByOrder(this.flowStructureList,params.currentNode.order);
              found = params.currentNode;
              this.flowStructureList = [...this.flowStructureList]
              this.cd.detectChanges();
            } else {
              console.log("params: ",params);
              this.flowStructureList.push(...nodes);
            }
            this.dataSource.data = this.flowStructureList;
            this.loadingTree.set(true);
            setTimeout(() => {
              this.loadingTree.set(false);
            }, 1000);
            console.log("total nodos actuales: ",this.flowStructureList);
          } else {
            if(params.currentNode){
              const currentNode = params.currentNode;
              const updatedNode = paramCloseDialog.nodes[0];
              let found = this._dialogFlowStructurePresenter.findObjectByOrderAndParent(this.flowStructureList,currentNode.order,currentNode.parentId);
              if (found) {
                found.levelName = updatedNode.levelName;
          
                if (found.levelId === 3) {
                  found.budgetAmount = updatedNode.budgetAmount;
                  found.unitQuantity = updatedNode.unitQuantity;
                }
          
                // Opcional: refrescar árbol visual si no se refleja automáticamente
                this.treeControl.dataNodes = this.flowStructureList;
                this.treeControl.expandAll();
              }
              /* console.log("se foundeo? : ",found);
              if(found)
                params.currentNode = found;
              this.flowStructureList = [...this.flowStructureList];
              this.dataSource.data = this.flowStructureList;
              console.log("veamos: ",this.flowStructureList);
              this.cd.detectChanges(); */
            }
            /* console.log("se ha editado: ",params.currentNode);
            console.log("nodo modificado: ",nodes[0]); */
          }
          this.currentNode = null;
          this.treeControl.collapseAll();
        }
    });
  }

  showTree(): void {
    this.canShowTree = true;
    const flowTypeId = this.form.get("flowType")?.value;
    this.nameFlow = this.form.get("name")?.value;
    this.currentFlowTypeId = flowTypeId;
    this.currentFlowTypeName = this.flowTyes.find(type => type.flowTypeId === flowTypeId)?.name!;
    //this.form.disable();
  }

  saveStructure(): void {
    const flow = this._dialogFlowStructurePresenter.initFlowStructure(this.form.get("name")?.value,this.form.get("flowType")?.value,this.currentHeader?.structureHeaderId);
    flow.structureDetail.detail = this._dialogFlowStructurePresenter.normalizeTree(this.flowStructureList);
    console.log("el this.flowStructureList es: ",this.flowStructureList);
    this.eventSaveFlow.emit(flow);
  }

  editForm(): void {
    this.form.enable();
  }

  createDataDialog(isEdit: boolean, current?: Structure): DataDialogStructure {
    return new DataDialogStructure(isEdit, current);
  }

  verificationError(controlName: string): string {
    return this._dialogFlowStructurePresenter.verificationError(this.form,controlName);
  }

  getLedgerAccounts(node: Structure): void {
    this.currentNode = node;
    this.showAssociatedAccount = false;
    if(node.accountsList && node.accountsList?.length > 0) {
      this.filteredAccounts = [...node.accountsList];
      this.showAssociatedAccount = true;
    }
    this.tabIndex = 1;
    console.log("tiene cuentas? ", node.accountsList);
    this.updateAssignedAccountsSet(); // Actualizar el Set antes de mostrar
    this.eventGetLedgerAccounts.emit();
  }

  getTabIndex(event: StepperSelectionEvent): void {
    this.tabIndex = event.selectedIndex;
    console.log(event);
  }

  handleSelectedAccounts(selectedAccounts: LedgerAccountGet[]): void {
    console.log("original: ",selectedAccounts);
    this.selectedAccounts = [...selectedAccounts];
    /* console.log('Cuentas seleccionadas:', selectedAccounts);
    const filteredAccounts = this.filterAccounts(selectedAccounts);
    console.log("cuentas filtradas: ",filteredAccounts); */
    // Aquí puedes usar las cuentas seleccionadas
  }

  getAccountsFiltered(): void {
    this.filteredAccounts = [...this.filterAccounts(this.selectedAccounts)];
    this.showAssociatedAccount = true;
  }

  filterAccounts(accounts: LedgerAccountGet[]): LedgerAccountGet[] {
    if (this.selectedFilters.length === 0) return accounts;
    
    return accounts.filter(account => 
      this.selectedFilters.some(prefix => account.accountCode.startsWith(prefix))
    );
  }

  assignAccount(): void {
    if(this.currentNode) this.currentNode.accountsList = [...this.filteredAccounts];
    this.showAssociatedAccount = false;
    this.currentNode = null;
    this.filterForm.reset();
  }

  deleteNode(node: Structure): void {
    if (node.levelId === 1) {
      // Eliminar nodo raíz (level 1)
      this.flowStructureList = this.flowStructureList.filter(n => n.levelName !== node.levelName);
    } else {
      // Eliminar nodos hijos/nietos (level 2 o 3)
      this.removeNodeFromTree(this.flowStructureList, node);
    }
  
    // Actualizar el árbol y UI
    this.refreshTreeUI();
  }
  
  private removeNodeFromTree(nodes: Structure[], nodeToDelete: Structure): boolean {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.levelName === nodeToDelete.levelName && node.levelId === nodeToDelete.levelId) {
        nodes.splice(i, 1); // Eliminar el nodo encontrado
        return true;
      }
      if (node.children && node.children.length > 0) {
        const wasDeleted = this.removeNodeFromTree(node.children, nodeToDelete);
        if (wasDeleted) return true;
      }
    }
    return false;
  }
  
  private refreshTreeUI(): void {
    this.dataSource.data = [...this.flowStructureList]; // Forzar actualización
    this.currentNode = null;
    this.treeControl.collapseAll();
    
    // Spinner (opcional)
    this.loadingTree.set(true);
    setTimeout(() => this.loadingTree.set(false), 1000);
  }

  private updateAssignedAccountsSet(): void {
    this.assignedAccountCodes = new Set();
    this.traverseTree(this.flowStructureList);
  }

  private traverseTree(nodes: Structure[]): void {
    nodes.forEach(node => {
      if (node.accountsList) {
        node.accountsList.forEach(account => 
          this.assignedAccountCodes.add(account.accountCode)
        );
      }
      if (node.children) this.traverseTree(node.children);
    });
  }

  setCurrentNode(node: Structure): void {
    this.currentNode = node;
    console.log("setCurrentNode");
  }
}
