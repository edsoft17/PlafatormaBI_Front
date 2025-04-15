import { DatePipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { BiContDialogComponent } from 'app/components/bi-cont-dialog/bi-cont-dialog.component';

@Component({
  selector: 'app-dialog-detail',
  standalone: true,
  imports: [BiContDialogComponent,MatTableModule,JsonPipe],
  templateUrl: './dialog-detail.component.html',
  styleUrl: './dialog-detail.component.scss',
  providers: [DatePipe]
})
export class DialogDetailComponent {
  readonly data: { primerGrupo: any[], segundoGrupo: any[], dates: [Date,Date], name: string } = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<DialogDetailComponent>);
  private datePipe = inject(DatePipe);

  dataSource: any[] = [];
  displayedColumns = ['Area']; // siempre incluyes las fijas primero

  ngOnInit(): void {
    console.log("data modal: ",this.data);
    this.dataSource = this.data.primerGrupo;
    const dynamicKeys = Object.keys(this.data.primerGrupo[0]).filter(key => key !== 'Area');
    this.displayedColumns = [...this.displayedColumns, ...dynamicKeys];
  }

  formatCellValue(value: any, column: string): string {
    // La primera columna es texto, las demás son números
    if (column === 'Area') {
      return value || '';
    }
  
    // Para columnas numéricas, mostrar 2 decimales y 0 si es null/undefined
    const num = Number(value);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  }
  
  getCostCenterTitle(): string {
    const start = this.datePipe.transform(this.data.dates[0], 'MM/yyyy');
    const end = this.datePipe.transform(this.data.dates[1], 'MM/yyyy');
    return `Detalle por centro de costo de ${this.data.name} del ${start} al ${end}`;
  }
}
