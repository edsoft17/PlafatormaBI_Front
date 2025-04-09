import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class FormService {
    constructor() {}
    
    obtenerErrorControl(control: AbstractControl): string {
        if (!control.errors) return ""; // Verificación inicial
        
        if (control.hasError("matDatepickerParse")) return "Formato de fecha incorrecta";
        if (control.hasError("required")) return "El campo es requerido";
        if (control.hasError("min")) return "Seleccione una opción";
        if (control.hasError("minlength")) return `El campo debe tener como mínimo ${control.errors["minlength"].requiredLength} caracteres`;
        if (control.hasError("maxlength")) return `El campo no debe exceder de los ${control.errors["maxlength"].requiredLength} caracteres`;
        if (control.hasError("pattern")) return "El formato no es válido";
        if (control.hasError("rangeDateInvalid")) return "No puede ser menor a la fecha de inicio";
        if (control.hasError("matDatepickerMin")) return `La fecha no puede ser mayor a ${control.errors["matDatepickerMin"].min.toFormat('dd-MM-yyyy')}`;
        if (control.hasError("matDatepickerMax")) return `La fecha no puede ser mayor a ${control.errors["matDatepickerMax"].max.toFormat('dd-MM-yyyy')}`;
        
        return "";
    }

    addValidateControl(form: AbstractControl, nameControl: string, validators: ValidatorFn | ValidatorFn[]): void {
        form.get(nameControl)?.addValidators(validators);
        form.get(nameControl)?.updateValueAndValidity();
    }

    deleteValidationsControl(form: AbstractControl, nameControl: string): void {
        form.get(nameControl)?.clearValidators();
        form.get(nameControl)?.updateValueAndValidity();
    }
    
}
