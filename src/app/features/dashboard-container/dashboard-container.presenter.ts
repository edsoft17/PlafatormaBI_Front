import { inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

export class DashboardContainerPresenter {
    private readonly _routeActive = inject(ActivatedRoute);
    
    getDataFromRoute(): any {
        const datos = this._routeActive.snapshot.data['listaMenuResolver'];
    }
}