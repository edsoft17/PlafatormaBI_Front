import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

const rangePerPage = (page: number, pageSize: number, length: number): string => {
  if (length === 0 || pageSize === 0) return `0 de ${length}`;

  length = Math.max(length, 0);

  const startIndex = page * pageSize;
  const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
};

@Component({
  selector: 'bi-pagination-table',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './bi-pagination-table.component.html',
  styleUrl: './bi-pagination-table.component.scss'
})
export class BiPaginationTableComponent<T> {
  @Input() data!: T[];
  @Input() pageSizeOptions!: number[];
  @Output() eventDataSource: EventEmitter<MatTableDataSource<T>> = new EventEmitter<MatTableDataSource<T>>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public dataSource!: MatTableDataSource<T>;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.updateDataSource();
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<T>(this.data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.paginator) {
        this.dataSource = new MatTableDataSource<T>(this.data);
        this.updateDataSource();
    }
  }

  private updateDataSource(): void {
    this.dataSource.data = this.data;
    this.eventDataSource.emit(this.dataSource);
  }
}
