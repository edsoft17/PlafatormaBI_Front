import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const toastrService = inject(ToastrService);
	
	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			console.log("el error es: ",error);
			return throwError(() => error);	
		})
	);
};
