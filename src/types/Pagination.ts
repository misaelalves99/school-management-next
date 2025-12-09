// src/types/Pagination.ts

export interface Pagination<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  searchTerm: string;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export class PaginationModel<T> implements Pagination<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  searchTerm: string;

  constructor(
    items: T[] = [],
    currentPage = 1,
    pageSize = 10,
    totalItems = 0,
    searchTerm = '',
  ) {
    this.items = items;
    this.currentPage = currentPage;
    this.pageSize = pageSize > 0 ? pageSize : 10;
    this.totalItems = totalItems;
    this.searchTerm = searchTerm;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }
}
