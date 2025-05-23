// src/app/providers/spanish-paginator.provider.ts
import { MatPaginatorIntl } from '@angular/material/paginator';

export function getSpanishPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  
  paginatorIntl.itemsPerPageLabel = 'Ítems por página:';
  paginatorIntl.nextPageLabel = 'Siguiente página';
  paginatorIntl.previousPageLabel = 'Página anterior';
  paginatorIntl.firstPageLabel = 'Primera página';
  paginatorIntl.lastPageLabel = 'Última página';
  paginatorIntl.getRangeLabel = spanishRangeLabel;
  
  return paginatorIntl;
}

function spanishRangeLabel(page: number, pageSize: number, length: number): string {
  if (length === 0 || pageSize === 0) {
    return `0 de ${length}`;
  }

  length = Math.max(length, 0);
  const startIndex = page * pageSize;
  const endIndex = startIndex < length ? 
    Math.min(startIndex + pageSize, length) : 
    startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
}