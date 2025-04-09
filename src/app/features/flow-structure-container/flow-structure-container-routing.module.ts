import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlowStructureComponent } from './flow-structure/flow-structure.component';
import { FlowStructureContainerComponent } from './flow-structure-container.component';

const routes: Routes = [{
  path: "",
  component: FlowStructureContainerComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlowStructureContainerRoutingModule { }
