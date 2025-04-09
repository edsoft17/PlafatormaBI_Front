import { inject } from '@angular/core';
import { ActivatedRoute, ResolveFn } from '@angular/router';
import { IResponseModel } from '@shared/models/response-model.interface';
import { AuthService } from '../auth/auth.service';
import { UserCompanyService } from '../services/user-company.service';

export const listaMenuResolver: ResolveFn<IResponseModel<any>> = (route, state) => {
	const authService = inject(AuthService);
	const userCompanyService = inject(UserCompanyService);
	const request = {
		idUsuario: authService.currentUser()?.id,
		idPlataforma: 25,
		idEmpresa: userCompanyService.currentCompany()?.id
	}
  	return inject(AuthService).getMenu(request);
}