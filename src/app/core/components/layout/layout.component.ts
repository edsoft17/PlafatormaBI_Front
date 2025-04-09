import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuService } from 'app/core/services/menu.service';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { UserCompany } from 'app/core/models/user-company';
import { NgClass } from '@angular/common';
import { ActionEntity, ModulesEntity } from 'app/core/entities/menu/menu.entity';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet,FormsModule,RouterLink,MatIconModule,MatFormFieldModule,MatSelectModule,NgClass,MatButtonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private readonly _menuService = inject(MenuService);

  listModules = JSON.parse(localStorage.getItem("menu")!); //omputed(()=>this._menuService.listMenu());
  companies = JSON.parse(localStorage.getItem("companies")!);
  currentCompanyId: number = JSON.parse(localStorage.getItem("currentCompany")!);

  menuSidebar = [
    {
      link_name: "Dashboard",
      link: "/dashboard",
      icon: "bx bx-grid-alt",
      sub_menu: []
    }, {
      link_name: "Category",
      link: null,
      icon: "bx bx-collection",
      sub_menu: [
        {
          link_name: "HTML & CSS",
          link: "/html-n-css",
        }, {
          link_name: "JavaScript",
          link: "/javascript",
        }, {
          link_name: "PHP & MySQL",
          link: "/php-n-mysql",
        }
      ]
    }, {
      link_name: "Posts",
      link: null,
      icon: "bx bx-book-alt",
      sub_menu: [
        {
          link_name: "Web Design",
          link: "/posts/web-design",
        }, {
          link_name: "Login Form",
          link: "/posts/login-form",
        }, {
          link_name: "Card Design",
          link: "/posts/card-design",
        }
      ]
    }, {
      link_name: "Analytics",
      link: "/analytics",
      icon: "bx bx-pie-chart-alt-2",
      sub_menu: []
    }, {
      link_name: "Chart",
      link: "/chart",
      icon: "bx bx-line-chart",
      sub_menu: []
    }, {
      link_name: "Plugins",
      link: null,
      icon: "bx bx-plug",
      sub_menu: [
        {
          link_name: "UI Face",
          link: "/ui-face",
        }, {
          link_name: "Pigments",
          link: "/pigments",
        }, {
          link_name: "Box Icons",
          link: "/box-icons",
        }
      ]
    }, {
      link_name: "Explore",
      link: "/explore",
      icon: "bx bx-compass",
      sub_menu: []
    }, {
      link_name: "History",
      link: "/history",
      icon: "bx bx-history",
      sub_menu: []
    }, {
      link_name: "Setting",
      link: "/setting",
      icon: "bx bx-cog",
      sub_menu: []
    }
  ]

  openSidebar: boolean = true;

  selectMenu(item: ModulesEntity, subItem: ActionEntity): void {
    const currentButtons = item.otrasAcciones.filter(accion => accion.idPredecesor === subItem.idOpcion);
    localStorage.setItem("actions",JSON.stringify(currentButtons));
  }

  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle("showMenu");
  }
}
