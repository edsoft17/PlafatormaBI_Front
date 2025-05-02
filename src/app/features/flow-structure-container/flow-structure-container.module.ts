import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlowStructureContainerRoutingModule } from './flow-structure-container-routing.module';
import { FlowStructureContainerComponent } from './flow-structure-container.component';
import { FlowStructureComponent } from './flow-structure/flow-structure.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BiContBodyComponent } from 'app/components/bi-cont-body/bi-cont-body.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BiTableComponent } from 'app/components/bi-table/bi-table.component';
import { DialogFlowStructureContainerComponent } from './dialog/dialog-flow-structure-container/dialog-flow-structure-container.component';
import { DialogFlowStructureComponent } from './dialog/dialog-flow-structure-container/dialog-flow-structure/dialog-flow-structure.component';
import { BiContDialogComponent } from 'app/components/bi-cont-dialog/bi-cont-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatInputModule } from '@angular/material/input';
import { BiButtonComponent } from 'app/components/bi-button/bi-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogStructureContainerComponent } from './dialog/dialog-structure-container/dialog-structure-container.component';
import { DialogStructureComponent } from './dialog/dialog-structure-container/dialog-structure/dialog-structure.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { TreeCheckboxesComponent } from './dialog/dialog-flow-structure-container/dialog-flow-structure/components/tree-checkboxes/tree-checkboxes.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  declarations: [
    FlowStructureContainerComponent,
    FlowStructureComponent,
    DialogFlowStructureContainerComponent,
    DialogFlowStructureComponent,
    DialogStructureContainerComponent,
    DialogStructureComponent,
    TreeCheckboxesComponent
  ],
  imports: [
    CommonModule,
    FlowStructureContainerRoutingModule,
    MatSelectModule,
    MatFormFieldModule,
    BiContBodyComponent,
    FormsModule,
    BiTableComponent,
    BiContDialogComponent,
    MatTreeModule,
    MatButtonModule, 
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    BiButtonComponent,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule,
    MatStepperModule
  ]
})
export default class FlowStructureContainerModule { }
