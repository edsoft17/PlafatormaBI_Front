import { Component, inject, OnInit } from '@angular/core';
import { DashboardContainerPresenter } from './dashboard-container.presenter';

@Component({
  selector: 'app-dashboard-container',
  template: `
    <ui-dashboard></ui-dashboard>
  `,
  providers: [DashboardContainerPresenter]
})
export class DashboardContainerComponent implements OnInit {
  
  private readonly _dashboardContainerPresenter = inject(DashboardContainerPresenter);

  ngOnInit(): void {
    this._dashboardContainerPresenter.getDataFromRoute();
  }
}
