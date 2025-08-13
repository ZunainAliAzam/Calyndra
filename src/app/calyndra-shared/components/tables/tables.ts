import {
  Component,
  computed,
  effect,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, filter, Observable, Subject } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface TableColumn<T> {
  property: keyof T;
  header: string;
}

interface DropdownFilter {
  name: string;
  value: any;
  options?: Array<{ value: any; display: string }>;
}

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './tables.html',
  styleUrl: './tables.css',
})
export class Tables implements OnInit {
  @Input() config: any;
  @Output() filterChange = new EventEmitter<any>();

  searchFilter = signal<string>('');
  dateRangeFilter = signal<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null,
  });
  dropdownFilters = signal<DropdownFilter[]>([]);
  paginationFilter = signal<{ pageIndex: number; pageSize: number }>({
    pageIndex: 0,
    pageSize: 10,
  });

  dataSource = signal<MatTableDataSource<any>>(new MatTableDataSource());
  private searchSubject = new Subject<string>();

  constructor(private router: Router, private route: ActivatedRoute) {
    this.searchSubject
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe((value) => {
        this.searchFilter.set(value);
        this.updateQueryParams();
      });

    effect(() => {
      const filters = {
        search: this.searchFilter(),
        dateRange: this.dateRangeFilter(),
        dropdowns: this.dropdownFilters(),
        pagination: this.paginationFilter(),
      };
      console.log('filters', filters);
      if (filters.search === '' || filters.search.length >= 3) {
        this.filterChange.emit(filters);
      }
      this.updateQueryParams();
    });
  }

  ngOnInit() {
    this.searchFilter.set(this.config.search || '');
    this.dateRangeFilter.set(
      this.config.dateRange || { startDate: null, endDate: null }
    );
    this.dropdownFilters.set(
      this.config.dropdowns?.map((d: any) => ({
        name: d.name,
        value: d.value || null,
      })) || []
    );
    this.paginationFilter.set({ pageIndex: 0, pageSize: 10 });

    this.config.data$.pipe(filter(Boolean)).subscribe((items: any) => {
      this.dataSource.set(new MatTableDataSource(items));
    });

    this.route.queryParams
      .pipe(takeUntilDestroyed())
      .subscribe((params: any) => {
        this.syncFiltersFromQueryParams(params);
      });
  }

  private syncFiltersFromQueryParams(params: any) {
    const updates: any = {};

    if (params.search !== undefined) {
      updates.search = params.search;
    }

    if (params.startDate && params.endDate) {
      updates.dateRange = {
        startDate: new Date(params.startDate),
        endDate: new Date(params.endDate),
      };
    }

    if (this.config.dropdowns) {
      updates.dropdowns = this.dropdownFilters().map((filter) => ({
        ...filter,
        value:
          params[filter.name] !== undefined
            ? params[filter.name]
            : filter.value,
      }));
    }

    if (Object.keys(updates).length) {
      this.updateFilters(updates);
    }
  }

  updateFilters(updates: any) {
    this.searchFilter.set(updates.search || '');
    this.dateRangeFilter.set(
      updates.dateRange || { startDate: null, endDate: null }
    );
    this.dropdownFilters.set(updates.dropdowns || []);
    this.paginationFilter.set(
      updates.pagination || { page: 0, pageSize: 10 }
    );
    this.updateQueryParams();
  }

  updateSearch(value: string) {
    this.searchSubject.next(value);
  }

  updateDateFilter(startDate: Date | null, endDate: Date | null) {
    this.updateFilters({ dateRange: { startDate, endDate } });
  }

  updateDropdownFilter(name: string, value: any) {
    this.updateFilters({
      dropdowns: this.dropdownFilters().map((f) =>
        f.name === name ? { ...f, value } : f
      ),
    });
  }

  updatePagination(event: any) {
    if (event.pageSize != this.config.pageSize) {
      this.updateFilters({ pagination: { pageIndex: 0, pageSize: event.pageSize } });
    } else {
      this.updateFilters({ pagination: { pageIndex: event.pageIndex, pageSize: event.pageSize } });
    }
  }

  clearFilters() {
    this.updateFilters({
      search: '',
      dateRange: { startDate: null, endDate: null },
      dropdowns: this.dropdownFilters().map((f) => ({ ...f, value: null })),
      pagination: { pageIndex: 0, pageSize: 10 },
    });
  }

  private updateQueryParams() {
    const search = this.searchFilter();
    const dateRange = this.dateRangeFilter();
    const dropdowns = this.dropdownFilters();
    const pagination = this.paginationFilter();
    const params: any = {
      search: search || null,
      startDate: dateRange.startDate?.toISOString() || null,
      endDate: dateRange.endDate?.toISOString() || null,
      pageIndex: pagination.pageIndex || null,
      pageSize: pagination.pageSize || null,
      ...Object.fromEntries(dropdowns.map((f) => [f.name, f.value || null])),
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null)
      ),
      queryParamsHandling: 'merge',
    });
  }

  get visibleColumns() {
    return this.config.columns.map((column: any) => column.property);
  }

  trackByProperty(index: number, column: TableColumn<any>) {
    return column.property;
  }
}
