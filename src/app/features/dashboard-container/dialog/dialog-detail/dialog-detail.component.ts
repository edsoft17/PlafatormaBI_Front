import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { BiContDialogComponent } from 'app/components/bi-cont-dialog/bi-cont-dialog.component';
import { CurrencyPipe } from '@angular/common';
import { AbsPipe } from 'app/core/pipe/abs.pipe';

@Component({
  selector: 'app-dialog-detail',
  standalone: true,
  imports: [BiContDialogComponent,MatTableModule,JsonPipe,AbsPipe,CommonModule],
  templateUrl: './dialog-detail.component.html',
  styleUrl: './dialog-detail.component.scss',
  providers: [DatePipe,CurrencyPipe]
})
export class DialogDetailComponent {
  readonly data: { primerGrupo: any[], segundoGrupo: any[], dates: [Date,Date], executedAmount: number, budgetedAmount: number, name: string } = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<DialogDetailComponent>);
  private currencyPipe = inject(CurrencyPipe);
  private datePipe = inject(DatePipe);

  dataSource: any[] = [];
  displayedColumns = ['Area']; // siempre incluyes las fijas primero

  ngOnInit(): void {
    this.dataSource = this.data.primerGrupo;
    const dynamicKeys = Object.keys(this.data.primerGrupo[0]).filter(key => key !== 'Area');
    this.displayedColumns = [...this.displayedColumns, ...dynamicKeys];
  }

  formatCellValue(value: any, column: string): string {
    if (column === 'Area') {
      return value || '';
    }
  
    const num = Number(value);
    if (isNaN(num)) {
      return this.currencyPipe.transform(0, 'PEN', 'symbol', '1.2-2', 'es-PE') || 'S/ 0.00';
    }
  
    return this.currencyPipe.transform(num, 'PEN', 'symbol', '1.2-2', 'es-PE') || '';
  }
  
  getCostCenterTitle(): string {
    const start = this.datePipe.transform(this.data.dates[0], 'MM/yyyy');
    const end = this.datePipe.transform(this.data.dates[1], 'MM/yyyy');
    return `Detalle por centro de costo de ${this.data.name} del ${start} al ${end}`;
  }
}
