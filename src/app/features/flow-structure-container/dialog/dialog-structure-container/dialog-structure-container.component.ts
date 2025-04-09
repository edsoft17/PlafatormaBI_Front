import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlowStructureRegister, Structure } from 'app/core/models/flow/flow-header-request';
import { DataDialogStructure } from './dialog-structure/dialog-structure.models';

@Component({
  selector: 'app-dialog-structure-container',
  template: `
    <ui-dialog-structure 
      class="w-full"
      [dataDialog]="data"
      (eventSendNodes)="sendNodes($event)">
    </ui-dialog-structure>
  `,
  styles: ``
})
export class DialogStructureContainerComponent {
  readonly data: DataDialogStructure = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<DialogStructureContainerComponent>);

  ngOnInit(): void {
  }

  sendNodes(nodes: Structure[]): void {
    this.dialogRef.close({ nodes: nodes, isEdit: this.data.isEdit });
  }
}
