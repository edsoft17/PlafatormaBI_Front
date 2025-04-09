import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthTokenAdapter } from '../auth/auth.adapter';
import { AuthToken } from '../auth/auth.model';
import { Router } from '@angular/router';

export const permissionsInterceptor: HttpInterceptorFn = (req, next) => {

  	/* const urls = ["https://soluciones.linea.pe/aplicativos"];
	  const authTokenAdapter = inject(AuthTokenAdapter); */
	const authService = inject(AuthService);
	const token = localStorage.getItem("token");
	let request = req;

	if (req.headers.has('authorization')) {
		return next(req);
	}

	if(token) {
		request = req.clone({
			headers: req.headers.set('Authorization', `Bearer ${token}`)
		});
	}

  /* console.log("url ",req.url);

	if(urls.some(url => req.url.includes(url))){
		return authService.createToken().pipe(
			switchMap((token: AuthToken) => {
				const newReq = req.clone({
                    headers: req.headers.set('Authorization', token.jwt),
                });
				return next(newReq);
			})
		)
    } */
	return next(request).pipe(
		catchError((err: HttpErrorResponse) => {
			// Si el error es 401 (Token Expirado), intentar refrescarlo
			if (err.status === 401) {
				console.log("no autorizado");
				return authService.refreshToken().pipe(
					switchMap((newTokens) => {
						console.log("newTokens: ",newTokens);
						// Guardamos los nuevos tokens
						localStorage.setItem('token', newTokens.accessToken);
						localStorage.setItem('refreshToken', newTokens.refreshToken);
			
						// Clonamos la solicitud original y le añadimos el nuevo token
						const clonedRequest = req.clone({
						  headers: req.headers.set('Authorization', `Bearer ${newTokens.accessToken}`)
						});
			
						// Reintenta la solicitud original con el nuevo token
						return next(clonedRequest);
						/* console.log("el switchMap");
						// Guardar el nuevo token en localStorage
						localStorage.setItem('token', newToken.accessToken);

						// Clonar la solicitud original con el nuevo token
						request = req.clone({
							headers: req.headers.set('Authorization', `Bearer ${newToken.accessToken}`)
						});

						// Reintentar la solicitud original con el nuevo token
						return next(request); */
					}),
					catchError((error) => {
						// Si no se puede refrescar el token, redirigir al login
						console.error('Error al refrescar el token', error);
						// Redirigir al login si el refreshToken también falla
						//inject(Router).navigate(['/login']);
						// Devolver un observable vacío para evitar que se bloquee el flujo
						return throwError(() => error); // Es recomendable lanzar el error si no se puede refrescar el token
					})
				);
			}

			// Si el error no es 401, continuar con el flujo de la solicitud
			return throwError(() => err);
		})
	);
};
