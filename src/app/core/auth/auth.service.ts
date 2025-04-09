import { AuthTokenEntity } from './auth.entity';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { AuthTokenAdapter } from './auth.adapter';
import { AuthToken } from './auth.model';
import { IResponseModel } from '@shared/models/response-model.interface';
import { TypeDocumentEntity } from '../entities/type-document.entity';
import { LoginRequest } from 'app/features/auth-container/auth/auth.models';
import { IUserEntity } from '../entities/user.entity';
import { User } from '../models/user.model';
import { MenuEntity } from '../entities/menu/menu.entity';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _urlSeguridad = "https://soluciones.linea.pe/linea.pe";
  private _urlGeus = "https://soluciones.linea.pe/aplicativos";

  private CLIENT_TOKEN = "zi7cfHbCFGxYnuJ8H2MfFfV3V8YbEXp8";
  private API_ID = 12;

  private readonly _http = inject(HttpClient);
  private readonly _authTokenAdapter = inject(AuthTokenAdapter);
  
  currentUser = signal<User | null>(null);

  constructor() { }

  createToken(): Observable<AuthToken> {
    console.log("token");
    const url = `${this._urlSeguridad}/api_security/v4/authorization/create-auth-application-token-v2`;
    let paramsHttp: HttpParams = new HttpParams()
      .append("ClaveAccesoCliente",this.CLIENT_TOKEN)
      .append("IdAppRecurso",this.API_ID)
    return this._http.get<AuthTokenEntity>(url,{ params: paramsHttp }).pipe(
      map((data: AuthTokenEntity) => this._authTokenAdapter.convertEntityToModel(data))
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token'); // Obtener el refreshToken
    const accessToken = localStorage.getItem('token'); // Obtener el refreshToken

    /* if (!refreshToken) {
      // Si no hay refreshToken, redirige a login
      inject(Router).navigate(['/login']);
      return new Observable();
    } */

    return this._http.post<any>(`${environment.baseUrlBI}/Autenticacion/refresh-token`, { refreshToken, accessToken });/* .pipe(
      switchMap((response: any) => {
        if (response && response.accessToken) {
          return response;  // Devuelve el nuevo token
        } else {
          throw new Error('No se pudo obtener el nuevo token');
        }
      })
    ); */
  }

  getTypesDocument(): Observable<IResponseModel<TypeDocumentEntity[]>> {
    const url = `${environment.baseUrlBI}/api/Autenticacion/ObtenerTiposDocumentos`;// "https://localhost:7046";
    return this._http.get<IResponseModel<TypeDocumentEntity[]>>(url).pipe();
  }

  login(request: LoginRequest): Observable<IResponseModel<IUserEntity>> {
    const url = `${environment.baseUrlBI}/api/Autenticacion/login`;//"https://localhost:7046/api/Autenticacion/login";
    return this._http.post<IResponseModel<IUserEntity>>(url,request);
  }

  getListCompaniesUser(request: any): Observable<IResponseModel<any>> {
    const url = `${environment.baseUrlBI}/api/Autenticacion/ListarEmpresasAccesoUsuario`;//"https://localhost:7046/api/Autenticacion/ListarEmpresasAccesoUsuario";
    return this._http.post<any>(url,request);
  }

  getMenu(request: any): Observable<IResponseModel<MenuEntity>> {
    const url = `${environment.baseUrlBI}/api/Autenticacion/OpcionesMenu`;//"https://localhost:7046/api/Autenticacion/OpcionesMenu";
    return this._http.post<IResponseModel<MenuEntity>>(url,request);
  }
}
