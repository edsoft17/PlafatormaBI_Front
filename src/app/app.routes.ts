import { Routes } from '@angular/router';
import { AuthContainerComponent } from './features/auth-container/auth-container.component';
import { LayoutComponent } from './core/components/layout/layout.component';
import { listaMenuResolver } from './core/resolvers/list-menu.resolver';

export const routes: Routes = [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'login'
    },
    { path: "login", component: AuthContainerComponent},
    {
        path: '',
        component: LayoutComponent,
        /* resolve: {
          data: listaMenuResolver
        }, */
        children: [
          { path: 'dashboard', loadChildren: () => import('app/features/dashboard-container/dashboard-container.module') },
          { path: 'estructura-flujo', loadChildren: () => import('app/features/flow-structure-container/flow-structure-container.module') },
          { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
        ]
    },
    { path: "**", redirectTo: "login" }
];
