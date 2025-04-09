import { LedgerAccountGet } from "app/core/models/flow/ledger-account-get";

export interface TreeNode {
  name: string;
  selected?: boolean;
  children?: TreeNode[];
}

export interface HierarchyNode {
  name: string;
  level: 'level1' | 'level2' | 'level3';
  children: HierarchyNode[];
  accounts?: LedgerAccountGet[];
  parentName?: string;
  selected?: boolean;
  indeterminate?: boolean;
}