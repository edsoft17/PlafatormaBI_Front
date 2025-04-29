import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AuthComponent } from './auth/auth.component';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthToken } from 'app/core/auth/auth.model';
import { TypeDocumentEntity } from 'app/core/entities/type-document.entity';
import { IResponseModel } from '@shared/models/response-model.interface';
import { TypeDocumentAdapter } from 'app/core/adapters/type-document.adapter';
import { TypeDocument } from 'app/core/models/type-document.model';
import { FormLogin, LoginRequest } from './auth/auth.models';
import { IpService } from '@shared/services/ip.service';
import { IUserEntity } from 'app/core/entities/user.entity';
import { User } from 'app/core/models/user.model';
import { UserAdapter } from 'app/core/adapters/user.adapter';
import { Router } from '@angular/router';
import { IUserCompanyEntity } from 'app/core/entities/user-company.entity';
import { UserCompanyService } from 'app/core/services/user-company.service';
import { UserCompanyAdapter } from 'app/core/adapters/user-company.adapter';
import { UserCompany } from 'app/core/models/user-company';
import { finalize, lastValueFrom } from 'rxjs';
import { MenuService } from 'app/core/services/menu.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '@shared/services/spinner.service';

@Component({
  selector: 'app-auth-container',
  standalone: true,
  imports: [AuthComponent],
  template: `
    <ui-auth
      [typesDocument]="typesDocument"
      (eventSignIn)="login($event)"
    >
    </ui-auth>
  `,
  providers: [TypeDocumentAdapter,UserAdapter,UserCompanyAdapter]
})
export class AuthContainerComponent implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly _ipService = inject(IpService);
  private readonly _userCompanyService = inject(UserCompanyService);
  private readonly _menuService = inject(MenuService);
  private readonly _toastrService = inject(ToastrService);
  private readonly _spinnerService = inject(SpinnerService);

  private readonly _router = inject(Router);
  private readonly _typeDocumentAdapter = inject(TypeDocumentAdapter);
  private readonly _userAdapter = inject(UserAdapter);
  private readonly _userCompanyAdapter = inject(UserCompanyAdapter);

  authToken!: AuthToken;
  typesDocument!: TypeDocument[];
  user!: User;
  selecteCompany!: UserCompany;

  @ViewChild(AuthComponent) authComponent!: AuthComponent;
  ngOnInit(): void {
    //this.createToken();
    this.getTypesDocument();
  }

  createToken(): void {
    this._authService.createToken().subscribe({
      next: (data: AuthToken) => {
        this.authToken = data;
        console.log("el token es ",this.authToken);
      }
    });
  }

  getTypesDocument(): void {
    this._spinnerService.show();
    this._authService.getTypesDocument().pipe(finalize(()=>this._spinnerService.hide())).subscribe({
      next: (response: IResponseModel<TypeDocumentEntity[]>) => {
        if(response.status.status) this.typesDocument = this._typeDocumentAdapter.convertEntityToModelArray(response.data);
      }
    });
  }

  login(formLogin: FormLogin): void {
    this._spinnerService.show();
    const request: LoginRequest = {
      idPlataforma: "25",
      tipoDoc: formLogin.typeDocument,
      nroDoc: formLogin.document,
      password: formLogin.password,
      ip: this._ipService.ipClient(),
      appVersion: "1"
    };

    this._authService.login(request).subscribe({
      next: (response: IResponseModel<IUserEntity>) => {
        if(response.status.status === 500) this._toastrService.error("No se pudo conectar con el servidor","ERROR DE CONEXIÓN");
        else {
          localStorage.setItem("token",response.data.token)
          localStorage.setItem("refresh_token",response.data.refreshToken)
          localStorage.setItem("usuario",JSON.stringify(response.data));
          this.user = this._userAdapter.convertEntityToModel(response.data);
          this._authService.currentUser.set(this.user);
          this.getListCompaniesUser();
        }
        console.log("login exitoso");
      }
    });
  }

  getListCompaniesUser(): void {
    const request = {
      idUsuario: this.user.id,
      idPlataforma: 25
    };
    this._authService.getListCompaniesUser(request).subscribe({
      next: async (response: IResponseModel<IUserCompanyEntity[]>) => {
        if(response.status.status === 200){
          this._userCompanyService.listCompany.set(this._userCompanyAdapter.convertEntityToModelArray(response.data));
          localStorage.setItem("companies",JSON.stringify(this._userCompanyService.listCompany()));
          if(this._userCompanyService.listCompany().length > 1)
            this.authComponent.openDialog();
          else{
            this._userCompanyService.currentCompany.set(this._userCompanyService.listCompany()[0]);
            localStorage.setItem("currentCompany",String(this._userCompanyService.currentCompany()?.id));
            const menu = await this.getMenu();
            this._menuService.listMenu.set(menu);
            this._router.navigate(["","dashboard-operacion"]);
          }
        }
      }
    });
  }

  async getMenu(): Promise<any> {
    const request = {
      idUsuario: this._authService.currentUser()?.id,
      idPlataforma: 25,
      idEmpresa: this._userCompanyService.currentCompany()?.id
    };
    
    try{
      const response = await lastValueFrom(this._authService.getMenu(request));
      this._spinnerService.hide();
      if(response.status.status === 200) {
        localStorage.setItem("menu",JSON.stringify(response.data));
        localStorage.setItem("operations",JSON.stringify(response.data.asignables));
        localStorage.setItem("currentOperation","O202");//por defecto por mientras
        return response.data
      }
      return null;
    }catch{
      this._spinnerService.hide();
    }
  }
}