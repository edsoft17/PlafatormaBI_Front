import { booleanAttribute, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { BiPaginationTableComponent } from '../bi-pagination-table/bi-pagination-table.component';
import { TableColumnsDefInterface } from '@shared/models/ITableColumnsDefInterface';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommonModule, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { EmptyPipe } from 'app/core/pipe/empty.pipe';
import { BiPillComponent } from '../bi-pill/bi-pill.component';
import { IconOption } from '@shared/models/IGenericIcon';

const rangosPorPagina = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) return `0 de ${length}`;

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
};

@Component({
  selector: 'bi-table',
  standalone: true,
  imports: [
    BiPaginationTableComponent,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    NgClass,
    MatTableModule,
    MatTooltipModule,
    MatIconModule,
    CommonModule,
    EmptyPipe,
    BiPillComponent,
    MatPaginatorModule
  ],
  templateUrl: './bi-table.component.html',
  styleUrl: './bi-table.component.scss'
})
export class BiTableComponent<T> implements OnInit, OnChanges {
  @Input({transform: booleanAttribute}) showIconEdit: boolean = false;
  @Input({transform: booleanAttribute}) showIconDelete: boolean = false;
  @Input(/* {required: true} */) headers: TableColumnsDefInterface[] = [];
  @Input(/* {required: true} */) data: T[] = [];
  @Input() loading!: boolean;
  @Input() icons: IconOption<T>[] = [];

  @Output() eventEditRow: EventEmitter<T> = new EventEmitter<T>();
  @Output() eventDeleteRow: EventEmitter<T> = new EventEmitter<T>();

  /* @ViewChild(MatPaginator) paginator!: MatPaginator; */

  public dataSource!: MatTableDataSource<T>;
  public displayedColumns: string[] = [];

  /* ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = "Items por página";
    this.paginator._intl.previousPageLabel = "Página anterior";
    this.paginator._intl.nextPageLabel = "Siguiente página";
    this.paginator._intl.getRangeLabel = rangosPorPagina;
} */
  
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<T>(this.data);
    this.headers
        .sort((a, b) => (a.id < b.id ? -1 : 1))
        .forEach((column: TableColumnsDefInterface) => {
            this.displayedColumns.push(column.name || "");
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"]?.currentValue) {
      this.data = [...this.data];
      this.dataSource = new MatTableDataSource<T>(this.data);
    }
  }

  dataSourceReturned(source: MatTableDataSource<T>): void {
    this.dataSource = source;
  }

  defineTextPill(value: boolean | number): string {
    const newValue = this.convertBoolToNumber(value);
    const map: {[key: number]: string} = {
        0: 'Inactivo',
        1: 'Activo'
    }

    return map[newValue];
  }

  convertBoolToNumber(value: boolean | number): number {
    if (typeof value === "boolean") return value ? 1 : 0;
    else return value;
  }

  executeIcon(icon: IconOption<T>, dato: T, index: number): void {
    const objDelete: any = { dato: dato, index: index };
    icon.executeAction(index == -1 ? dato : objDelete);
  }

  editNode(row: T): void {
    this.eventEditRow.emit(row);
  }

  deleteNode(row: T): void {
    this.eventDeleteRow.emit(row);
  }
  
  /* showMessageT(index: number, elemento: any, header: TableColumnsDefInterface, icon: IconOption<T>): string {
    const objIcon = this.getNameAttribute(index, header);
    return (objIcon && !elemento[objIcon[1]]) ? objIcon[2] : icon.tooltip!;
  } */

  /* getNameAttribute(index: number, header: TableColumnsDefInterface): string[] {
    const indexCustomIcon = header?.customIcon?.findIndex(cIcon => cIcon[0] === this.icons[index].id);
    if (indexCustomIcon !== undefined && indexCustomIcon !== -1) return header.customIcon![indexCustomIcon];
  } */

}
