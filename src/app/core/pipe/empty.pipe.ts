import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'empty',
  standalone: true
})
export class EmptyPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value == "string" && (value.trim().length == 0 || value.includes("01/01/0001"))) return "-";
        return value ?? "-";
  }

}
