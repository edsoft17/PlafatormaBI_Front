import { inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormService } from "@shared/services/form.service";
import { FlowHeaderRequest, Structure } from "app/core/models/flow/flow-header-request";
import { User } from "app/core/models/user.model";
import { DataDialogStructure } from "../../dialog-structure-container/dialog-structure/dialog-structure.models";
import { LedgerAccountGet } from "app/core/models/flow/ledger-account-get";
import { HierarchyNode } from "./dialog-flow-structure.models";
import { FlowDataAssociatedAccounts, FlowDataGet } from "app/core/models/flow/flow-data-account";

export class DialogFlowStructurePresenter {
    private _companyId = Number(localStorage.getItem("currentCompany"));
    private _user = JSON.parse(localStorage.getItem("usuario")!) as User;

    private readonly _fb = inject(FormBuilder);
    private readonly _formService = inject(FormService);

    initForm(name?: string, flowType?: number): FormGroup{
        return this._fb.group({
            userId: [""],
            name: [name ?? "", Validators.required],
            companyId: [""],
            flowType: [flowType ?? 0, Validators.required],
            state: [""],

        });
    }

    initFlowStructure(name: string, flowType: number, flowHeaderId?: number): FlowHeaderRequest {
        return {
            userId: this._user.id,
            companyId: this._companyId,
            name: name,
            flowTypeId: flowType,
            flowState: 1,
            structureDetail: {
                companyId: this._companyId,
                flowHeaderId: flowHeaderId ?? 0,
                userId: this._user.id,
                detail: []
            }
        }
    }

    initFormFilters(): FormGroup {
        return this._fb.group({
            filter90: [false],
            filter94: [false],
            filter95: [false]
        });
    }




    transformToHierarchy(accounts: LedgerAccountGet[]): HierarchyNode[] {
        // Primero creamos un objeto temporal para organizar los datos
        const tempHierarchy: {
            [level1: string]: {
                [level2: string]: {
                    [level3: string]: LedgerAccountGet[];
                };
            };
        } = {};
    
        // Organizamos las cuentas en la estructura temporal
        accounts.forEach(account => {
            if (!tempHierarchy[account.level1]) {
                tempHierarchy[account.level1] = {};
            }
            
            if (!tempHierarchy[account.level1][account.level2]) {
                tempHierarchy[account.level1][account.level2] = {};
            }
            
            if (!tempHierarchy[account.level1][account.level2][account.level3]) {
                tempHierarchy[account.level1][account.level2][account.level3] = [];
            }
            
            tempHierarchy[account.level1][account.level2][account.level3].push(account);
        });
    
        // Convertimos la estructura temporal a la jerarquía final
        const hierarchy: HierarchyNode[] = [];
    
        // Procesamos level1
        for (const level1Name in tempHierarchy) {
            const level1Node: HierarchyNode = {
                name: level1Name,
                level: 'level1',
                children: [],
                accounts: [],
                selected: false,
                indeterminate: false
            };
    
            // Procesamos level2
            for (const level2Name in tempHierarchy[level1Name]) {
                const level2Node: HierarchyNode = {
                    name: level2Name,
                    level: 'level2',
                    children: [],
                    accounts: [],
                    parentName: level1Name,
                    selected: false,
                    indeterminate: false
                };
    
                // Procesamos level3
                for (const level3Name in tempHierarchy[level1Name][level2Name]) {
                    const accounts = tempHierarchy[level1Name][level2Name][level3Name];
                    const level3Node: HierarchyNode = {
                        name: level3Name,
                        level: 'level3',
                        children: [],
                        accounts: accounts,
                        parentName: level2Name,
                        selected: false,
                        indeterminate: false
                    };
    
                    level2Node.children.push(level3Node);
                    level2Node.accounts = [...(level2Node.accounts || []), ...accounts];
                }
    
                level1Node.children.push(level2Node);
                level1Node.accounts = [...(level1Node.accounts || []), ...(level2Node.accounts || [])];
            }
    
            hierarchy.push(level1Node);
        }
    
        return hierarchy;
    }












    public normalizeTree(tree: Structure[]): Structure[] {
        const sequentialTree = this.assignSequentialOrders(tree);
        const withParentIds = this.updateParentIds(sequentialTree);
        //const withMarkedLevels = this.markLastThirdLevelNodes(withParentIds);
        return this.flattenTree(withParentIds);
    }
    
      /**
       * Método 2: Asigna números de orden secuenciales (DFS)
       */
    private assignSequentialOrders(nodes: Structure[], counter: { value: number } = { value: 1 }): Structure[] {
        return nodes.map(node => {
            const currentOrder = counter.value++;
            
            return {
            ...node,
            order: currentOrder,
            children: this.assignSequentialOrders(node.children, counter)
            };
        });
    }
    
      /**
       * Método 3: Actualiza parentIds según la nueva jerarquía
       */
    private updateParentIds(nodes: Structure[], currentParentId: number = 0): Structure[] {
        return nodes.map(node => {
            const childrenWithUpdatedParents = this.updateParentIds(node.children, node.order);
            
            return {
            ...node,
            parentId: currentParentId,
            children: childrenWithUpdatedParents
            };
        });
    }

    /**
     * Método para marcar el último nodo del tercer nivel
     */
    private markLastThirdLevelNodes(nodes: Structure[], currentLevel: number = 1): Structure[] {
        return nodes.map(node => {
            // Procesar hijos recursivamente
            const processedChildren = this.markLastThirdLevelNodes(node.children, currentLevel + 1);
            
            // Marcar el último nodo del tercer nivel
            if (currentLevel === 2 && processedChildren.length > 0) {
                const lastIndex = processedChildren.length - 1;
                processedChildren[lastIndex] = {
                    ...processedChildren[lastIndex],
                    lastLevelId: 1
                };
            }
            
            return {
                ...node,
                children: processedChildren
            };
        });
    }

    /**
   * Método 4: Convierte el árbol jerárquico en lista plana
   */
    private flattenTree(nodes: Structure[]): Structure[] {
        const result: Structure[] = [];
        
        const traverse = (node: Structure) => {
            // Creamos copia del nodo con children vacío
            const flatNode: Structure = {
                ...node,
                children: []
            };
            result.push(flatNode);
            
            // Procesar hijos recursivamente
            node.children.forEach(traverse);
        };
        
        nodes.forEach(traverse);
        return result;
    }
       
        
    private findLastNodeInLevel(nodes: Structure[]): Structure | null {
        return nodes.length > 0 ? nodes[nodes.length - 1] : null;
    }

    totalNodesBranch(flowStructureList: Structure[], dataDialog: DataDialogStructure): number {
        const { isEdit, currentNode } = dataDialog;
        if(!currentNode) return flowStructureList.length;

        return currentNode.children.length;
        
    }
    
    findObjectByOrder(
        items: Structure[], 
        targetOrder: number
    ): Structure | null {
        // Buscar en el array actual
        for (const item of items) {
            if (item.order === targetOrder) {
                return item;
            }
            
            // Si tiene hijos, buscar recursivamente en ellos
            if (item.children && item.children.length > 0) {
                const foundInChildren = this.findObjectByOrder(item.children, targetOrder);
                if (foundInChildren) {
                    return foundInChildren;
                }
            }
        }
        
        // Si no se encontró en este nivel ni en los hijos
        return null;
    }

    findObjectByOrderAndParent(
        items: Structure[],
        targetOrder: number,
        targetParentId: number
      ): Structure | null {
        for (const item of items) {
          if (item.order === targetOrder && item.parentId === targetParentId) {
            return item;
          }
      
          if (item.children?.length) {
            const foundInChildren = this.findObjectByOrderAndParent(item.children, targetOrder, targetParentId);
            if (foundInChildren) {
              return foundInChildren;
            }
          }
        }
      
        return null;
      }

    verificationError(form: AbstractControl, control: string): string {
        return this._formService.obtenerErrorControl(form.get(control)!);
    }




    buildHierarchy(accounts: LedgerAccountGet[]) {
        // Construimos la estructura jerárquica
        const hierarchy: any = {};
        
        accounts.forEach(account => {
          if (!hierarchy[account.level1]) {
            hierarchy[account.level1] = {
              name: account.level1,
              children: {},
              accounts: []
            };
          }
    
          if (!hierarchy[account.level1].children[account.level2]) {
            hierarchy[account.level1].children[account.level2] = {
              name: account.level2,
              children: {},
              accounts: []
            };
          }
    
          if (!hierarchy[account.level1].children[account.level2].children[account.level3]) {
            hierarchy[account.level1].children[account.level2].children[account.level3] = {
              name: account.level3,
              accounts: []
            };
          }
    
          hierarchy[account.level1].children[account.level2].children[account.level3].accounts.push(account);
        });

        return hierarchy;
    }

    convertFlowDataGetEntityToStructure(flowData: FlowDataGet[]): Structure[] {
        const structures = flowData.map(flow => {
            return {
                order: flow.order,
                levelId: flow.levelId,
                parentId: flow.parentId,
                levelName: flow.levelName.trimEnd(),
                behaviorId: Number(flow.behavior),
                lastLevelId: flow.isLastLevel,
                sourceDetailId: 1,//cambiar
                budgetAmount: flow.budgetAmount,
                unitQuantity: flow.budgetQuantity,
                accountsList: [],
                children: []
            }
        });

        return structures;
    }

    /* buildStructureTree(flatData: Structure[], accounts: FlowDataAssociatedAccounts[]): Structure[] {
        const nodeMap = new Map<number, Structure>();
        const tree: Structure[] = [];
      
        // Clonar y mapear por order
        flatData.forEach(item => {
          nodeMap.set(item.order, { ...item, children: [] });
        });
      
        // Enlazar hijos con padres
        nodeMap.forEach((node) => {
          if (node.parentId === 0) {
            tree.push(node);
          } else {
            const parentNode = nodeMap.get(node.parentId);
            if (parentNode) {
              parentNode.children.push(node);
            }
          }
        });
      
        return tree;
    } */

    buildStructureTree(
        flatData: Structure[],
        accounts: FlowDataAssociatedAccounts[]
        ): Structure[] {
        const nodeMap = new Map<number, Structure>();
        const tree: Structure[] = [];
        
        // Clonar y mapear los nodos por "order"
        flatData.forEach(item => {
            nodeMap.set(item.order, { ...item, children: [] });
        });
        
        // Enlazar hijos con padres
        nodeMap.forEach((node) => {
            if (node.parentId === 0) {
            tree.push(node);
            } else {
            const parentNode = nodeMap.get(node.parentId);
            if (parentNode) {
                parentNode.children.push(node);
            }
            }
        });
        
        // Asignar accountsList solo en nodos de nivel 3
        const assignAccounts = (node: Structure, depth: number) => {
            if (depth === 3) {
            const matchingAccounts = accounts
                .filter(acc => acc.order === node.order)
                .map(acc => ({
                accountCode: acc.accountCode,
                account: acc.accountName,
                level1: acc.level1,
                level2: acc.level2,
                level3: acc.level3
                }));
            node.accountsList = matchingAccounts;
            }
        
            node.children.forEach(child => assignAccounts(child, depth + 1));
        };
        
        // Iniciar asignación de cuentas desde la raíz
        tree.forEach(root => assignAccounts(root, 1));
        
        return tree;
        }
}