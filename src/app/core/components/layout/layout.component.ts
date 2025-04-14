import { Component, inject, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuService } from 'app/core/services/menu.service';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { UserCompany } from 'app/core/models/user-company';
import { NgClass } from '@angular/common';
import { ActionEntity, Asignable, ModulesEntity } from 'app/core/entities/menu/menu.entity';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-layout',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet,FormsModule,RouterLink,MatIconModule,MatFormFieldModule,MatSelectModule,NgClass,MatButtonModule,MatMenuModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private readonly _menuService = inject(MenuService);

  private readonly _router = inject(Router);

  listModules = JSON.parse(localStorage.getItem("menu")!); //omputed(()=>this._menuService.listMenu());
  companies = JSON.parse(localStorage.getItem("companies")!);
  operations: Asignable[] = JSON.parse(localStorage.getItem("operations")!);
  currentCompanyId: number = JSON.parse(localStorage.getItem("currentCompany")!);
  currentOperationId: string = localStorage.getItem("currentOperation")!;

  openSidebar: boolean = true;

  ngOnInit(): void {
  }

  selectMenu(item: ModulesEntity, subItem: ActionEntity): void {
    const currentButtons = item.otrasAcciones.filter(accion => accion.idPredecesor === subItem.idOpcion);
    localStorage.setItem("actions",JSON.stringify(currentButtons));
  }

  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle("showMenu");
  }

  changeCurrentOperationStorage(): void {
    localStorage.setItem("currentOperation",this.currentOperationId);
  }

  logout(): void {
    localStorage.clear();
    this._router.navigate(["login"]);
  }
}
