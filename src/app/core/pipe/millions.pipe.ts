import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'millions',
  standalone: true
})
export class MillionsPipe implements PipeTransform {

  transform(value: number): string {
    if (value === null || value === undefined || isNaN(value)) return '0,00 MM';

    const millions = value / 1_000_000;
    const formatted = millions.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return `${formatted} MM`;
  }

}
