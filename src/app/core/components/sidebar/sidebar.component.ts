import { CommonModule } from '@angular/common';
import { Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MenuService } from 'app/core/services/menu.service';

@Component({
  selector: 'ui-sidebar',
  standalone: true,
  imports: [CommonModule,MatIconModule,FormsModule,RouterLink],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly _menuService = inject(MenuService);

  listModules = computed(()=>this._menuService.listMenu());
  itemCollapse:{collapse:boolean,codigo:number}={collapse:false,codigo:0};
  
  /* listModules:{modulos:any[],acciones:any[]} = {
    "modulos": [
      {
          "idOpcion": "88",
          "idPredecesor": "0",
          "nombre": "Dashboard",
          "url": "Monitoreo Flota",
          "orden": "0",
          "hijo": "1",
          "icono": "dashboard"
      },
      {
          "idOpcion": "89",
          "idPredecesor": "0",
          "nombre": "Padrón de vehículos",
          "url": "Monitoreo Flota",
          "orden": "1",
          "hijo": "1",
          "icono": "directions_car"
      },
      {
          "idOpcion": "90",
          "idPredecesor": "0",
          "nombre": "Programación de viajes",
          "url": "Monitoreo Flota",
          "orden": "2",
          "hijo": "1",
          "icono": "airplanemode_active"
      },
      {
          "idOpcion": "91",
          "idPredecesor": "0",
          "nombre": "Monitoreo",
          "url": "Monitoreo Flota",
          "orden": "3",
          "hijo": "3",
          "icono": "settings"
      },
      {
          "idOpcion": "92",
          "idPredecesor": "0",
          "nombre": "Gestión incidentes",
          "url": "Monitoreo Flota",
          "orden": "4",
          "hijo": "3",
          "icono": "settings"
      }
    ],
    "acciones": [
      {
        "idOpcion": "248",
        "idModulo": "88",
        "nombre": "Monitoreo Flota",
        "url": "Monitoreo Flota",
        "orden": "1",
        "icono": "",
        "codigo": "ctrflo_a105",
        "esMenu": "S",
        "idPredecesor": "0",
        "nombrePredecesor": ""
      },
      {
        "idOpcion": "248",
        "idModulo": "88",
        "nombre": "prueba 5 ",
        "url": "Monitoreo Flota",
        "orden": "5",
        "icono": "",
        "codigo": "ctrflo_a105",
        "esMenu": "S",
        "idPredecesor": "0",
        "nombrePredecesor": ""
      }
    ]
  } */

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

  listItems:any[]=[];

  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle("showMenu");
  }

  changeItem(item:any){
    if(this.itemCollapse.codigo==item.idOpcion)
      this.itemCollapse.collapse = !this.itemCollapse.collapse;
    else{
      this.itemCollapse.collapse = true;
      this.itemCollapse.codigo = item.idOpcion;
    }
    //this.listItems = this.listModules.acciones.filter(c => c.idModulo == item.idOpcion).sort((a, b) => a.orden - b.orden);
  }

  
}
