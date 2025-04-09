import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { LedgerAccountGet } from 'app/core/models/flow/ledger-account-get';
import { HierarchyNode } from '../../dialog-flow-structure.models';

@Component({
  selector: 'app-tree-checkboxes',
  templateUrl: './tree-checkboxes.component.html',
  styleUrl: './tree-checkboxes.component.scss'
})
export class TreeCheckboxesComponent {
  @Input() accountsTree: HierarchyNode[] = [];
  @Output() selectedAccountsChange = new EventEmitter<LedgerAccountGet[]>();
  @Input() assignedAccountCodes: Set<string> = new Set(); // Recibido desde el padre

  isDisabled(node: HierarchyNode): boolean {
    const allAccounts = this.getAllNodeAccounts(node);
    return allAccounts.length > 0 && allAccounts.every(account => 
      this.assignedAccountCodes.has(account.accountCode)
    );
  }

  private getAllNodeAccounts(node: HierarchyNode): LedgerAccountGet[] {
    let accounts = node.accounts ? [...node.accounts] : [];
    if (node.children) {
      node.children.forEach(child => {
        accounts = [...accounts, ...this.getAllNodeAccounts(child)];
      });
    }
    return accounts;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['accountsTree'] || changes['assignedAccountCodes']) {
      this.initializeSelection(this.accountsTree);
    }
  }

  // Inicializa los estados selected e indeterminate
  private initializeSelection(nodes: HierarchyNode[]): void {
    nodes.forEach(node => {
      node.selected = node.selected || false;
      node.indeterminate = node.indeterminate || false;
      
      if (node.children && node.children.length > 0) {
        this.initializeSelection(node.children);
      }
    });
  }

  // Maneja cambios en los checkboxes
  onSelectionChange(event: MatCheckboxChange, node: HierarchyNode): void {
    node.selected = event.checked;
    node.indeterminate = false;
    
    // Actualizar hijos si es un nivel padre
    if (node.children && node.children.length > 0) {
      this.updateChildrenSelection(node.children, event.checked);
    }
    
    // Actualizar padres
    this.updateParentSelection(node);
    
    // Emitir cuentas seleccionadas
    this.emitSelectedAccounts();
  }

  // Actualiza la selección de los nodos hijos
  private updateChildrenSelection(children: HierarchyNode[], selected: boolean): void {
    children.forEach(child => {
      child.selected = selected;
      child.indeterminate = false;
      
      if (child.children && child.children.length > 0) {
        this.updateChildrenSelection(child.children, selected);
      }
    });
  }

  // Actualiza el estado de los nodos padres
  private updateParentSelection(node: HierarchyNode): void {
    if (!node.parentName) return; // Es level1, no tiene padre
    
    // Encontrar el nodo padre
    const parent = this.findParentNode(this.accountsTree, node.parentName);
    if (!parent) return;
    
    // Calcular estado del padre
    const allChildrenSelected = parent.children.every(child => child.selected);
    const someChildrenSelected = parent.children.some(child => child.selected || child.indeterminate);
    
    parent.selected = allChildrenSelected;
    parent.indeterminate = someChildrenSelected && !allChildrenSelected;
    
    // Propagación recursiva hacia arriba
    this.updateParentSelection(parent);
  }

  // Busca un nodo padre en la jerarquía
  private findParentNode(nodes: HierarchyNode[], parentName: string): HierarchyNode | null {
    for (const node of nodes) {
      if (node.name === parentName) return node;
      
      if (node.children && node.children.length > 0) {
        const found = this.findParentNode(node.children, parentName);
        if (found) return found;
      }
    }
    return null;
  }

  // Emite las cuentas seleccionadas
  private emitSelectedAccounts(): void {
    const selectedAccounts = this.getSelectedAccounts(this.accountsTree);
    this.selectedAccountsChange.emit(selectedAccounts);
  }

  // Obtiene todas las cuentas seleccionadas
  private getSelectedAccounts(nodes: HierarchyNode[]): LedgerAccountGet[] {
    let accounts: LedgerAccountGet[] = [];
    
    nodes.forEach(node => {
      // Si el nodo está completamente seleccionado, agregar sus cuentas
      if (node.selected && !node.indeterminate && node.accounts) {
        accounts = [...accounts, ...node.accounts];
      }
      // Si no está completamente seleccionado, revisar hijos
      else if (node.children && node.children.length > 0) {
        accounts = [...accounts, ...this.getSelectedAccounts(node.children)];
      }
    });
    
    return accounts;
  }

  // Cuenta las cuentas en un nodo y sus hijos
  countAccounts(node: HierarchyNode): number {
    if (node.accounts) return node.accounts.length;
    if (!node.children || node.children.length === 0) return 0;
    
    return node.children.reduce((total, child) => total + this.countAccounts(child), 0);
  }
}
