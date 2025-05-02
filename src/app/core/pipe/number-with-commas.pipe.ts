import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberWithCommas',
  standalone: true
})
export class NumberWithCommasPipe implements PipeTransform {

  transform(value: number | string): string {
    // Convertir a string si es número
    const numStr = typeof value === 'number' ? value.toString() : value;
    
    // Separar parte entera y decimal
    const parts = numStr.split('.');
    let integerPart = parts[0];
    const decimalPart = parts.length > 1 ? `.${parts[1]}` : '';
    
    // Añadir comas cada 3 dígitos
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return integerPart + decimalPart;
  }

}
